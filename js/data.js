/* =========================================================
   포트폴리오 콘텐츠 — 여기만 고치면 사이트 내용이 바뀝니다.
   ========================================================= */

window.PROFILE = {
  name: 'SUBIN YUN',
  nameKo: '윤수빈',
  role: 'UI/UX Designer',
  tagline: '사람의 손에 닿는 작은 순간을 설계합니다.',
  email: 'hello@your-domain.com',
  links: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { label: 'Behance', url: 'https://www.behance.net/' },
    { label: 'GitHub', url: 'https://github.com/' },
  ],
  resumeUrl: '#',
};

/* 캐릭터 시트의 스킬 — 패치(프로젝트)를 열어볼 때마다 하나씩 공개됩니다. */
window.STATS = {
  visual: { label: '비주얼 디자인', short: 'VIS', value: 92, color: '#ffb3c7' },
  ux:     { label: 'UX 리서치',     short: 'UXR', value: 86, color: '#bde0fe' },
  system: { label: '디자인 시스템', short: 'SYS', value: 95, color: '#c8f0dc' },
  proto:  { label: '프로토타이핑',  short: 'PRT', value: 90, color: '#ffd6a5' },
  lead:   { label: '리더십',        short: 'LDR', value: 84, color: '#d9c8f5' },
  ai:     { label: 'AI 활용',       short: 'AI',  value: 88, color: '#fff1a8' },
};

/* 매트 위 자수 패치 = 프로젝트 / 강점
   x, y: 매트 기준 % 위치 · w: 패치 너비(px) · rot: 회전(deg) */
window.PATCHES = [
  {
    id: 'handson', shape: 'badge', title: 'HANDS-ON', sub: 'CRAFT + CODE', icon: 'cursor',
    fill: '#ffd6a5', edge: '#f2a65a', ink: '#6b3f2a', accent: '#ff8fab',
    x: 16, y: 21, w: 168, rot: -12, stat: 'proto',
    project: {
      name: '디자인 시스템 “Mochi UI”',
      period: '2024.03 — 2025.02', role: 'Design System Lead · Figma × React',
      summary: '6개 제품이 각자 쓰던 컴포넌트를 하나의 토큰 기반 시스템으로 통합했어요.',
      problem: '팀마다 버튼이 23종, 색상 토큰이 140개. 같은 화면도 제품마다 다르게 보였습니다.',
      process: ['컴포넌트 전수조사 & 중복 지도 만들기', '시맨틱 토큰 3단 구조 설계', 'Figma ↔ 코드 동기화 파이프라인 직접 구현', '팀별 마이그레이션 워크숍 운영'],
      outcome: '디자인–개발 핸드오프 질문이 눈에 띄게 줄고, 신규 화면 제작 속도가 빨라졌어요.',
      metrics: [{ v: '-42%', l: 'UI 개발 시간' }, { v: '140→38', l: '컬러 토큰' }, { v: '6', l: '통합 제품' }],
      tags: ['Design Tokens', 'Figma Variables', 'React', 'Storybook'],
    },
  },
  {
    id: 'zero', shape: 'squircle', title: '0 → 1', sub: 'HEAD OF DESIGN', icon: 'waves',
    fill: '#c8f0dc', edge: '#7cc6a4', ink: '#2f5d4c', accent: '#ffffff',
    x: 37, y: 15, w: 160, rot: 9, stat: 'lead',
    project: {
      name: '핀테크 앱 “Pocket” 0→1 런칭',
      period: '2022.06 — 2023.08', role: 'Head of Design · 디자이너 4명 리드',
      summary: '아이디어 단계부터 앱스토어 출시까지, 첫 디자인 팀을 만들고 제품을 런칭했어요.',
      problem: '20대 사회초년생에게 “저축”은 숙제처럼 느껴졌습니다. 재미있게 모으는 경험이 필요했어요.',
      process: ['사용자 인터뷰 32회 & 저널링 스터디', '“저금통 깨기” 콘셉트 프로토타입 3종 A/B', '디자인 팀 채용·리추얼·크리틱 문화 구축', '출시 후 주간 실험 루프 운영'],
      outcome: '출시 6개월 만에 MAU 18만, 앱스토어 금융 카테고리 Top 10에 들었어요.',
      metrics: [{ v: '180K', l: 'MAU (6개월)' }, { v: '4.8★', l: '앱스토어 평점' }, { v: 'Top10', l: '금융 카테고리' }],
      tags: ['0→1', 'Team Building', 'Mobile', 'Fintech'],
    },
  },
  {
    id: 'senior', shape: 'circle', title: 'SENIOR', sub: 'PRODUCT DESIGNER', icon: 'burst',
    fill: '#d9c8f5', edge: '#ff9fb2', ink: '#4b3a66', accent: '#fff1a8',
    x: 81, y: 21, w: 178, rot: 6, stat: 'visual',
    project: {
      name: '커머스 상세페이지 리디자인',
      period: '2021.01 — 2021.09', role: 'Senior Product Designer',
      summary: '정보가 넘치던 상품 상세 화면을 “결정에 필요한 것만” 남기도록 재설계했어요.',
      problem: '스크롤 길이 평균 14화면, 구매 버튼까지 도달하는 사용자는 31%뿐이었습니다.',
      process: ['히트맵 & 세션 리플레이 분석', '정보 위계 카드소팅', '스티키 구매 바 & 요약 카드 설계', '단계적 롤아웃 실험'],
      outcome: '구매 전환율과 체류 품질이 함께 올라갔고, 이 패턴이 전사 템플릿이 되었어요.',
      metrics: [{ v: '+18%', l: '구매 전환율' }, { v: '-35%', l: '스크롤 길이' }],
      tags: ['E-commerce', 'Visual', 'Experiment'],
    },
  },
  {
    id: 'ai', shape: 'star', title: 'AI-NATIVE', sub: 'BUILDER', icon: 'sparkle',
    fill: '#bde0fe', edge: '#8b7fd9', ink: '#2d2a5a', accent: '#ffb3c7',
    x: 82, y: 53, w: 190, rot: -14, stat: 'ai',
    project: {
      name: 'AI 글쓰기 도우미 “Doodle”',
      period: '2025.03 — 현재', role: 'Product Designer · Prompt & UX',
      summary: 'LLM 응답을 “기다리는 시간”까지 디자인한 AI 글쓰기 도구예요.',
      problem: 'AI가 무엇을 하고 있는지 모르면 사용자는 결과를 믿지 못했습니다.',
      process: ['AI 응답 상태 7단계 정의', '스트리밍 UI & 되돌리기 패턴', '프롬프트를 디자인 자산으로 관리', '바이브코딩으로 주 2회 프로토타입'],
      outcome: '“AI가 나를 이해한다”는 응답 비율이 2배가 되었어요.',
      metrics: [{ v: '×2', l: '신뢰도 응답' }, { v: '9일', l: '아이디어→베타' }],
      tags: ['AI UX', 'LLM', 'Prototyping'],
    },
  },
  {
    id: 'vanilla', shape: 'blob', title: 'NOT', title2: 'VANILLA', sub: 'BRAND EXPERIENCE', icon: 'cherry',
    fill: '#ffc8dd', edge: '#ff9fb2', ink: '#7a2e4a', accent: '#fff1a8',
    x: 17, y: 79, w: 200, rot: -6, stat: 'visual',
    project: {
      name: '디저트 브랜드 “Sundae Club” 리브랜딩',
      period: '2020.04 — 2020.10', role: 'Brand & UX Designer',
      summary: '평범한 아이스크림 가게를 “기분 좋은 동네 놀이터” 브랜드로 바꿨어요.',
      problem: '맛은 좋은데 기억에 남지 않는 브랜드. 재방문율이 낮았습니다.',
      process: ['브랜드 키워드 워크숍', '패키지·키오스크·앱 통합 아이덴티티', '스탬프 리워드 게이미피케이션', '매장 동선 서비스 블루프린트'],
      outcome: '스탬프 리워드 도입 후 재방문율이 크게 늘었어요.',
      metrics: [{ v: '+64%', l: '재방문율' }, { v: '3', l: '신규 매장 오픈' }],
      tags: ['Branding', 'Service Design', 'Kiosk'],
    },
  },
  {
    id: 'cred', shape: 'octagon', title: 'CRED', sub: 'LEAD PRODUCT DESIGNER', icon: 'shield',
    fill: '#fff1a8', edge: '#6b5b7b', ink: '#3d3350', accent: '#ffffff',
    x: 39, y: 81, w: 136, rot: 4, stat: 'ux',
    project: {
      name: 'B2B 대시보드 사용성 개선',
      period: '2019.02 — 2019.12', role: 'Lead Product Designer',
      summary: '데이터는 많지만 아무도 보지 않던 대시보드를 “매일 여는 화면”으로 만들었어요.',
      problem: '운영 담당자의 72%가 엑셀로 데이터를 다시 내려받아 보고 있었습니다.',
      process: ['현장 관찰(컨텍스추얼 인쿼리) 12회', '잡 투 비 던(JTBD) 정리', '위젯형 커스텀 대시보드 설계', '사용성 테스트 3라운드'],
      outcome: '엑셀 다운로드가 급감하고 대시보드 일간 사용자 수가 늘었어요.',
      metrics: [{ v: '-58%', l: '엑셀 다운로드' }, { v: '×3', l: 'DAU' }],
      tags: ['B2B', 'Data Viz', 'Usability Test'],
    },
  },
  {
    id: 'years', shape: 'scallop', title: '8', sub: 'YEARS', sub2: 'DESIGN JOURNEY', icon: 'laurel',
    fill: '#ffb3c7', edge: '#f7d58b', ink: '#6e2b45', accent: '#fffaf0',
    x: 82, y: 82, w: 186, rot: 8, stat: 'system',
    project: {
      name: '8년의 디자인 여정',
      period: '2018 — 2026', role: '에이전시 → 스타트업 → 플랫폼',
      summary: '작은 에이전시에서 시작해 스타트업과 플랫폼 회사를 거쳤어요.',
      problem: '“예쁜 화면”을 넘어 “일하는 방식”을 디자인하고 싶었습니다.',
      process: ['2018 · 에이전시 UI 디자이너', '2019 · B2B SaaS 리드 디자이너', '2021 · 커머스 시니어 디자이너', '2022 · 핀테크 Head of Design', '2025 · AI 프로덕트 디자이너'],
      outcome: '지금은 디자인과 코드, AI 사이를 오가며 만드는 사람으로 일하고 있어요.',
      metrics: [{ v: '8yrs', l: '경력' }, { v: '30+', l: '출시 프로젝트' }, { v: '12', l: '함께 성장한 디자이너' }],
      tags: ['Career', 'Mentoring', 'Speaker'],
    },
  },
];

/* 퀘스트 — id 는 app.js 에서 사용합니다. */
window.QUESTS = [
  { id: 'firstPatch', title: '첫 번째 패치 열어보기',       xp: 30 },
  { id: 'feed',       title: '펫에게 밥 주기',              xp: 30 },
  { id: 'flip',       title: '출입증 뒤집어 보기',          xp: 40 },
  { id: 'swing',      title: '출입증 힘껏 흔들기',          xp: 40 },
  { id: 'stick1',     title: '패치를 출입증에 붙이기',      xp: 60 },
  { id: 'view4',      title: '프로젝트 4개 살펴보기',       xp: 60 },
  { id: 'name',       title: '펫에게 이름 지어주기',        xp: 30 },
  { id: 'play',       title: '펫과 놀아주기',               xp: 30 },
  { id: 'stick3',     title: '출입증에 패치 3개 붙이기',    xp: 80 },
  { id: 'contact',    title: '엽서 보내기 (연락처 열기)',   xp: 50 },
  { id: 'secret',     title: '매트 위 숨은 무당벌레 찾기',  xp: 120, hidden: true },
  { id: 'allPatch',   title: '모든 패치 수집하기',          xp: 150 },
];

/* 레벨 기준 XP — Lv.1 부터 */
window.LEVELS = [0, 120, 300, 520, 800];

window.LEVEL_TEXT = [
  '',
  '알이 따뜻해지고 있어요…',
  '알이 깨졌어요! 말랑한 친구가 태어났어요.',
  '머리에 새싹이 돋았어요. 호기심 +1',
  '디자이너 베레모를 얻었어요!',
  '연필과 반짝이를 얻었어요. 이제 진짜 디자이너! VIP 출입증이 발급됩니다.',
];
