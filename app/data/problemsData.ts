// ============================================
// 문제 해결 플로우 데이터 타입 및 목 데이터
// ============================================

// -------------------- 타입 정의 --------------------

/** 체크리스트 아이템 */
export interface ChecklistItem {
  id: string
  text: string
  helpText?: string  // 도움말 (물음표 클릭 시)
  exampleLink?: string  // 예시 링크
}

/** 콘텐츠 타입 */
export interface StepContent {
  /** 왜 해야 하는지 */
  why: string
  /** 핵심 개념 설명 */
  concept: string
  /** 실제 사례 */
  examples: {
    title: string
    description: string
    result?: string
  }[]
  /** 피해야 할 실수 */
  mistakes: string[]
  /** 추가 팁 */
  tips?: string[]
}

/** 단계 정의 */
export interface Step {
  id: string
  order: number
  title: string
  description: string
  estimatedMinutes: number
  icon: string
  content: StepContent
  checklist: ChecklistItem[]
}

/** 문제 정의 */
export interface Problem {
  id: string
  categoryId: string  // 진단 카테고리 ID와 매칭
  title: string
  description: string
  expectedOutcome: string
  totalMinutes: number
  icon: string
  steps: Step[]
}

/** 체크리스트 진행 상태 */
export interface ChecklistProgress {
  itemId: string
  completed: boolean
  completedAt?: string
}

/** 단계별 진행 상태 */
export interface StepProgress {
  stepId: string
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  checklistProgress: ChecklistProgress[]
  startedAt?: string
  completedAt?: string
}

/** 사용자 문제 진행 상태 */
export interface UserProgress {
  id: string
  problemId: string
  currentStepId: string
  stepProgress: StepProgress[]
  startedAt: string
  completedAt?: string
}

// -------------------- 목 데이터 --------------------

/** "첫 고객 찾기" 문제 데이터 */
export const customerProblem: Problem = {
  id: 'problem-customer-1',
  categoryId: 'customer',
  title: '첫 고객 찾기',
  description: '아이디어는 있는데 첫 번째 고객을 어디서 어떻게 찾아야 할지 막막할 때',
  expectedOutcome: '첫 10명의 잠재 고객과 대화하고 피드백 받기',
  totalMinutes: 180,
  icon: '🎯',
  steps: [
    {
      id: 'step-1',
      order: 1,
      title: '타겟 고객 좁히기',
      description: '모든 사람이 아닌, 가장 절실한 한 명부터 찾기',
      estimatedMinutes: 30,
      icon: '🔍',
      content: {
        why: `많은 창업자들이 "모든 사람에게 필요한 서비스"를 만들려다 실패합니다.

처음에는 가장 절실하게 필요로 하는 한 명의 고객에게 집중해야 합니다. 이 한 명을 만족시키면, 비슷한 사람들에게 자연스럽게 확장됩니다.`,
        concept: `**니치 마켓 전략**

타겟 고객을 좁히는 것은 시장을 포기하는 게 아닙니다.
오히려 한정된 리소스로 최대의 효과를 내기 위한 전략입니다.

좋은 타겟 고객의 조건:
1. 문제를 가장 절실하게 느끼는 사람
2. 해결을 위해 돈/시간을 쓸 의향이 있는 사람
3. 내가 접근할 수 있는 채널에 있는 사람`,
        examples: [
          {
            title: 'Airbnb의 첫 고객',
            description: '샌프란시스코에서 컨퍼런스에 참석하는 사람들만 타겟팅',
            result: '호텔이 다 차서 숙소가 절실히 필요한 사람들에게 집중'
          },
          {
            title: 'Facebook의 첫 고객',
            description: '하버드 학생들만 가입 가능하게 제한',
            result: '폐쇄적인 커뮤니티에서 강력한 네트워크 효과 형성'
          },
          {
            title: '배달의민족 초기',
            description: '강남 지역 직장인만 타겟팅',
            result: '밀집된 수요로 빠른 배달 시간 확보'
          }
        ],
        mistakes: [
          '"20-40대 직장인"처럼 너무 넓게 잡기',
          '접근할 방법이 없는 고객을 타겟으로 잡기',
          '문제를 느끼지 않는 사람을 설득하려 하기'
        ],
        tips: [
          '처음에는 100명보다 10명에게 사랑받는 게 중요합니다',
          '타겟이 너무 좁은 것 같아도 괜찮습니다. 언제든 확장할 수 있어요'
        ]
      },
      checklist: [
        {
          id: 'check-1-1',
          text: '내 서비스가 해결하는 핵심 문제 한 문장으로 적기',
          helpText: '예: "바쁜 1인 사업자가 세금 신고에 쓰는 시간을 줄여준다"'
        },
        {
          id: 'check-1-2',
          text: '이 문제를 가장 심하게 겪는 사람의 특징 3가지 적기',
          helpText: '직업, 상황, 행동 패턴 등 구체적으로 적어보세요'
        },
        {
          id: 'check-1-3',
          text: '그 사람이 주로 모이는 온라인/오프라인 장소 찾기',
          helpText: '커뮤니티, SNS 그룹, 행사, 동호회 등'
        },
        {
          id: 'check-1-4',
          text: '타겟 고객 페르소나 한 문장으로 정리하기',
          helpText: '예: "3년차 프리랜서 개발자로, 세금 신고 때마다 스트레스받는 30대"'
        }
      ]
    },
    {
      id: 'step-2',
      order: 2,
      title: '첫 10명 찾는 법',
      description: '지금 바로 연락할 수 있는 잠재 고객 리스트 만들기',
      estimatedMinutes: 45,
      icon: '📋',
      content: {
        why: `대부분의 창업자들이 "고객을 어디서 찾지?"라고 막연하게 생각합니다.

하지만 이미 당신의 네트워크 안에, 또는 클릭 한 번 거리에 첫 고객이 있습니다. 중요한 건 체계적으로 찾아내는 것입니다.`,
        concept: `**고객 발굴 동심원 모델**

1단계: 직접 아는 사람 (1촌)
- 친구, 가족, 동료, 동문
- 연락처에 있는 사람들

2단계: 한 다리 건넌 사람 (2촌)
- 지인의 소개
- 온라인 커뮤니티 멤버

3단계: 아직 모르는 사람 (콜드 아웃리치)
- SNS DM, 이메일
- 커뮤니티 게시글`,
        examples: [
          {
            title: '지인 네트워크 활용',
            description: 'SNS에 "이런 문제 겪어본 분?" 포스팅',
            result: '생각보다 많은 사람들이 관심을 보임'
          },
          {
            title: '커뮤니티 진입',
            description: '타겟 고객이 모인 카카오톡 오픈채팅방 가입',
            result: '질문에 답변하며 자연스럽게 관계 형성'
          },
          {
            title: '링크드인 콜드 메시지',
            description: '관련 직군 10명에게 직접 메시지 전송',
            result: '3명이 미팅 수락 (30% 응답률)'
          }
        ],
        mistakes: [
          '처음부터 광고/홍보성 메시지 보내기',
          '"도움 요청"이 아닌 "영업"으로 접근하기',
          '거절에 너무 상처받아 포기하기'
        ],
        tips: [
          '10번 중 1-2번 응답받으면 잘하는 겁니다',
          '상대방에게 도움이 되는 정보를 먼저 제공하세요',
          '거절도 귀중한 피드백입니다'
        ]
      },
      checklist: [
        {
          id: 'check-2-1',
          text: '내 연락처에서 타겟에 맞는 사람 5명 찾기',
          helpText: '직접 아는 사람부터 시작하는 게 가장 쉽습니다'
        },
        {
          id: 'check-2-2',
          text: '타겟 고객이 모인 온라인 커뮤니티 3곳 가입하기',
          helpText: '페이스북 그룹, 카카오톡 오픈채팅, 네이버 카페 등'
        },
        {
          id: 'check-2-3',
          text: '잠재 고객 10명 리스트 만들기 (이름, 연락처, 메모)',
          helpText: '스프레드시트나 노션으로 정리하세요'
        },
        {
          id: 'check-2-4',
          text: '각 사람에게 연락할 방법 정하기',
          helpText: 'DM, 이메일, 전화, 직접 만남 등'
        }
      ]
    },
    {
      id: 'step-3',
      order: 3,
      title: '첫 메시지 만들기',
      description: '거절 두려움 없이 연락하는 스크립트',
      estimatedMinutes: 30,
      icon: '💬',
      content: {
        why: `"뭐라고 연락하지?" "거절당하면 어쩌지?"

이런 두려움 때문에 첫 연락을 미루는 경우가 많습니다. 하지만 좋은 템플릿이 있으면 훨씬 쉽게 시작할 수 있습니다.`,
        concept: `**효과적인 첫 메시지 공식**

1. 공감 표현 (왜 연락하는지)
2. 가치 제안 (상대방이 얻는 것)
3. 부담 없는 요청 (작은 행동)

**피해야 할 것:**
- 길고 복잡한 설명
- 바로 판매하려는 의도
- 일방적인 부탁`,
        examples: [
          {
            title: '좋은 예시',
            description: `"안녕하세요! 저도 프리랜서로 일하면서 세금 신고 때문에 고민이 많았는데,
혹시 비슷한 고민 있으시면 15분만 이야기 나눌 수 있을까요?
제가 찾은 몇 가지 팁도 공유드릴게요."`,
            result: '가치를 먼저 제공하고, 부담 없는 요청'
          },
          {
            title: '나쁜 예시',
            description: `"저희 회사는 세금 신고 자동화 서비스를 제공하고 있습니다.
가격은 월 9,900원이고... (이하 생략)"`,
            result: '관심도 없는데 판매 시도 → 무시당함'
          }
        ],
        mistakes: [
          '서비스 설명부터 시작하기',
          '"제가 창업했는데요..."로 시작하기',
          '너무 길게 쓰기 (3문장 이상)'
        ],
        tips: [
          '상대방의 시간을 존중하세요 (15-20분 미팅 제안)',
          '"피드백"이나 "조언"을 구한다고 하면 응답률이 높아집니다',
          '거절해도 "감사합니다"로 마무리하세요'
        ]
      },
      checklist: [
        {
          id: 'check-3-1',
          text: '첫 연락 메시지 템플릿 작성하기',
          helpText: '3문장 이내로, 가치 제안 포함'
        },
        {
          id: 'check-3-2',
          text: '지인 1명에게 먼저 테스트 메시지 보내기',
          helpText: '친한 사람에게 먼저 보내보고 피드백 받기'
        },
        {
          id: 'check-3-3',
          text: '리스트의 첫 5명에게 메시지 발송하기',
          helpText: '망설이지 말고 일단 보내세요!'
        },
        {
          id: 'check-3-4',
          text: '응답에 대한 답장 템플릿 준비하기',
          helpText: '긍정 응답 / 부정 응답 / 무응답 각각 준비'
        }
      ]
    },
    {
      id: 'step-4',
      order: 4,
      title: '고객 인터뷰하기',
      description: '진짜 니즈를 파악하는 대화의 기술',
      estimatedMinutes: 45,
      icon: '🎤',
      content: {
        why: `연락이 닿았다면, 이제 진짜 중요한 단계입니다.

고객 인터뷰는 단순히 "우리 서비스 쓸 거예요?"를 묻는 게 아닙니다. 그들의 진짜 문제와 현재 해결 방식을 깊이 이해하는 과정입니다.`,
        concept: `**좋은 인터뷰의 원칙 (Mom Test)**

1. 미래 의향이 아닌 과거 행동을 물어라
   - X: "이 앱 쓰실 거예요?"
   - O: "지난번에 이 문제를 어떻게 해결했어요?"

2. 칭찬이 아닌 사실을 찾아라
   - X: "좋은 아이디어네요!"에 만족하지 말기
   - O: "실제로 돈/시간을 얼마나 썼어요?"

3. 해결책이 아닌 문제에 집중하라
   - X: 서비스 시연하며 반응 보기
   - O: 그들의 문제 경험 깊이 듣기`,
        examples: [
          {
            title: '좋은 질문들',
            description: `"마지막으로 이 문제를 겪은 게 언제예요?"
"그때 어떻게 해결했어요?"
"현재 사용하는 방법의 가장 큰 불만은?"
"이 문제 해결에 돈을 써본 적 있어요?"`,
            result: '실제 행동과 지불 의향 파악 가능'
          }
        ],
        mistakes: [
          '예/아니오로 답할 수 있는 질문하기',
          '유도 질문하기 ("이 기능 좋지 않아요?")',
          '반박하거나 설득하려 하기'
        ],
        tips: [
          '80%는 듣고, 20%만 말하세요',
          '침묵을 두려워하지 마세요 - 좋은 답변이 나옵니다',
          '녹음하거나 메모를 꼭 남기세요'
        ]
      },
      checklist: [
        {
          id: 'check-4-1',
          text: '인터뷰 질문지 5개 이상 준비하기',
          helpText: '과거 행동과 현재 해결 방식에 초점'
        },
        {
          id: 'check-4-2',
          text: '첫 인터뷰 진행하기 (15-30분)',
          helpText: '녹음 또는 상세 메모 필수'
        },
        {
          id: 'check-4-3',
          text: '인터뷰 내용 정리하기',
          helpText: '핵심 인사이트, 예상 밖 발견 정리'
        },
        {
          id: 'check-4-4',
          text: '최소 3명 이상 인터뷰 완료하기',
          helpText: '패턴을 발견하려면 여러 명이 필요해요'
        }
      ]
    },
    {
      id: 'step-5',
      order: 5,
      title: '인사이트 정리하기',
      description: '수집한 정보를 실행 가능한 인사이트로',
      estimatedMinutes: 30,
      icon: '💡',
      content: {
        why: `인터뷰를 했다고 끝이 아닙니다.

수집한 정보를 체계적으로 정리해야 다음 단계로 나아갈 수 있습니다. 패턴을 찾고, 가장 중요한 인사이트를 도출하세요.`,
        concept: `**인사이트 정리 프레임워크**

1. 공통점 찾기
   - 여러 명이 언급한 문제는?
   - 비슷한 해결 시도가 있었나?

2. 놀라운 발견
   - 예상과 달랐던 점은?
   - 새롭게 알게 된 니즈는?

3. 액션 아이템 도출
   - 이 인사이트로 뭘 바꿔야 하나?
   - 다음에 검증할 것은?`,
        examples: [
          {
            title: '인사이트 정리 예시',
            description: `[공통점] 3명 중 3명 모두 엑셀로 관리 중
[놀라운 발견] 문제는 '입력'보다 '알림'
[액션] 자동 알림 기능을 MVP 핵심으로`,
            result: '흩어진 정보가 명확한 방향으로'
          }
        ],
        mistakes: [
          '인터뷰만 하고 정리 안 하기',
          '듣고 싶은 것만 기억하기',
          '한 명의 의견을 일반화하기'
        ],
        tips: [
          '인터뷰 후 24시간 내에 정리하세요',
          '인용문 그대로 기록하면 나중에 유용해요',
          '팀원이 있다면 함께 리뷰하세요'
        ]
      },
      checklist: [
        {
          id: 'check-5-1',
          text: '모든 인터뷰 내용을 한 곳에 정리하기',
          helpText: '노션, 스프레드시트, 문서 등'
        },
        {
          id: 'check-5-2',
          text: '공통적으로 언급된 문제 3가지 찾기',
          helpText: '빈도수를 세어보세요'
        },
        {
          id: 'check-5-3',
          text: '가장 중요한 인사이트 1개 선정하기',
          helpText: '다음 단계에 가장 영향을 줄 발견'
        },
        {
          id: 'check-5-4',
          text: '다음 액션 아이템 3가지 적기',
          helpText: '구체적이고 실행 가능하게'
        }
      ]
    }
  ]
}

/** 모든 문제 데이터 (확장 가능) */
export const problems: Record<string, Problem> = {
  customer: customerProblem
}

// -------------------- 유틸리티 함수 --------------------

/** 문제 ID로 문제 데이터 가져오기 */
export function getProblemById(problemId: string): Problem | undefined {
  return Object.values(problems).find(p => p.id === problemId)
}

/** 카테고리 ID로 문제 데이터 가져오기 */
export function getProblemByCategory(categoryId: string): Problem | undefined {
  return problems[categoryId]
}

/** 초기 진행 상태 생성 */
export function createInitialProgress(problem: Problem): UserProgress {
  const now = new Date().toISOString()

  return {
    id: `progress-${Date.now()}`,
    problemId: problem.id,
    currentStepId: problem.steps[0]?.id || '',
    stepProgress: problem.steps.map((step, index) => ({
      stepId: step.id,
      status: index === 0 ? 'available' : 'locked',
      checklistProgress: step.checklist.map(item => ({
        itemId: item.id,
        completed: false
      }))
    })),
    startedAt: now
  }
}

/** 진행률 계산 (%) */
export function calculateProgress(progress: UserProgress): number {
  const totalItems = progress.stepProgress.reduce(
    (sum, step) => sum + step.checklistProgress.length,
    0
  )

  const completedItems = progress.stepProgress.reduce(
    (sum, step) => sum + step.checklistProgress.filter(item => item.completed).length,
    0
  )

  if (totalItems === 0) return 0
  return Math.round((completedItems / totalItems) * 100)
}

/** 단계별 진행률 계산 (%) */
export function calculateStepProgress(stepProgress: StepProgress): number {
  const total = stepProgress.checklistProgress.length
  const completed = stepProgress.checklistProgress.filter(item => item.completed).length

  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

/** 다음 잠금 해제할 단계 확인 */
export function getNextUnlockableStep(
  problem: Problem,
  progress: UserProgress
): Step | null {
  const currentIndex = problem.steps.findIndex(
    s => s.id === progress.currentStepId
  )

  if (currentIndex < 0 || currentIndex >= problem.steps.length - 1) {
    return null
  }

  return problem.steps[currentIndex + 1]
}

/** 체크리스트 아이템 토글 */
export function toggleChecklistItem(
  progress: UserProgress,
  stepId: string,
  itemId: string
): UserProgress {
  const now = new Date().toISOString()

  return {
    ...progress,
    stepProgress: progress.stepProgress.map(sp => {
      if (sp.stepId !== stepId) return sp

      return {
        ...sp,
        checklistProgress: sp.checklistProgress.map(cp => {
          if (cp.itemId !== itemId) return cp

          return {
            ...cp,
            completed: !cp.completed,
            completedAt: !cp.completed ? now : undefined
          }
        })
      }
    })
  }
}

/** 단계 완료 처리 및 다음 단계 잠금 해제 */
export function completeStepAndUnlockNext(
  progress: UserProgress,
  stepId: string
): UserProgress {
  const now = new Date().toISOString()
  const stepIndex = progress.stepProgress.findIndex(sp => sp.stepId === stepId)

  if (stepIndex < 0) return progress

  const updatedProgress = {
    ...progress,
    stepProgress: progress.stepProgress.map((sp, index) => {
      if (index === stepIndex) {
        return { ...sp, status: 'completed' as const, completedAt: now }
      }
      if (index === stepIndex + 1) {
        return { ...sp, status: 'available' as const }
      }
      return sp
    })
  }

  // 다음 단계로 currentStepId 업데이트
  if (stepIndex + 1 < progress.stepProgress.length) {
    updatedProgress.currentStepId = progress.stepProgress[stepIndex + 1].stepId
  }

  return updatedProgress
}

/** 모든 단계 완료 여부 확인 */
export function isAllStepsCompleted(progress: UserProgress): boolean {
  return progress.stepProgress.every(sp => sp.status === 'completed')
}
