/**
 * 결제 생성 API
 * 결제 요청 전 주문 정보를 DB에 저장
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const { orderId, orderName, amount, metadata } = await request.json();

    // 필수 파라미터 검증
    if (!orderId || !orderName || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 금액 검증
    if (amount <= 0) {
      return NextResponse.json(
        { error: '결제 금액은 0보다 커야 합니다.' },
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

    // 사용자 프로필에서 customerKey 가져오기
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('customer_key')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 결제 정보 저장 (결제 전에 미리 저장)
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        order_id: orderId,
        order_name: orderName,
        amount: amount,
        status: 'PENDING',
        metadata: metadata || null,
      })
      .select()
      .single();

    if (insertError) {
      // 중복 주문번호 처리
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: '이미 존재하는 주문번호입니다.' },
          { status: 409 }
        );
      }
      throw insertError;
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        orderId: payment.order_id,
        orderName: payment.order_name,
        amount: payment.amount,
        customerKey: profile.customer_key,
      },
    });

  } catch (error) {
    console.error('결제 생성 중 오류:', error);
    return NextResponse.json(
      { error: '결제 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

