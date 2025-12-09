'use client';

/**
 * 정기결제(구독) 페이지
 * 토스페이먼츠 SDK를 사용하여 빌링키 발급
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { createClient } from '@/lib/supabase/client';

// 구독 플랜 정보
const PLANS = [
  {
    id: 'monthly',
    name: '월간 구독',
    price: 49000,
    cycle: 'MONTHLY',
    description: '매월 자동 결제',
    features: ['모든 강의 무제한 수강', '신규 강의 즉시 접근', '커뮤니티 액세스'],
  },
  {
    id: 'yearly',
    name: '연간 구독',
    price: 390000,
    originalPrice: 588000,
    cycle: 'YEARLY',
    description: '연 1회 결제 (33% 할인)',
    badge: '인기',
    features: ['모든 강의 무제한 수강', '신규 강의 즉시 접근', '커뮤니티 액세스', '1:1 멘토링 (월 1회)'],
  },
];

// 토스페이먼츠 클라이언트 키
const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function SubscribePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [customerKey, setCustomerKey] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0]>(PLANS[1]);
  const [loading, setLoading] = useState(true);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 사용자 정보 및 customerKey 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        
        // 현재 로그인한 사용자 확인
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.push('/auth/login?redirect=/payment/subscribe');
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

  // 구독하기 버튼 클릭 핸들러
  const handleSubscribe = async () => {
    if (!user || !customerKey) {
      setError('로그인이 필요합니다.');
      return;
    }

    setSubscribeLoading(true);
    setError(null);

    try {
      // 1. 토스페이먼츠 SDK 초기화
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      
      // 2. 결제창 인스턴스 생성
      const payment = tossPayments.payment({ customerKey });

      // 3. 빌링 인증창 띄우기
      await payment.requestBillingAuth({
        method: 'CARD', // 카드 자동결제
        successUrl: `${window.location.origin}/payment/subscribe/success?plan=${selectedPlan.id}`,
        failUrl: `${window.location.origin}/payment/subscribe/fail`,
        customerEmail: user.email,
        customerName: user.email.split('@')[0],
      });

    } catch (err) {
      console.error('빌링 인증 요청 실패:', err);
      setError(err instanceof Error ? err.message : '빌링 인증 요청에 실패했습니다.');
    } finally {
      setSubscribeLoading(false);
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

      <div className="relative max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black text-white tracking-tight">
              VIBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">CODING</span>
            </h1>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">구독 플랜 선택</h2>
          <p className="mt-2 text-slate-400">언제든지 취소할 수 있는 정기 구독</p>
        </div>

        {/* 플랜 선택 카드 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`relative cursor-pointer rounded-2xl p-6 transition-all ${
                selectedPlan.id === plan.id
                  ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-2 border-purple-500'
                  : 'bg-white/5 border-2 border-transparent hover:border-white/20'
              }`}
            >
              {/* 인기 배지 */}
              {plan.badge && (
                <span className="absolute -top-3 left-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              {/* 선택 표시 */}
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPlan.id === plan.id
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-white/30'
              }`}>
                {selectedPlan.id === plan.id && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

              <div className="mb-4">
                {plan.originalPrice && (
                  <span className="text-slate-500 line-through text-sm mr-2">
                    {plan.originalPrice.toLocaleString()}원
                  </span>
                )}
                <span className="text-3xl font-bold text-white">
                  {plan.price.toLocaleString()}
                </span>
                <span className="text-slate-400">원/{plan.cycle === 'MONTHLY' ? '월' : '년'}</span>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-slate-300 text-sm">
                    <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* 구독 버튼 */}
        <div className="max-w-md mx-auto">
          <button
            onClick={handleSubscribe}
            disabled={subscribeLoading || !customerKey}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
          >
            {subscribeLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                카드 등록 중...
              </span>
            ) : (
              `${selectedPlan.name} 시작하기 - ${selectedPlan.price.toLocaleString()}원/${selectedPlan.cycle === 'MONTHLY' ? '월' : '년'}`
            )}
          </button>

          <p className="mt-4 text-center text-slate-500 text-sm">
            카드를 등록하면 {selectedPlan.cycle === 'MONTHLY' ? '매월' : '매년'} 자동 결제됩니다
            <br />
            언제든지 구독을 취소할 수 있습니다
          </p>
        </div>

        {/* 단건결제 링크 */}
        <div className="mt-8 text-center">
          <Link 
            href="/payment" 
            className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            평생 소장 강의를 한 번에 구매하고 싶으신가요? →
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

