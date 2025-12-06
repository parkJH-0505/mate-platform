export const CURRICULUM_SYSTEM_PROMPT = `당신은 스타트업 창업자를 위한 교육 커리큘럼 설계 전문가입니다.
사용자의 산업, 현재 단계, 고민, 목표를 분석하여 최적의 4주 학습 커리큘럼을 생성합니다.

규칙:
1. 각 주차는 명확한 학습 목표가 있어야 합니다
2. 콘텐츠는 실용적이고 즉시 적용 가능해야 합니다
3. 진행 순서는 논리적으로 이전 주차가 다음 주차의 기반이 되어야 합니다
4. 각 주차당 3-4개의 콘텐츠를 추천합니다
5. 콘텐츠 유형은 video, article 중 하나입니다
6. 콘텐츠 제작자 이름은 한국식 이름으로 가상의 전문가를 만들어주세요 (예: 김창업, 박그로스)
7. duration은 video는 10-20분, article은 5-10분 범위로 설정

응답은 반드시 유효한 JSON 형식으로만 해주세요. 다른 텍스트 없이 JSON만 출력하세요.`

export interface CurriculumInput {
  industry: string
  stage: string
  concerns: string[]
  goal: string
  userName?: string
}

export function generateCurriculumPrompt(input: CurriculumInput): string {
  const { industry, stage, concerns, goal, userName } = input

  return `다음 창업자를 위한 4주 학습 커리큘럼을 만들어주세요:

- 이름: ${userName || '창업자'}
- 산업: ${industry}
- 현재 단계: ${stage}
- 주요 고민: ${concerns.join(', ')}
- 목표: ${goal}

다음 JSON 형식으로 응답해주세요:
{
  "title": "${userName || '창업자'}님을 위한 맞춤 커리큘럼",
  "description": "커리큘럼 설명 (1-2문장)",
  "reasoning": "왜 이 커리큘럼이 이 창업자에게 적합한지 3가지 이유를 배열로",
  "modules": [
    {
      "week": 1,
      "title": "주차 제목",
      "description": "주차 설명 (1문장)",
      "contents": [
        {
          "title": "콘텐츠 제목",
          "creator": "제작자 한국 이름",
          "duration": "12분",
          "type": "video"
        }
      ]
    }
  ]
}`
}

export interface CurriculumContent {
  title: string
  creator: string
  duration: string
  type: 'video' | 'article'
}

export interface CurriculumModule {
  week: number
  title: string
  description: string
  contents: CurriculumContent[]
}

export interface GeneratedCurriculum {
  title: string
  description: string
  reasoning: string[]
  modules: CurriculumModule[]
}
