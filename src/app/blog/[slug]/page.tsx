/**
 * 블로그 상세 페이지
 * - 동적 라우팅으로 각 포스트 표시
 * - SEO 최적화된 메타데이터
 * - 마크다운 렌더링
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import type { Metadata } from 'next';

// 정적 페이지 생성을 위한 경로 설정
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 동적 메타데이터 생성 (SEO)
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다 | 바이브코딩',
    };
  }
  
  return {
    title: `${post.title} | 바이브코딩 블로그`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

// 마크다운을 간단한 HTML로 변환하는 함수
function parseMarkdown(content: string): string {
  let html = content;
  
  // 헤딩 변환
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-8 mb-4 text-white">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4 text-white">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-6 text-white">$1</h1>');
  
  // 굵은 텍스트
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  
  // 기울임 텍스트
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // 인라인 코드
  html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-white/10 rounded text-green-400 text-sm">$1</code>');
  
  // 코드 블록 (간단 버전)
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-black/50 border border-white/10 rounded-xl p-6 my-6 overflow-x-auto"><code class="text-green-400 text-sm">$1</code></pre>');
  
  // 리스트 (순서 없음)
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2 list-disc text-gray-300">$1</li>');
  
  // 리스트 (순서 있음)
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 list-decimal text-gray-300">$1</li>');
  
  // 인용문
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-green-400 pl-6 my-6 text-gray-400 italic">$1</blockquote>');
  
  // 링크
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // 단락
  html = html.split('\n\n').map(paragraph => {
    // 이미 HTML 태그로 감싸진 경우 건너뛰기
    if (paragraph.trim().startsWith('<')) {
      return paragraph;
    }
    // 빈 줄 건너뛰기
    if (paragraph.trim() === '') {
      return '';
    }
    return `<p class="text-gray-300 leading-relaxed mb-6">${paragraph}</p>`;
  }).join('\n');
  
  return html;
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  // 포스트가 없으면 404
  if (!post) {
    notFound();
  }
  
  // 마크다운 파싱
  const htmlContent = parseMarkdown(post.content);

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

      {/* ===== 포스트 헤더 ===== */}
      <header className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* 뒤로가기 */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <span>←</span> 블로그 목록
          </Link>
          
          {/* 카테고리 & 날짜 */}
          <div className="flex items-center gap-4 mb-6">
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
            {post.title}
          </h1>
          
          {/* 설명 */}
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            {post.description}
          </p>
          
          {/* 저자 */}
          <div className="flex items-center gap-4 pb-8 border-b border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-black font-bold">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-white">{post.author}</div>
              <div className="text-sm text-gray-500">바이브코딩 강사</div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== 포스트 본문 ===== */}
      <article className="pb-20 px-6">
        <div 
          className="max-w-3xl mx-auto prose prose-invert"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      {/* ===== 태그 ===== */}
      {post.tags.length > 0 && (
        <section className="pb-12 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-4">태그</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-4 py-2 rounded-full bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA 섹션 ===== */}
      <section className="py-16 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            AI 코딩을 직접 배워보고 싶으신가요?
          </h2>
          <p className="text-gray-400 mb-8">
            바이브코딩과 함께라면 4주 만에 나만의 웹 서비스를 만들 수 있습니다.
          </p>
          <Link 
            href="/"
            className="inline-block glow-button px-8 py-4 rounded-full text-black font-bold text-lg"
          >
            무료 체험 시작하기 →
          </Link>
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


