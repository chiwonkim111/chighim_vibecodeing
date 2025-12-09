/**
 * Next.js 미들웨어
 * 모든 요청에서 Supabase 세션을 갱신
 */
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// 미들웨어가 적용될 경로 설정
// 정적 파일, 이미지, 파비콘 등은 제외
export const config = {
  matcher: [
    /*
     * 다음 경로로 시작하는 요청 제외:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     * - public 폴더의 이미지들
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

