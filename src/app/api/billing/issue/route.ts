/**
 * 빌링키 발급 API
 * 토스페이먼츠 자동결제(빌링) 키 발급
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
    const { authKey, customerKey } = await request.json();

    // 필수 파라미터 검증
    if (!authKey || !customerKey) {
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

    // 사용자 프로필에서 customerKey 확인
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

    // customerKey 검증
    if (profile.customer_key !== customerKey) {
      return NextResponse.json(
        { error: 'customerKey가 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 빌링키 발급 API 호출
    const issueResponse = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodeSecretKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authKey,
        customerKey,
      }),
    });

    const issueData = await issueResponse.json();

    // 빌링키 발급 실패 처리
    if (!issueResponse.ok) {
      return NextResponse.json(
        { 
          error: issueData.message || '빌링키 발급에 실패했습니다.',
          code: issueData.code 
        },
        { status: issueResponse.status }
      );
    }

    // 빌링키 저장
    const { error: insertError } = await supabase
      .from('billing_keys')
      .insert({
        user_id: user.id,
        billing_key: issueData.billingKey,
        customer_key: customerKey,
        card_company: issueData.card?.issuerCode,
        card_number: issueData.card?.number,
        card_type: issueData.card?.cardType,
        owner_type: issueData.card?.ownerType,
        authenticated_at: issueData.authenticatedAt,
      });

    if (insertError) {
      console.error('빌링키 저장 실패:', insertError);
      // 저장 실패해도 발급은 성공했으므로 응답은 반환
    }

    // 성공 응답 (billingKey는 보안상 마스킹)
    return NextResponse.json({
      success: true,
      billing: {
        cardCompany: issueData.card?.issuerCode,
        cardNumber: issueData.card?.number,
        cardType: issueData.card?.cardType,
        authenticatedAt: issueData.authenticatedAt,
      },
    });

  } catch (error) {
    console.error('빌링키 발급 처리 중 오류:', error);
    return NextResponse.json(
      { error: '빌링키 발급 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

