/**
 * RSS 피드 생성
 * - /feed.xml 경로로 접근 가능
 * - RSS 리더 및 뉴스 수집기에서 구독 가능
 */

import { getAllPosts } from '@/lib/posts';

// 사이트 기본 URL (배포 환경에 맞게 수정)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chighim-vibecodeing.vercel.app';

// 사이트 정보
const SITE_TITLE = '바이브코딩 블로그';
const SITE_DESCRIPTION = 'AI 코딩, 바이브코딩, Cursor AI 활용법 등 비개발자를 위한 코딩 정보와 팁을 제공합니다.';

/**
 * XML 특수문자 이스케이프 처리
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * RSS 2.0 형식의 XML 생성
 */
function generateRssFeed(): string {
  const posts = getAllPosts();
  
  const rssItems = posts
    .map((post) => {
      const postUrl = `${BASE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author)}</author>
      <category>${escapeXml(post.category)}</category>
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;
}

/**
 * GET 요청 처리 - RSS XML 반환
 */
export async function GET() {
  const feed = generateRssFeed();
  
  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

