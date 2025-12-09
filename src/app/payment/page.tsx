'use client';

/**
 * 단건결제 페이지
 * 토스페이먼츠 SDK를 사용하여 결제창 띄우기
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { createClient } from '@/lib/supabase/client';

// 결제 상품 정보
const PRODUCT = {
  name: '바이브코딩 온라인 강의',
  originalPrice: 590000,
  discountPrice: 390000,
  description: '4주 완성 AI 코딩 강의 (평생 소장)',
};

// 토스페이먼츠 클라이언트 키
const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function PaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [customerKey, setCustomerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 사용자 정보 및 customerKey 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        
        // 현재 로그인한 사용자 확인
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.push('/auth/login?redirect=/payment');
          return;
        }

        setUser({ id: user.id, email: user.email! });

        // 프로필에서 customerKey 가져오기
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('customer_key')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          setError('사용자 정보를 불러올 수 없습니다.');
          return;
        }

        setCustomerKey(profile.customer_key);
      } catch (err) {
        console.error('사용자 정보 로딩 실패:', err);
        setError('사용자 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // 결제하기 버튼 클릭 핸들러
  const handlePayment = async () => {
    if (!user || !customerKey) {
      setError('로그인이 필요합니다.');
      return;
    }

    setPaymentLoading(true);
    setError(null);

    try {
      // 1. 주문번호 생성 (고유값)
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // 2. 서버에 결제 정보 저장 (금액 조작 방지)
      const createResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          orderName: PRODUCT.name,
          amount: PRODUCT.discountPrice,
          metadata: { product_type: 'course' },
        }),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.error || '결제 정보 생성에 실패했습니다.');
      }

      // 3. 토스페이먼츠 SDK 초기화
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      
      // 4. 결제창 인스턴스 생성
      const payment = tossPayments.payment({ customerKey });

      // 5. 결제창 띄우기
      await payment.requestPayment({
        method: 'CARD', // 카드 결제
        amount: {
          currency: 'KRW',
          value: PRODUCT.discountPrice,
        },
        orderId,
        orderName: PRODUCT.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: user.email,
        card: {
          useEscrow: false,
          flowMode: 'DEFAULT',
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });

    } catch (err) {
      console.error('결제 요청 실패:', err);
      setError(err instanceof Error ? err.message : '결제 요청에 실패했습니다.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black text-white tracking-tight">
              VIBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">CODING</span>
            </h1>
          </Link>
        </div>

        {/* 결제 카드 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/20">
          {/* 상품 정보 */}
          <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">수강 신청</h2>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{PRODUCT.name}</h3>
              <p className="text-slate-400 mb-4">{PRODUCT.description}</p>
              
              <div className="flex items-baseline gap-3">
                <span className="text-slate-500 line-through text-lg">
                  {PRODUCT.originalPrice.toLocaleString()}원
                </span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {PRODUCT.discountPrice.toLocaleString()}원
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  33% 할인
                </span>
              </div>
            </div>
          </div>

          {/* 포함 내용 */}
          <div className="p-8 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">포함 내용</h3>
            <ul className="space-y-3">
              {[
                '4주 완성 커리큘럼 (총 16회 강의)',
                'Cursor AI 활용 실습 프로젝트',
                '수강생 전용 디스코드 커뮤니티',
                '평생 무제한 수강권',
                '업데이트 강의 무료 제공',
              ].map((item, index) => (
                <li key={index} className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 결제 버튼 */}
          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={paymentLoading || !customerKey}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
            >
              {paymentLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  결제창 로딩 중...
                </span>
              ) : (
                `${PRODUCT.discountPrice.toLocaleString()}원 결제하기`
              )}
            </button>

            <p className="mt-4 text-center text-slate-500 text-sm">
              결제 후 7일 이내 환불 가능
            </p>
          </div>
        </div>

        {/* 정기결제 링크 */}
        <div className="mt-6 text-center">
          <Link 
            href="/payment/subscribe" 
            className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            월간 구독 결제를 원하시나요? →
          </Link>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

