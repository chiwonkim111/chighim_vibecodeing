"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-overlay">
      {/* ===== 네비게이션 바 ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* 로고 */}
          <div className="text-2xl font-bold gradient-text">
            VIBE CODING
          </div>
          {/* 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">특징</a>
            <a href="#curriculum" className="hover:text-white transition-colors">커리큘럼</a>
            <a href="#instructor" className="hover:text-white transition-colors">강사소개</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          {/* CTA 버튼 */}
          <button className="glow-button px-6 py-2 rounded-full text-black font-semibold text-sm">
            수강 신청
          </button>
        </div>
      </nav>

      {/* ===== 히어로 섹션 ===== */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm text-gray-400">2024년 신규 오픈</span>
          </div>
          
          {/* 메인 타이틀 */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-slide-up delay-100">
            코딩을 몰라도<br />
            <span className="gradient-text">AI와 함께라면</span><br />
            누구나 개발자
          </h1>
          
          {/* 서브 타이틀 */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up delay-200">
            Cursor AI를 활용한 실전 프로젝트 중심의 강의로<br />
            단 4주 만에 나만의 웹 서비스를 만들어보세요
          </p>
          
          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
            <button className="glow-button px-8 py-4 rounded-full text-black font-bold text-lg">
              무료 체험 시작하기 →
            </button>
            <button className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">
              커리큘럼 보기
            </button>
          </div>
          
          {/* 통계 */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 animate-slide-up delay-400">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">500+</div>
              <div className="text-sm text-gray-500 mt-1">수강생</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">98%</div>
              <div className="text-sm text-gray-500 mt-1">만족도</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">4주</div>
              <div className="text-sm text-gray-500 mt-1">완성 기간</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 특징 섹션 ===== */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* 섹션 타이틀 */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              왜 <span className="gradient-text">바이브코딩</span>인가요?
            </h2>
            <p className="text-gray-400 text-lg">
              기존 코딩 교육과는 완전히 다른 접근법
            </p>
          </div>
          
          {/* 특징 카드 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 카드 1 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400/20 to-cyan-400/20 flex items-center justify-center mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI 기반 학습</h3>
              <p className="text-gray-400 leading-relaxed">
                Cursor AI를 활용해 코드를 직접 작성하지 않아도 원하는 기능을 구현할 수 있습니다.
              </p>
            </div>
            
            {/* 카드 2 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">비개발자 맞춤형</h3>
              <p className="text-gray-400 leading-relaxed">
                전문 용어 없이 쉬운 설명으로 누구나 이해할 수 있는 커리큘럼을 제공합니다.
              </p>
            </div>
            
            {/* 카드 3 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-3">실전 프로젝트</h3>
              <p className="text-gray-400 leading-relaxed">
                이론만 배우는 것이 아닌, 실제 서비스를 만들며 배우는 프로젝트 중심 학습입니다.
              </p>
            </div>
            
            {/* 카드 4 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400/20 to-red-400/20 flex items-center justify-center mb-6">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold mb-3">프롬프트 마스터</h3>
              <p className="text-gray-400 leading-relaxed">
                AI에게 효과적으로 질문하는 프롬프트 작성 스킬을 체계적으로 배웁니다.
              </p>
            </div>
            
            {/* 카드 5 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-3">커뮤니티 지원</h3>
              <p className="text-gray-400 leading-relaxed">
                수강생 전용 디스코드 채널에서 질문하고 동료들과 함께 성장합니다.
              </p>
            </div>
            
            {/* 카드 6 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-400/20 flex items-center justify-center mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-3">포트폴리오 완성</h3>
              <p className="text-gray-400 leading-relaxed">
                강의가 끝나면 실제 배포 가능한 웹 서비스 포트폴리오가 완성됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 커리큘럼 섹션 ===== */}
      <section id="curriculum" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          {/* 섹션 타이틀 */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              4주 완성 <span className="gradient-text">커리큘럼</span>
            </h2>
            <p className="text-gray-400 text-lg">
              단계별로 차근차근, 누구나 따라올 수 있습니다
            </p>
          </div>
          
          {/* 타임라인 */}
          <div className="space-y-6">
            {/* Week 1 */}
            <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-black font-bold text-xl">
                  W1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">AI 코딩 환경 셋업</h3>
                <p className="text-gray-400 mb-4">
                  Cursor AI 설치부터 기본 사용법까지, 개발 환경을 완벽하게 세팅합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">Cursor 설치</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">AI 프롬프트 기초</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">첫 코드 생성</span>
                </div>
              </div>
            </div>
            
            {/* Week 2 */}
            <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-black font-bold text-xl">
                  W2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">웹 기초 & 랜딩페이지</h3>
                <p className="text-gray-400 mb-4">
                  HTML, CSS의 기본 개념을 이해하고 멋진 랜딩페이지를 직접 만들어봅니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">웹 구조 이해</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">반응형 디자인</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">랜딩페이지 제작</span>
                </div>
              </div>
            </div>
            
            {/* Week 3 */}
            <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-black font-bold text-xl">
                  W3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">기능 구현 & 데이터</h3>
                <p className="text-gray-400 mb-4">
                  JavaScript와 데이터베이스 연동으로 실제 동작하는 기능을 만듭니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">인터랙션 추가</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">Supabase 연동</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">CRUD 구현</span>
                </div>
              </div>
            </div>
            
            {/* Week 4 */}
            <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-black font-bold text-xl">
                  W4
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">배포 & 런칭</h3>
                <p className="text-gray-400 mb-4">
                  완성된 서비스를 세상에 공개하고, 실제 사용자를 맞이할 준비를 합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">Vercel 배포</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">도메인 연결</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">최적화 & 마무리</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 강사 소개 섹션 ===== */}
      <section id="instructor" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
            {/* 프로필 이미지 영역 */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-green-400/30 to-cyan-400/30 flex items-center justify-center">
                <span className="text-8xl">👨‍💻</span>
              </div>
            </div>
            
            {/* 소개 텍스트 */}
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-green-400 font-medium mb-2">Instructor</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">김치원 강사</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                10년차 개발자이자 스타트업 CTO 출신으로, 비개발자들이 AI를 활용해 
                자신만의 서비스를 만들 수 있도록 돕고 있습니다. &quot;코딩은 도구일 뿐, 
                진짜 중요한 건 아이디어입니다&quot;라는 철학으로 수백 명의 수강생을 배출했습니다.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 rounded-full bg-white/5 text-sm text-gray-300">
                  前 스타트업 CTO
                </span>
                <span className="px-4 py-2 rounded-full bg-white/5 text-sm text-gray-300">
                  AI 코딩 전문가
                </span>
                <span className="px-4 py-2 rounded-full bg-white/5 text-sm text-gray-300">
                  500+ 수강생 배출
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ 섹션 ===== */}
      <section id="faq" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          {/* 섹션 타이틀 */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              자주 묻는 <span className="gradient-text">질문</span>
            </h2>
          </div>
          
          {/* FAQ 리스트 */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">코딩을 전혀 몰라도 수강할 수 있나요?</h4>
              <p className="text-gray-400">
                네, 물론입니다! 이 강의는 완전한 비개발자를 위해 설계되었습니다. 
                컴퓨터 기본 조작만 할 수 있다면 누구나 수강 가능합니다.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">강의 수강에 필요한 준비물이 있나요?</h4>
              <p className="text-gray-400">
                노트북(Windows/Mac)만 있으면 됩니다. Cursor AI는 무료 버전으로도 
                충분히 학습 가능하며, 필요한 모든 도구는 강의에서 안내해 드립니다.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">강의 기간 동안 질문은 어떻게 하나요?</h4>
              <p className="text-gray-400">
                수강생 전용 디스코드 채널이 운영됩니다. 실시간으로 질문하고 
                강사님과 동료 수강생들과 소통할 수 있습니다.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-2">강의 수강 후에도 영상을 볼 수 있나요?</h4>
              <p className="text-gray-400">
                네, 한 번 결제하시면 평생 무제한으로 강의 영상을 시청하실 수 있습니다. 
                업데이트되는 내용도 추가 비용 없이 제공됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA 섹션 ===== */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            지금 바로<br />
            <span className="gradient-text">바이브코딩</span>을 시작하세요
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            더 이상 미루지 마세요. AI 시대, 당신의 아이디어를 현실로 만들 수 있는 
            가장 빠른 방법입니다.
          </p>
          
          {/* 가격 카드 */}
          <div className="glass-card rounded-3xl p-8 md:p-12 max-w-md mx-auto mb-8">
            <div className="text-sm text-green-400 font-medium mb-2">Early Bird 할인</div>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-gray-500 line-through text-2xl">₩590,000</span>
              <span className="text-5xl font-black gradient-text">₩390,000</span>
            </div>
            <p className="text-gray-500 text-sm mb-8">평생 소장 / 무제한 수강</p>
            <button className="w-full glow-button py-4 rounded-full text-black font-bold text-lg">
              지금 수강 신청하기
            </button>
          </div>
          
          <p className="text-gray-500 text-sm">
            ✓ 7일 환불 보장 &nbsp;&nbsp; ✓ 평생 수강 &nbsp;&nbsp; ✓ 커뮤니티 액세스
          </p>
        </div>
      </section>

      {/* ===== 푸터 ===== */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold gradient-text">
            VIBE CODING
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 바이브코딩. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">문의하기</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
