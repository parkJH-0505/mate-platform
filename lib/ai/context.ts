import { createClient } from '@/lib/supabase/server'
import { UserContext } from './prompts'

// 사용자 컨텍스트 빌드
export async function buildUserContext(
  userId: string | null,
  sessionId: string | null,
  contentId?: string
): Promise<UserContext> {
  const supabase = await createClient()
  const context: UserContext = {}

  // 1. 사용자/세션 기본 정보 가져오기
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, industry, stage, goal')
      .eq('id', userId)
      .single()

    if (profile) {
      context.userName = profile.name
      context.industry = profile.industry
      context.stage = profile.stage
      context.goal = profile.goal
    }
  } else if (sessionId) {
    // 온보딩 데이터에서 가져오기
    const { data: curriculum } = await supabase
      .from('user_curriculums')
      .select('user_name, industry, stage, goal')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (curriculum) {
      context.userName = curriculum.user_name
      context.industry = curriculum.industry
      context.stage = curriculum.stage
      context.goal = curriculum.goal
    }
  }

  // 2. 현재 콘텐츠 정보 (있다면)
  if (contentId) {
    const { data: content } = await supabase
      .from('curriculum_contents')
      .select(`
        id,
        title,
        week_number,
        curriculum_modules!inner (
          title
        )
      `)
      .eq('id', contentId)
      .single()

    if (content) {
      context.currentContent = {
        title: content.title,
        moduleName: Array.isArray(content.curriculum_modules)
          ? content.curriculum_modules[0]?.title || ''
          : (content.curriculum_modules as { title: string })?.title || '',
        weekNumber: content.week_number,
      }
    }
  }

  // 3. 학습 진행 상황
  const progressQuery = supabase
    .from('user_progress')
    .select('id', { count: 'exact' })
    .eq('completed', true)

  if (userId) {
    progressQuery.eq('user_id', userId)
  } else if (sessionId) {
    progressQuery.eq('session_id', sessionId)
  }

  const { count: completedCount } = await progressQuery

  context.completedContents = completedCount || 0

  // 4. 커리큘럼 진행률
  const curriculumQuery = supabase
    .from('user_curriculums')
    .select('progress')
    .order('created_at', { ascending: false })
    .limit(1)

  if (userId) {
    curriculumQuery.eq('user_id', userId)
  } else if (sessionId) {
    curriculumQuery.eq('session_id', sessionId)
  }

  const { data: curriculumData } = await curriculumQuery.single()

  if (curriculumData) {
    context.curriculumProgress = curriculumData.progress || 0
  }

  return context
}

// 산업별 예시 맵핑
export const INDUSTRY_EXAMPLES: Record<string, string[]> = {
  'IT/테크': ['SaaS', '앱 서비스', 'AI 솔루션'],
  '이커머스': ['온라인 쇼핑몰', 'D2C 브랜드', '마켓플레이스'],
  'F&B': ['레스토랑', '카페', '식품 브랜드'],
  '교육': ['에듀테크', '학원', '온라인 강의'],
  '헬스케어': ['디지털 헬스', '피트니스', '의료 서비스'],
  '콘텐츠/미디어': ['MCN', '미디어 플랫폼', '콘텐츠 제작'],
  '금융/핀테크': ['결제', '자산관리', '보험'],
  '기타': ['스타트업', '중소기업', '창업'],
}

// 단계별 조언 맵핑
export const STAGE_ADVICE: Record<string, string> = {
  '아이디어 단계': '아이디어 검증과 시장 조사에 집중하세요',
  '준비 단계': 'MVP 개발과 초기 고객 확보가 중요해요',
  '초기 창업': 'PMF 달성과 성장 지표 개선에 집중하세요',
  '성장 단계': '스케일업과 팀 빌딩에 집중하세요',
  '확장 단계': '시장 확장과 수익성 개선이 핵심이에요',
}
