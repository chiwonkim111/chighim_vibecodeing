/**
 * Supabase 브라우저 클라이언트
 * 클라이언트 컴포넌트에서 사용
 */
import { createBrowserClient } from '@supabase/ssr';

// 환경변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 브라우저용 Supabase 클라이언트 생성
 * 싱글톤 패턴으로 한 번만 생성
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

