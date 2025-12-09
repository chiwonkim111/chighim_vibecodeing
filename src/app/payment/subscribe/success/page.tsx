'use client';

/**
 * 구독 결제 성공 페이지
 * 토스페이먼츠에서 빌링 인증 성공 후 리다이렉트되는 페이지
 */

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// 구독 플랜 정보
const PLANS: Record<string, { name: string; price: number; cycle: string }> = {
  monthly: { name: '월간 구독', price: 49000, cycle: 'MONTHLY' },
  yearly: { name: '연간 구독', price: 390000, cycle: 'YEARLY' },
};

function SubscribeSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const processBilling = async () => {
      // URL에서 파라미터 추출
      const authKey = searchParams.get('authKey');
      const customerKey = searchParams.get('customerKey');
      const planId = searchParams.get('plan') || 'yearly';

      // 필수 파라미터 확인
      if (!authKey || !customerKey) {
        setError('인증 정보가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      const plan = PLANS[planId];
      if (!plan) {
        setError('올바르지 않은 플랜입니다.');
        setLoading(false);
        return;
      }

      try {
        // 1. 빌링키 발급
        const issueResponse = await fetch('/api/billing/issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ authKey, customerKey }),
        });

        const issueData = await issueResponse.json();

        if (!issueResponse.ok) {
          throw new Error(issueData.error || '빌링키 발급에 실패했습니다.');
        }

        // 2. Supabase에서 빌링키 ID 가져오기
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('로그인이 필요합니다.');
        }

        // 가장 최근 빌링키 가져오기
        const { data: billingKey, error: billingError } = await supabase
          .from('billing_keys')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (billingError || !billingKey) {
          throw new Error('빌링키를 찾을 수 없습니다.');
        }

        // 3. 구독 생성
        const { data: subscription, error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            billing_key_id: billingKey.id,
            plan_id: planId,
            plan_name: plan.name,
            amount: plan.price,
            billing_cycle: plan.cycle,
            status: 'PENDING',
          })
          .select()
          .single();

        if (subscriptionError) {
          throw new Error('구독 생성에 실패했습니다.');
        }

        // 4. 첫 번째 결제 실행
        const orderId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        const payResponse = await fetch('/api/billing/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            billingKeyId: billingKey.id,
            orderId,
            orderName: plan.name,
            amount: plan.price,
            subscriptionId: subscription.id,
          }),
        });

        const payData = await payResponse.json();

        if (!payResponse.ok) {
          // 결제 실패 시 구독 상태 업데이트
          await supabase
            .from('subscriptions')
            .update({ status: 'FAILED' })
            .eq('id', subscription.id);

          throw new Error(payData.error || '첫 결제에 실패했습니다.');
        }

        // 성공
        setSuccess(true);

      } catch (err) {
        console.error('구독 처리 실패:', err);
        setError(err instanceof Error ? err.message : '구독 처리에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    processBilling();
  }, [searchParams]);

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">구독 처리 중...</p>
          <p className="text-slate-400 text-sm mt-2">카드 등록 및 첫 결제를 진행하고 있습니다</p>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">구독 실패</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <div className="space-y-3">
              <Link
                href="/payment/subscribe"
                className="block w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all"
              >
                다시 시도하기
              </Link>
              <Link
                href="/"
                className="block w-full py-3 px-6 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 성공
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* 성공 아이콘 */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">구독이 시작되었습니다!</h2>
            <p className="text-slate-400 mt-2">바이브코딩의 모든 강의를 즐겨보세요 🎉</p>
          </div>

          {/* 구독 정보 */}
          <div className="bg-white/5 rounded-xl p-5 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">구독 플랜</span>
              <span className="text-white font-medium">
                {PLANS[searchParams.get('plan') || 'yearly']?.name || '연간 구독'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">결제 금액</span>
              <span className="text-white font-medium">
                {(PLANS[searchParams.get('plan') || 'yearly']?.price || 390000).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">결제 주기</span>
              <span className="text-white font-medium">
                {searchParams.get('plan') === 'monthly' ? '매월 자동 결제' : '매년 자동 결제'}
              </span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all text-center"
            >
              강의 시작하기
            </Link>
            <Link
              href="/"
              className="block w-full py-3 px-6 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-center"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscribeSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    }>
      <SubscribeSuccessContent />
    </Suspense>
  );
}

