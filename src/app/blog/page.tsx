/**
 * 블로그 목록 페이지
 * - SEO 최적화된 정적 블로그 목록
 * - 모든 포스트를 최신순으로 표시
 */

import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';

// SEO 메타데이터 설정
export const metadata: Metadata = {
  title: '블로그 | 바이브코딩 - AI 코딩 인사이트',
  description: 'AI 코딩, 바이브코딩, Cursor AI 활용법 등 비개발자를 위한 코딩 정보와 팁을 제공합니다. 프롬프트 엔지니어링부터 실전 프로젝트까지 다양한 콘텐츠를 만나보세요.',
  keywords: ['AI 코딩 블로그', '바이브코딩', 'Cursor AI 사용법', '비개발자 코딩', '프롬프트 엔지니어링'],
  openGraph: {
    title: '블로그 | 바이브코딩',
    description: 'AI 코딩, 바이브코딩, Cursor AI 활용법 등 비개발자를 위한 코딩 정보와 팁',
    type: 'website',
  },
};

export default function BlogPage() {
  // 모든 포스트 가져오기 (최신순 정렬됨)
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-overlay">
      {/* ===== 네비게이션 바 ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* 로고 - 홈으로 링크 */}
          <Link href="/" className="text-2xl font-bold gradient-text">
            VIBE CODING
          </Link>
          {/* 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link href="/#features" className="hover:text-white transition-colors">특징</Link>
            <Link href="/#curriculum" className="hover:text-white transition-colors">커리큘럼</Link>
            <Link href="/blog" className="text-white font-medium">블로그</Link>
          </div>
          {/* CTA 버튼 */}
          <Link href="/" className="glow-button px-6 py-2 rounded-full text-black font-semibold text-sm">
            수강 신청
          </Link>
        </div>
      </nav>

      {/* ===== 히어로 섹션 ===== */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">VIBE CODING</span> 블로그
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AI 코딩의 최신 트렌드, 실전 팁, 그리고 비개발자를 위한 
            친절한 코딩 가이드를 제공합니다.
          </p>
        </div>
      </section>

      {/* ===== 블로그 포스트 목록 ===== */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            // 포스트가 없을 때
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">아직 작성된 글이 없습니다.</p>
            </div>
          ) : (
            // 포스트 그리드
            <div className="grid gap-8">
              {posts.map((post) => (
                <article key={post.slug} className="glass-card rounded-2xl p-8 hover:border-green-400/30 transition-all duration-300 group">
                  <Link href={`/blog/${post.slug}`}>
                    {/* 카테고리 & 날짜 */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 rounded-full bg-green-400/10 text-green-400 text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(post.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {post.readingTime && (
                        <span className="text-gray-500 text-sm">
                          · {post.readingTime}
                        </span>
                      )}
                    </div>
                    
                    {/* 제목 */}
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    {/* 설명 */}
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {post.description}
                    </p>
                    
                    {/* 태그 */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* 더보기 */}
                    <div className="mt-6 text-green-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                      자세히 읽기 
                      <span>→</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== 푸터 ===== */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-2xl font-bold gradient-text">
            VIBE CODING
          </Link>
          <div className="text-gray-500 text-sm">
            © 2024 바이브코딩. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-400 text-sm">
            <Link href="/" className="hover:text-white transition-colors">홈</Link>
            <Link href="/blog" className="hover:text-white transition-colors">블로그</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

