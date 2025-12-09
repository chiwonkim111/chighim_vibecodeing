/**
 * 자동결제 승인 API
 * 빌링키를 사용하여 정기결제 승인
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 토스페이먼츠 시크릿 키 (환경변수에서 가져옴)
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!;

// 시크릿 키를 Base64로 인코딩 (Basic 인증용)
const encodeSecretKey = () => {
  return Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
};

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const { billingKeyId, orderId, orderName, amount, subscriptionId } = await request.json();

    // 필수 파라미터 검증
    if (!billingKeyId || !orderId || !orderName || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트 생성
    const supabase = await createClient();

    // 현재 로그인한 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 빌링키 정보 조회
    const { data: billingKey, error: billingError } = await supabase
      .from('billing_keys')
      .select('*')
      .eq('id', billingKeyId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (billingError || !billingKey) {
      return NextResponse.json(
        { error: '유효한 빌링키를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 토스페이먼츠 자동결제 승인 API 호출
    const payResponse = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey.billing_key}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodeSecretKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey: billingKey.customer_key,
        orderId,
        orderName,
        amount,
      }),
    });

    const payData = await payResponse.json();

    // 결제 실패 처리
    if (!payResponse.ok) {
      // 구독 결제 기록 저장 (실패)
      if (subscriptionId) {
        await supabase
          .from('subscription_payments')
          .insert({
            subscription_id: subscriptionId,
            user_id: user.id,
            order_id: orderId,
            amount,
            status: 'FAILED',
            failure_code: payData.code,
            failure_message: payData.message,
          });
      }

      return NextResponse.json(
        { 
          error: payData.message || '자동결제 승인에 실패했습니다.',
          code: payData.code 
        },
        { status: payResponse.status }
      );
    }

    // 구독 결제 기록 저장 (성공)
    if (subscriptionId) {
      await supabase
        .from('subscription_payments')
        .insert({
          subscription_id: subscriptionId,
          user_id: user.id,
          payment_key: payData.paymentKey,
          order_id: orderId,
          amount,
          status: 'DONE',
          approved_at: payData.approvedAt,
        });

      // 구독 상태 및 다음 결제일 업데이트
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('billing_cycle')
        .eq('id', subscriptionId)
        .single();

      if (subscription) {
        const now = new Date();
        const nextBillingDate = new Date(now);
        
        if (subscription.billing_cycle === 'MONTHLY') {
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        } else if (subscription.billing_cycle === 'YEARLY') {
          nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        }

        await supabase
          .from('subscriptions')
          .update({
            status: 'ACTIVE',
            current_period_start: now.toISOString(),
            current_period_end: nextBillingDate.toISOString(),
            next_billing_date: nextBillingDate.toISOString(),
          })
          .eq('id', subscriptionId);
      }
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      payment: {
        paymentKey: payData.paymentKey,
        orderId: payData.orderId,
        orderName: payData.orderName,
        amount: payData.totalAmount,
        method: payData.method,
        approvedAt: payData.approvedAt,
        receipt: payData.receipt,
      },
    });

  } catch (error) {
    console.error('자동결제 승인 처리 중 오류:', error);
    return NextResponse.json(
      { error: '자동결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

