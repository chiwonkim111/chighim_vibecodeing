/**
 * 결제 승인 API
 * 토스페이먼츠 단건결제 승인 처리
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
    const { paymentKey, orderId, amount } = await request.json();

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
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

    // 주문 정보 조회 (결제 전에 저장해둔 정보와 비교)
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .eq('user_id', user.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: '주문 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 금액 검증 (악의적인 금액 조작 방지)
    if (payment.amount !== amount) {
      return NextResponse.json(
        { error: '결제 금액이 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인 API 호출
    const confirmResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodeSecretKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const confirmData = await confirmResponse.json();

    // 결제 승인 실패 처리
    if (!confirmResponse.ok) {
      // 결제 상태를 FAILED로 업데이트
      await supabase
        .from('payments')
        .update({
          status: 'FAILED',
          failure_code: confirmData.code,
          failure_message: confirmData.message,
        })
        .eq('id', payment.id);

      return NextResponse.json(
        { 
          error: confirmData.message || '결제 승인에 실패했습니다.',
          code: confirmData.code 
        },
        { status: confirmResponse.status }
      );
    }

    // 결제 성공 - 결제 정보 업데이트
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_key: confirmData.paymentKey,
        status: 'DONE',
        method: confirmData.method,
        card_company: confirmData.card?.issuerCode,
        card_number: confirmData.card?.number,
        card_type: confirmData.card?.cardType,
        installment_months: confirmData.card?.installmentPlanMonths || 0,
        approved_at: confirmData.approvedAt,
        receipt_url: confirmData.receipt?.url,
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('결제 정보 업데이트 실패:', updateError);
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      payment: {
        paymentKey: confirmData.paymentKey,
        orderId: confirmData.orderId,
        orderName: confirmData.orderName,
        amount: confirmData.totalAmount,
        method: confirmData.method,
        approvedAt: confirmData.approvedAt,
        receipt: confirmData.receipt,
      },
    });

  } catch (error) {
    console.error('결제 승인 처리 중 오류:', error);
    return NextResponse.json(
      { error: '결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

