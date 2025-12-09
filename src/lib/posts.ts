/**
 * 블로그 포스트 관리 유틸리티
 * - 마크다운 파일을 읽어서 파싱
 * - 정적 블로그 시스템을 위한 핵심 함수들
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 포스트가 저장된 디렉토리 경로
const postsDirectory = path.join(process.cwd(), 'src/content/posts');

// 포스트 메타데이터 타입 정의
export interface PostMeta {
  slug: string;           // URL 경로용 슬러그
  title: string;          // 제목
  description: string;    // 설명 (SEO용)
  date: string;           // 작성일
  author: string;         // 작성자
  category: string;       // 카테고리
  tags: string[];         // 태그 목록
  thumbnail?: string;     // 썸네일 이미지 (선택)
  readingTime?: string;   // 예상 읽기 시간
}

// 포스트 전체 데이터 타입 정의
export interface Post extends PostMeta {
  content: string;        // 본문 내용 (마크다운)
}

/**
 * 모든 포스트의 슬러그 목록을 가져옵니다
 * - 정적 페이지 생성(generateStaticParams)에 사용
 */
export function getAllPostSlugs(): string[] {
  // posts 디렉토리가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}

/**
 * 모든 포스트의 메타데이터를 가져옵니다
 * - 블로그 목록 페이지에서 사용
 * - 최신순으로 정렬
 */
export function getAllPosts(): PostMeta[] {
  // posts 디렉토리가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // gray-matter로 frontmatter 파싱
      const { data } = matter(fileContents);
      
      return {
        slug,
        title: data.title || '제목 없음',
        description: data.description || '',
        date: data.date || '',
        author: data.author || '익명',
        category: data.category || '미분류',
        tags: data.tags || [],
        thumbnail: data.thumbnail,
        readingTime: data.readingTime,
      } as PostMeta;
    });
  
  // 날짜 기준 최신순 정렬
  return allPosts.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
}

/**
 * 특정 슬러그의 포스트 전체 데이터를 가져옵니다
 * - 블로그 상세 페이지에서 사용
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title || '제목 없음',
      description: data.description || '',
      date: data.date || '',
      author: data.author || '익명',
      category: data.category || '미분류',
      tags: data.tags || [],
      thumbnail: data.thumbnail,
      readingTime: data.readingTime,
      content,
    };
  } catch {
    return null;
  }
}

/**
 * 카테고리별 포스트 목록을 가져옵니다
 */
export function getPostsByCategory(category: string): PostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.category === category);
}

/**
 * 태그별 포스트 목록을 가져옵니다
 */
export function getPostsByTag(tag: string): PostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.tags.includes(tag));
}

/**
 * 모든 카테고리 목록을 가져옵니다
 */
export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = new Set(allPosts.map(post => post.category));
  return Array.from(categories);
}

/**
 * 모든 태그 목록을 가져옵니다
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set(allPosts.flatMap(post => post.tags));
  return Array.from(tags);
}


