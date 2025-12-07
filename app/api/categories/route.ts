import { NextResponse } from 'next/server'

// 카테고리, 레벨, 콘텐츠 유형 정보
const CATEGORIES = [
  { id: 'legal', name: '법률/행정', icon: '⚖️', description: '창업 필수 법률 지식' },
  { id: 'mindset', name: '마인드셋', icon: '🧠', description: '창업가 마인드 형성' },
  { id: 'idea', name: '아이디어', icon: '💡', description: '아이디어 발굴과 정제' },
  { id: 'validation', name: '검증', icon: '🔍', description: '시장과 고객 검증' },
  { id: 'mvp', name: 'MVP/개발', icon: '🛠️', description: 'MVP 구축과 개발' },
  { id: 'growth', name: '성장/스케일', icon: '📈', description: '성장 전략과 스케일업' },
  { id: 'case_study', name: '성공사례', icon: '🏆', description: '실제 창업 성공 스토리' },
  { id: 'investment', name: '투자/IR', icon: '💰', description: '투자 유치와 IR' },
  { id: 'government', name: '정부지원', icon: '🏛️', description: '정부 지원사업 가이드' }
]

const LEVELS = [
  { id: 1, name: '입문', description: '처음 시작하는 분', color: 'green' },
  { id: 2, name: '초급', description: '기초를 쌓는 분', color: 'blue' },
  { id: 3, name: '중급', description: '실무 적용하는 분', color: 'yellow' },
  { id: 4, name: '고급', description: '심화 전략이 필요한 분', color: 'orange' },
  { id: 5, name: '전문가', description: '마스터 레벨', color: 'red' }
]

const CONTENT_TYPES = [
  { id: 'video', name: '영상', icon: '🎬' },
  { id: 'article', name: '아티클', icon: '📄' },
  { id: 'template', name: '템플릿', icon: '📋' },
  { id: 'project', name: '프로젝트', icon: '🎯' },
  { id: 'audio', name: '오디오', icon: '🎧' }
]

const SORT_OPTIONS = [
  { id: 'popular', name: '인기순', description: '조회수 기준' },
  { id: 'newest', name: '최신순', description: '등록일 기준' },
  { id: 'likes', name: '좋아요순', description: '좋아요 수 기준' },
  { id: 'saves', name: '저장순', description: '저장 수 기준' },
  { id: 'az', name: '가나다순', description: '제목 기준' }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    categories: CATEGORIES,
    levels: LEVELS,
    contentTypes: CONTENT_TYPES,
    sortOptions: SORT_OPTIONS
  })
}
