/**
 * Supabase 미들웨어 클라이언트
 * 세션 갱신 및 인증 상태 확인에 사용
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * 미들웨어에서 Supabase 세션 업데이트
 * 모든 요청에서 세션 상태를 확인하고 갱신
 */
export async function updateSession(request: NextRequest) {
  // 환경변수 확인 - 없으면 그냥 통과
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 환경변수가 없으면 미들웨어 스킵
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // 응답 객체 생성
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    // Supabase 클라이언트 생성
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        // 요청에서 쿠키 가져오기
        getAll() {
          return request.cookies.getAll();
        },
        // 응답에 쿠키 설정하기
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // 세션 갱신 (중요: 서버 컴포넌트에서 세션을 읽기 전에 갱신해야 함)
    await supabase.auth.getUser();
  } catch (error) {
    // 에러 발생 시 로그만 남기고 통과
    console.error('Middleware error:', error);
  }

  return response;
}
