/**
 * Sitemap 자동 생성
 * - Google Search Console 등 검색엔진에 페이지 목록 제공
 * - /sitemap.xml 경로로 자동 접근 가능
 */

import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

// 사이트 기본 URL (배포 환경에 맞게 수정)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chighim-vibecodeing.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // 모든 블로그 포스트 가져오기
  const posts = getAllPosts();
  
  // 블로그 포스트 URL 생성
  const blogUrls = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 정적 페이지 URL
  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...blogUrls];
}


