// 카테고리 정의
export const CATEGORIES = [
  { id: 'all', name: '전체', color: '#6B7280' },
  { id: '정치', name: '정치', color: '#EF4444' },
  { id: '스포츠', name: '스포츠', color: '#10B981' },
  { id: '경제', name: '경제', color: '#3B82F6' },
  { id: '코인', name: '코인', color: '#F59E0B' },
  { id: '테크', name: '테크', color: '#8B5CF6' },
  { id: '엔터', name: '엔터', color: '#EC4899' },
  { id: '날씨', name: '날씨', color: '#06B6D4' },
  { id: '해외', name: '해외', color: '#14B8A6' },
];

// 카테고리별 색상 가져오기
export const getCategoryColor = (category) => {
  const cat = CATEGORIES.find(c => c.id === category);
  return cat ? cat.color : '#6B7280';
};

// 초기 코인
export const INITIAL_COINS = 10000;

// 날짜 포맷팅
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date - now;

  if (diff < 0) return '종료됨';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 남음`;

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes}분 남음`;
};

// 숫자 포맷팅 (천 단위 콤마)
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 확률을 퍼센트로 포맷팅
export const formatPercent = (percent) => {
  return `${Math.round(percent)}%`;
};
