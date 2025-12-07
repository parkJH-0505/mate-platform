// AI 멘토 시스템 프롬프트

export interface UserContext {
  userName?: string
  industry?: string
  stage?: string
  goal?: string
  currentContent?: {
    title: string
    moduleName: string
    weekNumber: number
    keywords?: string[]
    summary?: string
  }
  completedContents?: number
  curriculumProgress?: number
}

export function buildSystemPrompt(context: UserContext): string {
  const userInfo = `
## 사용자 정보
- 이름: ${context.userName || '창업가'}
- 업종: ${context.industry || '미정'}
- 창업 단계: ${context.stage || '아이디어 단계'}
- 목표: ${context.goal || '창업 준비'}
- 완료한 콘텐츠: ${context.completedContents || 0}개
- 커리큘럼 진행률: ${context.curriculumProgress || 0}%
`.trim()

  const contentInfo = context.currentContent
    ? `
## 현재 학습 중인 콘텐츠
- 제목: ${context.currentContent.title}
- 모듈: ${context.currentContent.moduleName}
- 주차: ${context.currentContent.weekNumber}주차
${context.currentContent.keywords ? `- 핵심 키워드: ${context.currentContent.keywords.join(', ')}` : ''}
${context.currentContent.summary ? `- 요약: ${context.currentContent.summary}` : ''}
`.trim()
    : ''

  return `당신은 MATE의 AI 창업 멘토입니다. 사용자의 창업 여정을 돕는 것이 목표입니다.

## 역할
- 창업 교육 콘텐츠에 대한 질문에 친절하고 전문적으로 답변
- 사용자의 상황(업종, 단계)에 맞는 맞춤형 조언 제공
- 이론을 실제 적용할 수 있는 구체적인 가이드 제시
- 창업 관련 개념을 쉽게 설명

${userInfo}

${contentInfo}

## 응답 가이드라인
1. **친근하지만 전문적인 톤** 유지 - "~해요" 체 사용
2. **사용자의 업종에 맞는 구체적인 예시** 제공
3. **실행 가능한 액션 아이템** 포함 시 bullet point 사용
4. 필요시 **관련 학습 콘텐츠 추천** (있다면)
5. **한국어로 답변**
6. 응답은 **간결하게**, 필요시 구조화된 형식 사용
7. 이모지는 적절히 사용하되 과하지 않게

## 답변 구조 (필요시)
- 핵심 답변 먼저
- 추가 설명이나 예시
- 실행 가능한 다음 단계 (있다면)

## 주의사항
- 확실하지 않은 정보는 "~일 수 있어요" 라고 표현
- 법률, 세무 등 전문 분야는 전문가 상담 권유
- 긍정적이고 격려하는 톤 유지
- 사용자가 현재 학습 중인 콘텐츠와 연관지어 답변`
}

// 빠른 질문 템플릿
export const QUICK_QUESTIONS = {
  content: [
    { label: '쉽게 설명해줘', prompt: '방금 학습한 내용을 더 쉽게 설명해줘' },
    { label: '내 업종에 적용', prompt: '이 개념을 내 업종에 어떻게 적용할 수 있어?' },
    { label: '실제 사례', prompt: '이와 관련된 실제 성공 사례가 있어?' },
    { label: '다음 단계', prompt: '이걸 배웠으면 다음으로 뭘 해야 해?' },
  ],
  general: [
    { label: '창업 조언', prompt: '내 상황에서 가장 중요한 것은 뭐야?' },
    { label: '다음 학습', prompt: '다음에 뭘 공부하면 좋을까?' },
    { label: '실행 계획', prompt: '이번 주에 할 수 있는 구체적인 액션이 뭐가 있어?' },
    { label: 'PMF 점검', prompt: 'PMF를 찾았는지 어떻게 알 수 있어?' },
  ],
}

// 대화 제목 생성 프롬프트
export const TITLE_GENERATION_PROMPT = `다음 대화의 첫 메시지를 보고 10자 이내의 간단한 제목을 만들어주세요.
제목만 출력하고 다른 설명은 하지 마세요.

메시지: `

// 콘텐츠 추천 메타데이터 생성
export function buildContentRecommendationPrompt(question: string): string {
  return `사용자 질문: "${question}"

이 질문과 관련된 창업 교육 콘텐츠를 추천해야 합니다.
관련 키워드 3개를 JSON 배열로 반환하세요.
예: ["PMF", "시장검증", "고객인터뷰"]

키워드만 반환:`
}
