'use client';

/**
 * 결제 성공 페이지
 * 토스페이먼츠에서 결제 인증 성공 후 리다이렉트되는 페이지
 */

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    orderId: string;
    orderName: string;
    amount: number;
    method: string;
    approvedAt: string;
  } | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      // URL에서 결제 정보 파라미터 추출
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      // 필수 파라미터 확인
      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      try {
        // 서버에서 결제 승인 처리
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '결제 승인에 실패했습니다.');
        }

        // 결제 정보 저장
        setPaymentInfo({
          orderId: data.payment.orderId,
          orderName: data.payment.orderName,
          amount: data.payment.amount,
          method: data.payment.method,
          approvedAt: new Date(data.payment.approvedAt).toLocaleString('ko-KR'),
        });

      } catch (err) {
        console.error('결제 승인 실패:', err);
        setError(err instanceof Error ? err.message : '결제 승인에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">결제 승인 처리 중...</p>
          <p className="text-slate-400 text-sm mt-2">잠시만 기다려주세요</p>
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
            <h2 className="text-2xl font-bold text-white mb-2">결제 승인 실패</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <div className="space-y-3">
              <Link
                href="/payment"
                className="block w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all"
              >
                다시 결제하기
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

  // 결제 성공
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
            <h2 className="text-2xl font-bold text-white">결제가 완료되었습니다!</h2>
            <p className="text-slate-400 mt-2">바이브코딩에 오신 것을 환영합니다 🎉</p>
          </div>

          {/* 결제 정보 */}
          {paymentInfo && (
            <div className="bg-white/5 rounded-xl p-5 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">상품명</span>
                <span className="text-white font-medium">{paymentInfo.orderName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">결제금액</span>
                <span className="text-white font-medium">{paymentInfo.amount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">결제수단</span>
                <span className="text-white font-medium">{paymentInfo.method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">결제일시</span>
                <span className="text-white font-medium">{paymentInfo.approvedAt}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">주문번호</span>
                <span className="text-white font-medium text-xs">{paymentInfo.orderId}</span>
              </div>
            </div>
          )}

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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

