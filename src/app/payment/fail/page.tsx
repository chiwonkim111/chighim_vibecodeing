'use client';

/**
 * 결제 실패 페이지
 * 토스페이먼츠에서 결제 인증 실패 후 리다이렉트되는 페이지
 */

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  // 에러 코드별 메시지
  const getErrorDescription = (code: string | null) => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제가 취소되었습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제가 중단되었습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거절했습니다.';
      case 'INVALID_CARD_NUMBER':
        return '카드 번호가 올바르지 않습니다.';
      case 'INVALID_CARD_EXPIRATION':
        return '카드 유효기간이 올바르지 않습니다.';
      case 'EXCEED_MAX_AMOUNT':
        return '결제 한도를 초과했습니다.';
      default:
        return errorMessage || '결제 처리 중 오류가 발생했습니다.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
          {/* 실패 아이콘 */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">결제에 실패했습니다</h2>
          <p className="text-slate-400 mb-6">{getErrorDescription(errorCode)}</p>

          {/* 에러 상세 정보 */}
          {(errorCode || orderId) && (
            <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
              {errorCode && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">에러 코드</span>
                  <span className="text-slate-300 font-mono">{errorCode}</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">주문 번호</span>
                  <span className="text-slate-300 font-mono text-xs">{orderId}</span>
                </div>
              )}
            </div>
          )}

          {/* 버튼 */}
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

          {/* 도움말 */}
          <p className="mt-6 text-slate-500 text-sm">
            문제가 계속되면{' '}
            <a href="mailto:support@vibecoding.com" className="text-purple-400 hover:text-purple-300">
              고객센터
            </a>
            로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}

