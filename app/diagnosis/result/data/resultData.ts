// 진단 결과 데이터 타입
export interface SolutionStep {
  id: string
  order: number
  title: string
  description: string
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  actionItems: string[]
}

export interface DiagnosisResult {
  categoryId: string
  resultType: string
  title: string
  summary: string
  keyInsight: string
  urgency: 'low' | 'medium' | 'high'
  steps: SolutionStep[]
  nextStepCTA: string
}

// 카테고리별 결과 매핑
type ResultKey = string

export const diagnosisResults: Record<string, Record<ResultKey, DiagnosisResult>> = {
  customer: {
    'first_customer': {
      categoryId: 'customer',
      resultType: 'first_customer',
      title: '첫 고객 찾기 전략',
      summary: '아직 유료 고객이 없는 상태입니다. 가장 빠르게 첫 고객을 확보할 수 있는 전략을 제안드립니다.',
      keyInsight: '첫 고객은 제품 완성도보다 문제 해결 의지가 더 중요합니다.',
      urgency: 'high',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '이상적인 고객 프로필 정의하기',
          description: '가장 급하게 문제를 겪고 있는 사람이 누구인지 구체화합니다.',
          estimatedTime: '30분',
          difficulty: 'easy',
          actionItems: [
            '고객이 겪는 문제를 한 문장으로 적어보세요',
            '그 문제를 가장 심하게 겪는 사람의 특징 3가지를 나열하세요',
            '그런 사람들이 모이는 온라인/오프라인 공간을 찾아보세요'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '직접 고객 찾아가기',
          description: '기다리지 말고 직접 잠재 고객에게 연락합니다.',
          estimatedTime: '2시간',
          difficulty: 'medium',
          actionItems: [
            '링크드인, 커뮤니티에서 잠재 고객 10명 리스트업',
            'DM 템플릿 작성 (문제 공감 + 해결책 제안)',
            '오늘 최소 5명에게 연락하기'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '무료 체험 or 파일럿 제안',
          description: '첫 고객에게는 리스크를 낮춰주는 제안을 합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '무료 체험 범위 정하기 (시간/기능 제한)',
            '성공 시 피드백 요청 약속 받기',
            '체험 후 유료 전환 조건 명확히 하기'
          ]
        }
      ],
      nextStepCTA: '첫 번째 액션부터 시작하기'
    },
    'target_unclear': {
      categoryId: 'customer',
      resultType: 'target_unclear',
      title: '타겟 고객 명확화 전략',
      summary: '타겟 고객이 불명확한 상태입니다. 누구에게 팔지 먼저 정해야 효과적인 영업이 가능합니다.',
      keyInsight: '모두를 위한 제품은 아무도 위한 제품이 아닙니다.',
      urgency: 'high',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '기존 관심자 분석하기',
          description: '지금까지 관심을 보인 사람들의 공통점을 찾습니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '문의했거나 관심을 보인 사람 리스트업',
            '그들의 공통된 직업/상황/고민 파악',
            '가장 열정적이었던 사람 1명 깊이 인터뷰'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: 'ICP (이상적인 고객 프로필) 작성',
          description: '한 문장으로 타겟 고객을 정의합니다.',
          estimatedTime: '30분',
          difficulty: 'medium',
          actionItems: [
            '"[직업/상황]이면서 [특정 문제]를 겪는 사람" 형태로 정의',
            '그 사람이 돈을 낼 만큼 급한 이유 적기',
            '그 사람을 찾을 수 있는 채널 3곳 나열'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '가설 검증하기',
          description: '정의한 타겟에게 직접 연락해서 검증합니다.',
          estimatedTime: '3시간',
          difficulty: 'medium',
          actionItems: [
            '타겟 10명에게 연락 (DM, 이메일 등)',
            '문제 공감 여부와 해결 의지 확인',
            '반응 좋은 3명과 깊은 대화 진행'
          ]
        }
      ],
      nextStepCTA: 'ICP 작성 시작하기'
    },
    'default': {
      categoryId: 'customer',
      resultType: 'default',
      title: '고객 확보 전략',
      summary: '현재 상황을 바탕으로 효과적인 고객 확보 전략을 제안드립니다.',
      keyInsight: '고객을 찾는 것보다 고객이 찾아오게 만드는 것이 더 지속가능합니다.',
      urgency: 'medium',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '현재 고객 파악하기',
          description: '지금 있는 고객이나 관심자들을 정리합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '기존 고객/문의자 리스트 정리',
            '어떤 채널에서 왔는지 파악',
            '왜 구매/관심을 가졌는지 이유 분석'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '가장 효과적인 채널 집중',
          description: '모든 채널을 하지 말고 가장 효과적인 1-2개에 집중합니다.',
          estimatedTime: '2시간',
          difficulty: 'medium',
          actionItems: [
            '가장 많은 고객이 온 채널 파악',
            '해당 채널에 더 많은 시간/리소스 투입',
            '효과 없는 채널은 과감히 중단'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '추천 시스템 만들기',
          description: '기존 고객이 새 고객을 데려오게 합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '만족한 고객에게 추천 요청하기',
            '추천 인센티브 설계 (할인, 무료 제공 등)',
            '리뷰/후기 요청하기'
          ]
        }
      ],
      nextStepCTA: '고객 분석 시작하기'
    }
  },
  pricing: {
    'no_price': {
      categoryId: 'pricing',
      resultType: 'no_price',
      title: '가격 책정 가이드',
      summary: '아직 가격을 정하지 못한 상태입니다. 빠르게 가격을 정하고 시장에서 검증받을 수 있는 방법을 알려드립니다.',
      keyInsight: '완벽한 가격은 없습니다. 빨리 정하고 시장 반응을 보세요.',
      urgency: 'high',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '경쟁 가격 조사',
          description: '비슷한 제품/서비스의 가격대를 파악합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '경쟁/대체 서비스 5개 가격 조사',
            '가격대별 어떤 가치를 제공하는지 정리',
            '내 제품의 위치 정하기 (저가/중가/고가)'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '원가 기반 최저가 계산',
          description: '최소한 이 가격 이상은 받아야 한다는 기준을 정합니다.',
          estimatedTime: '30분',
          difficulty: 'easy',
          actionItems: [
            '내 시간당 가치 정하기 (최저 시급)',
            '재료비/고정비 계산',
            '마진율 정하기 (최소 30% 권장)'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '고객 가치 기반 가격 설정',
          description: '고객이 얻는 가치를 기준으로 가격을 정합니다.',
          estimatedTime: '1시간',
          difficulty: 'medium',
          actionItems: [
            '고객이 이 서비스로 절약하는 시간/비용 계산',
            '그 가치의 10-20%를 가격으로 설정',
            '3가지 가격 옵션 만들기 (베이직/프로/프리미엄)'
          ]
        }
      ],
      nextStepCTA: '가격 계산 시작하기'
    },
    'default': {
      categoryId: 'pricing',
      resultType: 'default',
      title: '가격 최적화 전략',
      summary: '현재 가격을 검증하고 최적화할 수 있는 방법을 제안드립니다.',
      keyInsight: '가격은 고정이 아닙니다. 계속 실험하고 조정하세요.',
      urgency: 'medium',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '현재 가격 검증하기',
          description: '지금 가격에 대한 고객 반응을 분석합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '가격 때문에 이탈한 고객 있는지 확인',
            '가격에 대한 피드백 수집',
            '전환율(문의→구매) 계산'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '가격 실험 설계',
          description: '다른 가격대의 효과를 테스트합니다.',
          estimatedTime: '2시간',
          difficulty: 'medium',
          actionItems: [
            '테스트할 가격 2-3가지 선정',
            'A/B 테스트 또는 시간대별 테스트 설계',
            '성공 기준 정하기 (매출? 전환율?)'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '부가가치 패키징',
          description: '가격을 올릴 수 있는 추가 가치를 만듭니다.',
          estimatedTime: '1시간',
          difficulty: 'medium',
          actionItems: [
            '고객이 더 원하는 것 파악',
            '프리미엄 옵션/번들 구성',
            '얼리버드/연간 할인 설계'
          ]
        }
      ],
      nextStepCTA: '가격 검증 시작하기'
    }
  },
  product: {
    'idea_stage': {
      categoryId: 'product',
      resultType: 'idea_stage',
      title: '아이디어 검증 가이드',
      summary: '아이디어 단계에서 가장 중요한 것은 빠른 검증입니다. 제품을 만들기 전에 수요를 확인하세요.',
      keyInsight: '만들기 전에 팔아보세요. 안 팔리면 만들지 마세요.',
      urgency: 'high',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '문제 검증하기',
          description: '내가 해결하려는 문제가 진짜 존재하는지 확인합니다.',
          estimatedTime: '2시간',
          difficulty: 'easy',
          actionItems: [
            '타겟 고객 5-10명과 대화하기',
            '"이 문제로 얼마나 힘드세요?" 물어보기',
            '돈을 내고라도 해결하고 싶은지 확인'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '해결책 가설 세우기',
          description: '어떻게 문제를 해결할 것인지 가설을 세웁니다.',
          estimatedTime: '1시간',
          difficulty: 'medium',
          actionItems: [
            '가장 핵심 기능 1개만 정의',
            '기존 대안 대비 뭐가 다른지 명확히',
            '랜딩페이지나 설명자료 만들기'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '사전 판매 시도',
          description: '제품 없이 먼저 팔아봅니다.',
          estimatedTime: '3시간',
          difficulty: 'hard',
          actionItems: [
            '얼리버드 할인으로 사전 주문 받기',
            '최소 3명 결제 시 진행하기로 조건',
            '결제 안 되면 아이디어 피봇'
          ]
        }
      ],
      nextStepCTA: '문제 검증 시작하기'
    },
    'default': {
      categoryId: 'product',
      resultType: 'default',
      title: '제품 개발 전략',
      summary: '현재 제품 상태를 바탕으로 다음 스텝을 제안드립니다.',
      keyInsight: '기능을 추가하기보다 핵심 가치를 강화하세요.',
      urgency: 'medium',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '핵심 가치 정의',
          description: '고객이 가장 좋아하는 기능/가치를 파악합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '고객 피드백에서 가장 많이 언급된 것 찾기',
            '"이게 없으면 안 쓸 것 같아요" 하는 기능 파악',
            '그 기능을 더 좋게 만드는 방법 고민'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '불필요한 기능 제거',
          description: '안 쓰는 기능은 과감히 없앱니다.',
          estimatedTime: '1시간',
          difficulty: 'medium',
          actionItems: [
            '사용률 낮은 기능 리스트업',
            '유지보수 비용 대비 가치 평가',
            '제거 또는 유료화 결정'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '피드백 루프 구축',
          description: '지속적으로 고객 의견을 수집합니다.',
          estimatedTime: '2시간',
          difficulty: 'medium',
          actionItems: [
            '정기적인 고객 인터뷰 스케줄 잡기',
            '인앱 피드백 수집 도구 설치',
            '주간/월간 피드백 리뷰 시간 확보'
          ]
        }
      ],
      nextStepCTA: '핵심 가치 분석 시작하기'
    }
  },
  marketing: {
    'zero_budget': {
      categoryId: 'marketing',
      resultType: 'zero_budget',
      title: '무료 마케팅 전략',
      summary: '예산이 없어도 효과적으로 마케팅할 수 있습니다. 시간과 노력을 투자해서 고객을 확보하세요.',
      keyInsight: '돈 대신 시간을 쓰세요. 진정성 있는 콘텐츠가 광고보다 강합니다.',
      urgency: 'medium',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '콘텐츠 마케팅 시작',
          description: '내 전문성을 보여주는 콘텐츠를 만듭니다.',
          estimatedTime: '3시간',
          difficulty: 'medium',
          actionItems: [
            '고객이 자주 묻는 질문 10개 정리',
            '각 질문에 대한 답변을 글/영상으로 제작',
            '주 2-3회 꾸준히 발행'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '커뮤니티 활동',
          description: '타겟 고객이 모인 곳에서 활동합니다.',
          estimatedTime: '매일 30분',
          difficulty: 'easy',
          actionItems: [
            '타겟 고객이 있는 커뮤니티 3곳 가입',
            '질문에 성실히 답변하며 전문성 보여주기',
            '일주일에 1개 가치있는 글 작성'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '입소문 유도',
          description: '기존 고객이 홍보해주도록 합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '만족한 고객에게 후기 요청',
            '추천 시 혜택 제공 (할인, 무료 기능 등)',
            '성공 사례를 콘텐츠로 만들기'
          ]
        }
      ],
      nextStepCTA: '콘텐츠 제작 시작하기'
    },
    'default': {
      categoryId: 'marketing',
      resultType: 'default',
      title: '마케팅 최적화 전략',
      summary: '현재 마케팅 상황을 분석하고 개선할 수 있는 방법을 제안드립니다.',
      keyInsight: '채널은 적게, 깊이는 깊게. 모든 곳에 있으려 하지 마세요.',
      urgency: 'medium',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '채널 성과 분석',
          description: '어떤 채널이 가장 효과적인지 파악합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '각 채널별 유입 수 확인',
            '채널별 전환율 비교',
            '투자 대비 효과(ROI) 계산'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '핵심 채널 집중',
          description: '가장 효과적인 1-2개 채널에 집중합니다.',
          estimatedTime: '지속',
          difficulty: 'medium',
          actionItems: [
            '효과 없는 채널 중단',
            '핵심 채널에 더 많은 시간/예산 투입',
            '해당 채널 전문가 되기'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '퍼널 최적화',
          description: '고객 여정의 병목 지점을 개선합니다.',
          estimatedTime: '2시간',
          difficulty: 'hard',
          actionItems: [
            '각 단계별 이탈률 확인',
            '가장 이탈이 많은 지점 개선',
            'CTA 문구/위치 A/B 테스트'
          ]
        }
      ],
      nextStepCTA: '채널 분석 시작하기'
    }
  },
  operations: {
    'solo': {
      categoryId: 'operations',
      resultType: 'solo',
      title: '1인 운영 최적화',
      summary: '혼자 운영하면서 효율을 최대화할 수 있는 방법을 알려드립니다.',
      keyInsight: '모든 걸 하려 하지 마세요. 핵심에 집중하고 나머지는 자동화하세요.',
      urgency: 'medium',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '시간 사용 분석',
          description: '어디에 시간을 쓰고 있는지 파악합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '일주일간 하는 업무 모두 적기',
            '각 업무에 쓰는 시간 측정',
            '수익에 직접 기여하는 업무 표시'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '자동화 대상 선정',
          description: '반복적이고 시간이 많이 드는 업무를 자동화합니다.',
          estimatedTime: '2시간',
          difficulty: 'medium',
          actionItems: [
            '반복 업무 리스트업 (이메일, 일정 등)',
            'Zapier, Make 등 자동화 도구 검토',
            '가장 시간 많이 드는 1개부터 자동화'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '템플릿/시스템 구축',
          description: '매번 새로 하지 않도록 표준화합니다.',
          estimatedTime: '3시간',
          difficulty: 'medium',
          actionItems: [
            '자주 쓰는 이메일/메시지 템플릿 만들기',
            '체크리스트로 프로세스 문서화',
            'Notion/문서로 모든 절차 기록'
          ]
        }
      ],
      nextStepCTA: '시간 분석 시작하기'
    },
    'default': {
      categoryId: 'operations',
      resultType: 'default',
      title: '운영 효율화 전략',
      summary: '현재 운영 상황을 개선할 수 있는 방법을 제안드립니다.',
      keyInsight: '복잡함은 비용입니다. 단순하게 유지하세요.',
      urgency: 'medium',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '병목 지점 파악',
          description: '가장 시간이 많이 드는 부분을 찾습니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '팀원들에게 가장 비효율적인 업무 물어보기',
            '시간 측정 도구로 업무별 시간 추적',
            '가장 시간 많이 드는 상위 3개 선정'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '프로세스 개선',
          description: '불필요한 단계를 제거하거나 자동화합니다.',
          estimatedTime: '2시간',
          difficulty: 'medium',
          actionItems: [
            '각 프로세스의 단계 나열',
            '불필요한 단계 제거',
            '자동화 가능한 부분 자동화'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '도구 통합',
          description: '너무 많은 도구는 비효율입니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '현재 사용 중인 도구 리스트업',
            '기능 중복 도구 정리',
            '핵심 도구 3-5개로 통합'
          ]
        }
      ],
      nextStepCTA: '병목 분석 시작하기'
    }
  },
  strategy: {
    'direction_unclear': {
      categoryId: 'strategy',
      resultType: 'direction_unclear',
      title: '사업 방향 설정 가이드',
      summary: '방향이 불확실한 상태입니다. 명확한 목표와 전략을 세우는 방법을 알려드립니다.',
      keyInsight: '방향을 모르면 어떤 속도도 의미 없습니다. 먼저 방향을 정하세요.',
      urgency: 'high',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '핵심 질문에 답하기',
          description: '사업의 본질적인 질문에 답합니다.',
          estimatedTime: '1시간',
          difficulty: 'medium',
          actionItems: [
            '"왜 이 일을 하는가?" 에 답하기',
            '"3년 후 어떤 모습이 되고 싶은가?" 적기',
            '"누구에게 어떤 가치를 주고 싶은가?" 정의'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '3개월 목표 설정',
          description: '먼 미래 대신 3개월 후 달성할 목표를 정합니다.',
          estimatedTime: '30분',
          difficulty: 'easy',
          actionItems: [
            '측정 가능한 숫자 목표 1개 정하기',
            '그 목표 달성을 위한 핵심 활동 3개',
            '매주 진척도 체크할 지표 정하기'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '실행 우선순위 정하기',
          description: '해야 할 일의 우선순위를 명확히 합니다.',
          estimatedTime: '30분',
          difficulty: 'easy',
          actionItems: [
            '할 일을 모두 적기',
            '"목표 달성에 직접 기여하는가?"로 필터링',
            '가장 임팩트 큰 3가지만 먼저 하기'
          ]
        }
      ],
      nextStepCTA: '핵심 질문 답변 시작하기'
    },
    'default': {
      categoryId: 'strategy',
      resultType: 'default',
      title: '전략 점검 가이드',
      summary: '현재 전략을 점검하고 개선할 수 있는 방법을 제안드립니다.',
      keyInsight: '전략은 선택입니다. 무엇을 안 할지 정하는 것도 전략입니다.',
      urgency: 'medium',
      steps: [
        {
          id: 'step1',
          order: 1,
          title: '현재 상황 객관화',
          description: '지금 어디에 있는지 정확히 파악합니다.',
          estimatedTime: '1시간',
          difficulty: 'easy',
          actionItems: [
            '핵심 지표 현황 정리 (매출, 고객수 등)',
            '잘 되고 있는 것 / 안 되는 것 나누기',
            '경쟁 상황 간단히 분석'
          ]
        },
        {
          id: 'step2',
          order: 2,
          title: '집중 영역 선택',
          description: '모든 것을 하지 말고 집중할 곳을 정합니다.',
          estimatedTime: '30분',
          difficulty: 'medium',
          actionItems: [
            '가장 잘할 수 있는 것 1가지 선택',
            '가장 큰 성장 기회 1가지 선택',
            '나머지는 과감히 후순위로'
          ]
        },
        {
          id: 'step3',
          order: 3,
          title: '실행 계획 수립',
          description: '구체적인 액션 플랜을 만듭니다.',
          estimatedTime: '1시간',
          difficulty: 'medium',
          actionItems: [
            '월별 마일스톤 정하기',
            '주별 실행 항목 나누기',
            '매주 리뷰 시간 잡기'
          ]
        }
      ],
      nextStepCTA: '상황 분석 시작하기'
    }
  }
}

// 답변 기반 결과 타입 결정 함수
export function determineResultType(
  categoryId: string,
  answers: Array<{ questionId: string; answer: { value: string } }>
): string {
  const answerValues = answers.map(a => a.answer.value)

  switch (categoryId) {
    case 'customer':
      if (answerValues.includes('never') || answerValues.includes('no_product')) {
        return 'first_customer'
      }
      if (answerValues.includes('unclear') || answerValues.includes('vague')) {
        return 'target_unclear'
      }
      return 'default'

    case 'pricing':
      if (answerValues.includes('no_idea')) {
        return 'no_price'
      }
      return 'default'

    case 'product':
      if (answerValues.includes('idea')) {
        return 'idea_stage'
      }
      return 'default'

    case 'marketing':
      if (answerValues.includes('zero')) {
        return 'zero_budget'
      }
      return 'default'

    case 'operations':
      if (answerValues.includes('solo')) {
        return 'solo'
      }
      return 'default'

    case 'strategy':
      if (answerValues.includes('direction')) {
        return 'direction_unclear'
      }
      return 'default'

    default:
      return 'default'
  }
}

// 결과 가져오기
export function getDiagnosisResult(
  categoryId: string,
  answers: Array<{ questionId: string; answer: { value: string } }>
): DiagnosisResult {
  const resultType = determineResultType(categoryId, answers)
  const categoryResults = diagnosisResults[categoryId]

  if (categoryResults && categoryResults[resultType]) {
    return categoryResults[resultType]
  }

  // 기본 결과 반환
  if (categoryResults && categoryResults['default']) {
    return categoryResults['default']
  }

  // 최종 폴백
  return diagnosisResults.customer.default
}
