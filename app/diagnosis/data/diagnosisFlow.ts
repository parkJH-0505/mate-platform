export interface DiagnosisChoice {
  id: string
  label: string
  value: string
  nextQuestionId: string
}

export interface DiagnosisQuestion {
  id: string
  message: string
  choices: DiagnosisChoice[]
}

export interface DiagnosisFlow {
  categoryId: string
  categoryName: string
  introMessage: string
  questions: DiagnosisQuestion[]
}

// 카테고리별 진단 플로우
export const diagnosisFlows: Record<string, DiagnosisFlow> = {
  customer: {
    categoryId: 'customer',
    categoryName: '고객/영업',
    introMessage: '고객을 찾고 싶으시군요. 몇 가지만 여쭤볼게요.',
    questions: [
      {
        id: 'q1',
        message: '지금 파는 제품/서비스가 있나요?',
        choices: [
          { id: 'q1-1', label: '있어요', value: 'has_product', nextQuestionId: 'q2' },
          { id: 'q1-2', label: '만드는 중이에요', value: 'making', nextQuestionId: 'q2' },
          { id: 'q1-3', label: '아직 없어요', value: 'no_product', nextQuestionId: 'q2_alt' }
        ]
      },
      {
        id: 'q2',
        message: '어떤 종류인가요?',
        choices: [
          { id: 'q2-1', label: '서비스 (컨설팅, 교육 등)', value: 'service', nextQuestionId: 'q3' },
          { id: 'q2-2', label: '실물 제품', value: 'physical', nextQuestionId: 'q3' },
          { id: 'q2-3', label: '디지털 제품 (PDF, 강의 등)', value: 'digital', nextQuestionId: 'q3' },
          { id: 'q2-4', label: '소프트웨어/앱', value: 'software', nextQuestionId: 'q3' }
        ]
      },
      {
        id: 'q2_alt',
        message: '어떤 걸 만들고 싶으세요?',
        choices: [
          { id: 'q2a-1', label: '서비스 (컨설팅, 교육 등)', value: 'service', nextQuestionId: 'q3' },
          { id: 'q2a-2', label: '실물 제품', value: 'physical', nextQuestionId: 'q3' },
          { id: 'q2a-3', label: '디지털 제품 (PDF, 강의 등)', value: 'digital', nextQuestionId: 'q3' },
          { id: 'q2a-4', label: '아직 잘 모르겠어요', value: 'unsure', nextQuestionId: 'q3' }
        ]
      },
      {
        id: 'q3',
        message: '지금까지 유료로 팔아본 적 있나요?',
        choices: [
          { id: 'q3-1', label: '아직 없어요', value: 'never', nextQuestionId: 'q4' },
          { id: 'q3-2', label: '지인한테 1-2번 팔아봤어요', value: 'friends', nextQuestionId: 'q4' },
          { id: 'q3-3', label: '모르는 사람한테도 팔아봤어요', value: 'strangers', nextQuestionId: 'q4' }
        ]
      },
      {
        id: 'q4',
        message: '타겟 고객이 명확한가요?',
        choices: [
          { id: 'q4-1', label: '명확해요 (특정 직업, 상황)', value: 'clear', nextQuestionId: 'result' },
          { id: 'q4-2', label: '대충 있긴 한데 구체적이진 않아요', value: 'vague', nextQuestionId: 'result' },
          { id: 'q4-3', label: '잘 모르겠어요', value: 'unclear', nextQuestionId: 'result' }
        ]
      }
    ]
  },
  pricing: {
    categoryId: 'pricing',
    categoryName: '가격/수익',
    introMessage: '가격 책정에 고민이 있으시군요. 몇 가지만 여쭤볼게요.',
    questions: [
      {
        id: 'q1',
        message: '현재 가격을 정해놓으셨나요?',
        choices: [
          { id: 'q1-1', label: '네, 정해놨어요', value: 'has_price', nextQuestionId: 'q2' },
          { id: 'q1-2', label: '대충 생각은 있어요', value: 'rough', nextQuestionId: 'q2' },
          { id: 'q1-3', label: '전혀 모르겠어요', value: 'no_idea', nextQuestionId: 'q2' }
        ]
      },
      {
        id: 'q2',
        message: '경쟁 서비스/제품의 가격을 조사해보셨나요?',
        choices: [
          { id: 'q2-1', label: '네, 알고 있어요', value: 'researched', nextQuestionId: 'q3' },
          { id: 'q2-2', label: '대충 봤어요', value: 'briefly', nextQuestionId: 'q3' },
          { id: 'q2-3', label: '아직 안 해봤어요', value: 'not_yet', nextQuestionId: 'q3' }
        ]
      },
      {
        id: 'q3',
        message: '고객이 가격에 대해 뭐라고 하던가요?',
        choices: [
          { id: 'q3-1', label: '비싸다고 했어요', value: 'expensive', nextQuestionId: 'q4' },
          { id: 'q3-2', label: '괜찮다고 했어요', value: 'okay', nextQuestionId: 'q4' },
          { id: 'q3-3', label: '아직 물어본 적 없어요', value: 'not_asked', nextQuestionId: 'q4' }
        ]
      },
      {
        id: 'q4',
        message: '수익 목표가 있으신가요?',
        choices: [
          { id: 'q4-1', label: '네, 구체적인 숫자가 있어요', value: 'specific', nextQuestionId: 'result' },
          { id: 'q4-2', label: '대충 생각은 있어요', value: 'rough', nextQuestionId: 'result' },
          { id: 'q4-3', label: '아직 생각 안 해봤어요', value: 'not_yet', nextQuestionId: 'result' }
        ]
      }
    ]
  },
  product: {
    categoryId: 'product',
    categoryName: '제품/서비스',
    introMessage: '제품/서비스 개발에 관심이 있으시군요. 몇 가지만 여쭤볼게요.',
    questions: [
      {
        id: 'q1',
        message: '현재 어떤 단계에 있으신가요?',
        choices: [
          { id: 'q1-1', label: '아이디어만 있어요', value: 'idea', nextQuestionId: 'q2' },
          { id: 'q1-2', label: 'MVP를 만들고 있어요', value: 'mvp', nextQuestionId: 'q2' },
          { id: 'q1-3', label: '이미 제품이 있어요', value: 'product', nextQuestionId: 'q2' }
        ]
      },
      {
        id: 'q2',
        message: '고객 피드백을 받아보셨나요?',
        choices: [
          { id: 'q2-1', label: '네, 여러 번 받았어요', value: 'multiple', nextQuestionId: 'q3' },
          { id: 'q2-2', label: '1-2번 정도요', value: 'few', nextQuestionId: 'q3' },
          { id: 'q2-3', label: '아직 안 받아봤어요', value: 'none', nextQuestionId: 'q3' }
        ]
      },
      {
        id: 'q3',
        message: '가장 큰 고민은 뭔가요?',
        choices: [
          { id: 'q3-1', label: '뭘 만들어야 할지 모르겠어요', value: 'what', nextQuestionId: 'q4' },
          { id: 'q3-2', label: '어떻게 만들어야 할지 모르겠어요', value: 'how', nextQuestionId: 'q4' },
          { id: 'q3-3', label: '개선이 필요한데 방향을 모르겠어요', value: 'improve', nextQuestionId: 'q4' }
        ]
      },
      {
        id: 'q4',
        message: '개발/제작 역량이 있으신가요?',
        choices: [
          { id: 'q4-1', label: '네, 직접 할 수 있어요', value: 'can_do', nextQuestionId: 'result' },
          { id: 'q4-2', label: '팀원이 있어요', value: 'team', nextQuestionId: 'result' },
          { id: 'q4-3', label: '외주를 맡겨야 해요', value: 'outsource', nextQuestionId: 'result' }
        ]
      }
    ]
  },
  marketing: {
    categoryId: 'marketing',
    categoryName: '마케팅',
    introMessage: '마케팅에 관심이 있으시군요. 몇 가지만 여쭤볼게요.',
    questions: [
      {
        id: 'q1',
        message: '현재 마케팅을 하고 계신가요?',
        choices: [
          { id: 'q1-1', label: '네, 하고 있어요', value: 'doing', nextQuestionId: 'q2' },
          { id: 'q1-2', label: '시작하려고 해요', value: 'starting', nextQuestionId: 'q2' },
          { id: 'q1-3', label: '어떻게 해야 할지 모르겠어요', value: 'dont_know', nextQuestionId: 'q2' }
        ]
      },
      {
        id: 'q2',
        message: '마케팅 예산이 있으신가요?',
        choices: [
          { id: 'q2-1', label: '네, 투자할 수 있어요', value: 'budget', nextQuestionId: 'q3' },
          { id: 'q2-2', label: '거의 없어요', value: 'low', nextQuestionId: 'q3' },
          { id: 'q2-3', label: '0원이에요', value: 'zero', nextQuestionId: 'q3' }
        ]
      },
      {
        id: 'q3',
        message: '어떤 채널로 하고 싶으세요?',
        choices: [
          { id: 'q3-1', label: 'SNS (인스타, 틱톡 등)', value: 'sns', nextQuestionId: 'q4' },
          { id: 'q3-2', label: '검색 광고 (구글, 네이버)', value: 'search', nextQuestionId: 'q4' },
          { id: 'q3-3', label: '콘텐츠 마케팅 (블로그, 유튜브)', value: 'content', nextQuestionId: 'q4' },
          { id: 'q3-4', label: '잘 모르겠어요', value: 'unsure', nextQuestionId: 'q4' }
        ]
      },
      {
        id: 'q4',
        message: '직접 하실 건가요?',
        choices: [
          { id: 'q4-1', label: '네, 직접 할 거예요', value: 'self', nextQuestionId: 'result' },
          { id: 'q4-2', label: '대행사에 맡기려고요', value: 'agency', nextQuestionId: 'result' },
          { id: 'q4-3', label: '아직 결정 못 했어요', value: 'undecided', nextQuestionId: 'result' }
        ]
      }
    ]
  },
  operations: {
    categoryId: 'operations',
    categoryName: '운영/관리',
    introMessage: '운영/관리에 고민이 있으시군요. 몇 가지만 여쭤볼게요.',
    questions: [
      {
        id: 'q1',
        message: '현재 가장 큰 운영 이슈는 뭔가요?',
        choices: [
          { id: 'q1-1', label: '시간이 부족해요', value: 'time', nextQuestionId: 'q2' },
          { id: 'q1-2', label: '업무가 정리가 안 돼요', value: 'organize', nextQuestionId: 'q2' },
          { id: 'q1-3', label: '팀원 관리가 어려워요', value: 'team', nextQuestionId: 'q2' }
        ]
      },
      {
        id: 'q2',
        message: '현재 팀이 있으신가요?',
        choices: [
          { id: 'q2-1', label: '혼자 해요', value: 'solo', nextQuestionId: 'q3' },
          { id: 'q2-2', label: '2-5명이에요', value: 'small', nextQuestionId: 'q3' },
          { id: 'q2-3', label: '5명 이상이에요', value: 'large', nextQuestionId: 'q3' }
        ]
      },
      {
        id: 'q3',
        message: '업무 관리 도구를 쓰고 계신가요?',
        choices: [
          { id: 'q3-1', label: '네, 쓰고 있어요', value: 'using', nextQuestionId: 'q4' },
          { id: 'q3-2', label: '써보려고 해요', value: 'planning', nextQuestionId: 'q4' },
          { id: 'q3-3', label: '안 쓰고 있어요', value: 'not_using', nextQuestionId: 'q4' }
        ]
      },
      {
        id: 'q4',
        message: '가장 자동화하고 싶은 건 뭔가요?',
        choices: [
          { id: 'q4-1', label: '반복 업무', value: 'repetitive', nextQuestionId: 'result' },
          { id: 'q4-2', label: '고객 응대', value: 'customer', nextQuestionId: 'result' },
          { id: 'q4-3', label: '재무/회계', value: 'finance', nextQuestionId: 'result' }
        ]
      }
    ]
  },
  strategy: {
    categoryId: 'strategy',
    categoryName: '방향/전략',
    introMessage: '사업 방향에 고민이 있으시군요. 몇 가지만 여쭤볼게요.',
    questions: [
      {
        id: 'q1',
        message: '현재 사업 단계가 어떻게 되시나요?',
        choices: [
          { id: 'q1-1', label: '아이디어 단계예요', value: 'idea', nextQuestionId: 'q2' },
          { id: 'q1-2', label: '시작한 지 6개월 미만이에요', value: 'early', nextQuestionId: 'q2' },
          { id: 'q1-3', label: '1년 이상 됐어요', value: 'mature', nextQuestionId: 'q2' }
        ]
      },
      {
        id: 'q2',
        message: '가장 큰 고민은 뭔가요?',
        choices: [
          { id: 'q2-1', label: '이게 맞는 방향인지 모르겠어요', value: 'direction', nextQuestionId: 'q3' },
          { id: 'q2-2', label: '성장이 멈춘 것 같아요', value: 'growth', nextQuestionId: 'q3' },
          { id: 'q2-3', label: '피봇을 고민 중이에요', value: 'pivot', nextQuestionId: 'q3' }
        ]
      },
      {
        id: 'q3',
        message: '투자를 받으실 계획이 있으신가요?',
        choices: [
          { id: 'q3-1', label: '네, 준비 중이에요', value: 'preparing', nextQuestionId: 'q4' },
          { id: 'q3-2', label: '고민 중이에요', value: 'considering', nextQuestionId: 'q4' },
          { id: 'q3-3', label: '부트스트래핑 할 거예요', value: 'bootstrap', nextQuestionId: 'q4' }
        ]
      },
      {
        id: 'q4',
        message: '멘토나 조언자가 있으신가요?',
        choices: [
          { id: 'q4-1', label: '네, 있어요', value: 'has_mentor', nextQuestionId: 'result' },
          { id: 'q4-2', label: '찾고 있어요', value: 'looking', nextQuestionId: 'result' },
          { id: 'q4-3', label: '필요 없다고 생각해요', value: 'not_needed', nextQuestionId: 'result' }
        ]
      }
    ]
  }
}

// 기본 진단 플로우 (카테고리 없이 직접 입력한 경우)
export const defaultFlow: DiagnosisFlow = {
  categoryId: 'general',
  categoryName: '일반',
  introMessage: '어떤 고민인지 조금 더 알려주세요.',
  questions: [
    {
      id: 'q1',
      message: '어떤 종류의 고민인가요?',
      choices: [
        { id: 'q1-1', label: '고객/영업', value: 'customer', nextQuestionId: 'redirect' },
        { id: 'q1-2', label: '가격/수익', value: 'pricing', nextQuestionId: 'redirect' },
        { id: 'q1-3', label: '제품/서비스', value: 'product', nextQuestionId: 'redirect' },
        { id: 'q1-4', label: '마케팅', value: 'marketing', nextQuestionId: 'redirect' },
        { id: 'q1-5', label: '운영/관리', value: 'operations', nextQuestionId: 'redirect' },
        { id: 'q1-6', label: '방향/전략', value: 'strategy', nextQuestionId: 'redirect' }
      ]
    }
  ]
}

export function getDiagnosisFlow(category?: string): DiagnosisFlow {
  if (category && diagnosisFlows[category]) {
    return diagnosisFlows[category]
  }
  return defaultFlow
}

export function getQuestion(flow: DiagnosisFlow, questionId: string): DiagnosisQuestion | undefined {
  return flow.questions.find(q => q.id === questionId)
}
