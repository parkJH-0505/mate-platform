// ============================================
// AI 채팅 데이터 타입 및 목 데이터
// ============================================

// -------------------- 타입 정의 --------------------

/** 메시지 역할 */
export type MessageRole = 'user' | 'assistant' | 'system'

/** 채팅 메시지 */
export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  context?: ChatContext
}

/** 채팅 컨텍스트 */
export interface ChatContext {
  problemId?: string
  problemTitle?: string
  stepId?: string
  stepTitle?: string
  checklistItemId?: string
}

/** 대화 세션 */
export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  context?: ChatContext
  createdAt: string
  updatedAt: string
}

/** 추천 질문 */
export interface SuggestedQuestion {
  id: string
  text: string
  category: 'general' | 'problem' | 'step' | 'stuck'
  triggerContext?: {
    problemId?: string
    stepId?: string
  }
}

// -------------------- 추천 질문 데이터 --------------------

/** 일반 추천 질문 */
export const generalQuestions: SuggestedQuestion[] = [
  {
    id: 'gen-1',
    text: '첫 고객을 어디서 찾아요?',
    category: 'general'
  },
  {
    id: 'gen-2',
    text: '가격은 어떻게 정하나요?',
    category: 'general'
  },
  {
    id: 'gen-3',
    text: 'MVP는 뭘 만들어야 하나요?',
    category: 'general'
  },
  {
    id: 'gen-4',
    text: '경쟁사 분석은 어떻게 하나요?',
    category: 'general'
  },
  {
    id: 'gen-5',
    text: '사업계획서가 꼭 필요한가요?',
    category: 'general'
  }
]

/** 단계별 추천 질문 */
export const stepQuestions: Record<string, SuggestedQuestion[]> = {
  'step-1': [
    {
      id: 'step1-1',
      text: '타겟을 어느 정도로 좁혀야 하나요?',
      category: 'step',
      triggerContext: { stepId: 'step-1' }
    },
    {
      id: 'step1-2',
      text: '타겟 페르소나 예시 좀 보여주세요',
      category: 'step',
      triggerContext: { stepId: 'step-1' }
    },
    {
      id: 'step1-3',
      text: 'B2B와 B2C 중 뭐가 나을까요?',
      category: 'step',
      triggerContext: { stepId: 'step-1' }
    }
  ],
  'step-2': [
    {
      id: 'step2-1',
      text: '콜드 메시지 어떻게 보내요?',
      category: 'step',
      triggerContext: { stepId: 'step-2' }
    },
    {
      id: 'step2-2',
      text: '지인한테 부탁하기 민망해요',
      category: 'step',
      triggerContext: { stepId: 'step-2' }
    },
    {
      id: 'step2-3',
      text: '커뮤니티 어디서 찾아요?',
      category: 'step',
      triggerContext: { stepId: 'step-2' }
    }
  ],
  'step-3': [
    {
      id: 'step3-1',
      text: '첫 메시지 예시 좀 보여주세요',
      category: 'step',
      triggerContext: { stepId: 'step-3' }
    },
    {
      id: 'step3-2',
      text: '거절당하면 어떻게 해요?',
      category: 'step',
      triggerContext: { stepId: 'step-3' }
    },
    {
      id: 'step3-3',
      text: 'DM vs 이메일 뭐가 나을까요?',
      category: 'step',
      triggerContext: { stepId: 'step-3' }
    }
  ],
  'step-4': [
    {
      id: 'step4-1',
      text: '인터뷰 질문 예시 좀 주세요',
      category: 'step',
      triggerContext: { stepId: 'step-4' }
    },
    {
      id: 'step4-2',
      text: '인터뷰 시간은 얼마나 해야 해요?',
      category: 'step',
      triggerContext: { stepId: 'step-4' }
    },
    {
      id: 'step4-3',
      text: '녹음해도 되나요?',
      category: 'step',
      triggerContext: { stepId: 'step-4' }
    }
  ],
  'step-5': [
    {
      id: 'step5-1',
      text: '인사이트 정리 템플릿 있나요?',
      category: 'step',
      triggerContext: { stepId: 'step-5' }
    },
    {
      id: 'step5-2',
      text: '인터뷰 결과 어떻게 분석해요?',
      category: 'step',
      triggerContext: { stepId: 'step-5' }
    },
    {
      id: 'step5-3',
      text: '다음 단계로 넘어가도 될까요?',
      category: 'step',
      triggerContext: { stepId: 'step-5' }
    }
  ]
}

/** 막혔을 때 추천 질문 */
export const stuckQuestions: SuggestedQuestion[] = [
  {
    id: 'stuck-1',
    text: '뭐부터 해야 할지 모르겠어요',
    category: 'stuck'
  },
  {
    id: 'stuck-2',
    text: '예시가 더 필요해요',
    category: 'stuck'
  },
  {
    id: 'stuck-3',
    text: '내 상황에 맞는 조언이 필요해요',
    category: 'stuck'
  },
  {
    id: 'stuck-4',
    text: '더 쉽게 설명해주세요',
    category: 'stuck'
  }
]

// -------------------- 유틸리티 함수 --------------------

/** 컨텍스트에 맞는 추천 질문 가져오기 */
export function getSuggestedQuestions(context?: ChatContext): SuggestedQuestion[] {
  if (!context) {
    return generalQuestions.slice(0, 3)
  }

  if (context.stepId && stepQuestions[context.stepId]) {
    return stepQuestions[context.stepId]
  }

  return generalQuestions.slice(0, 3)
}

/** 새 메시지 ID 생성 */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/** 새 세션 ID 생성 */
export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/** 시스템 환영 메시지 생성 */
export function createWelcomeMessage(context?: ChatContext): ChatMessage {
  let content = '안녕하세요! MATE AI입니다. 창업 과정에서 궁금한 점이나 막히는 부분이 있으면 언제든 물어보세요!'

  if (context?.stepTitle) {
    content = `안녕하세요! 현재 "${context.stepTitle}" 단계를 진행 중이시군요. 이 단계에서 도움이 필요하시면 말씀해주세요!`
  } else if (context?.problemTitle) {
    content = `안녕하세요! "${context.problemTitle}" 문제를 해결 중이시군요. 무엇이든 도움이 필요하시면 물어보세요!`
  }

  return {
    id: generateMessageId(),
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    context
  }
}

/** 새 세션 생성 */
export function createNewSession(context?: ChatContext): ChatSession {
  const now = new Date().toISOString()
  const welcomeMessage = createWelcomeMessage(context)

  let title = '새 대화'
  if (context?.stepTitle) {
    title = context.stepTitle
  } else if (context?.problemTitle) {
    title = context.problemTitle
  }

  return {
    id: generateSessionId(),
    title,
    messages: [welcomeMessage],
    context,
    createdAt: now,
    updatedAt: now
  }
}
