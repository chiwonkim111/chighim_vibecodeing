/**
 * OAuth 콜백 라우트
 * 이메일 확인 후 리다이렉트 처리
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // "next" 파라미터가 있으면 해당 경로로 리다이렉트
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 인증 성공 - 지정된 경로로 리다이렉트
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 에러 발생 시 에러 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

