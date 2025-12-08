import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// 한국어 지원을 위한 Noto Sans KR 폰트 설정
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

// 메타데이터 설정 - SEO 및 페이지 정보
export const metadata: Metadata = {
  title: "바이브코딩 | 비개발자를 위한 AI 코딩 강의",
  description: "코딩을 몰라도 AI와 함께라면 누구나 개발자가 될 수 있습니다. Cursor AI를 활용한 실전 프로젝트 중심 강의",
  keywords: ["바이브코딩", "AI 코딩", "비개발자 코딩", "Cursor AI", "프롬프트 코딩"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 한국어 설정
    <html lang="ko">
      <head>
        {/* Google AdSense 확인용 스크립트 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7096578701302391"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${notoSansKR.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
