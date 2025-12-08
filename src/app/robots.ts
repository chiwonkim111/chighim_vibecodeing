/**
 * robots.txt 자동 생성
 * - 검색엔진 크롤러 가이드
 * - /robots.txt 경로로 자동 접근 가능
 */

import { MetadataRoute } from 'next';

// 사이트 기본 URL (배포 환경에 맞게 수정)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chighim-vibecodeing.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

