import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface OnboardingData {
  industry: string
  stage: string
  concerns: string[]
  goal: string
  name: string
}

interface OnboardingState {
  // 온보딩 데이터
  industry: string
  stage: string
  concerns: string[]
  goal: string
  name: string

  // 메타 상태
  currentStep: number
  sessionId: string | null
  curriculumId: string | null
  isCompleted: boolean

  // 액션
  setIndustry: (industry: string) => void
  setStage: (stage: string) => void
  setConcerns: (concerns: string[]) => void
  toggleConcern: (concern: string, maxSelect?: number) => void
  setGoal: (goal: string) => void
  setName: (name: string) => void
  setCurrentStep: (step: number) => void
  setSessionId: (id: string) => void
  setCurriculumId: (id: string) => void
  setCompleted: (completed: boolean) => void
  reset: () => void

  // 유틸리티
  getOnboardingData: () => OnboardingData
  isStepValid: (step: number) => boolean
}

const initialState = {
  industry: '',
  stage: '',
  concerns: [],
  goal: '',
  name: '',
  currentStep: 0,
  sessionId: null,
  curriculumId: null,
  isCompleted: false,
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setIndustry: (industry) => set({ industry }),

      setStage: (stage) => set({ stage }),

      setConcerns: (concerns) => set({ concerns }),

      toggleConcern: (concern, maxSelect = 3) => {
        const current = get().concerns
        if (current.includes(concern)) {
          set({ concerns: current.filter(c => c !== concern) })
        } else if (current.length < maxSelect) {
          set({ concerns: [...current, concern] })
        }
      },

      setGoal: (goal) => set({ goal }),

      setName: (name) => set({ name }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setSessionId: (id) => set({ sessionId: id }),

      setCurriculumId: (id) => set({ curriculumId: id }),

      setCompleted: (completed) => set({ isCompleted: completed }),

      reset: () => set(initialState),

      getOnboardingData: () => ({
        industry: get().industry,
        stage: get().stage,
        concerns: get().concerns,
        goal: get().goal,
        name: get().name,
      }),

      isStepValid: (step) => {
        const state = get()
        switch (step) {
          case 0: return !!state.industry
          case 1: return !!state.stage
          case 2: return state.concerns.length > 0
          case 3: return !!state.goal
          case 4: return !!state.name.trim()
          default: return false
        }
      },
    }),
    {
      name: 'mate-onboarding',
      storage: createJSONStorage(() => {
        // SSR 환경에서는 빈 storage 반환
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return sessionStorage
      }),
      partialize: (state) => ({
        industry: state.industry,
        stage: state.stage,
        concerns: state.concerns,
        goal: state.goal,
        name: state.name,
        currentStep: state.currentStep,
        sessionId: state.sessionId,
        curriculumId: state.curriculumId,
        isCompleted: state.isCompleted,
      }),
    }
  )
)
