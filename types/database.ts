export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          profile_image: string | null
          onboarding_industry: string | null
          onboarding_stage: string | null
          onboarding_business_type: string | null
          onboarding_concerns: string[] | null
          onboarding_goal: string | null
          onboarding_completed_at: string | null
          subscription_status: 'free' | 'active' | 'canceled' | 'expired'
          subscription_plan: 'monthly' | 'yearly' | null
          subscription_start_date: string | null
          subscription_end_date: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          profile_image?: string | null
          onboarding_industry?: string | null
          onboarding_stage?: string | null
          onboarding_business_type?: string | null
          onboarding_concerns?: string[] | null
          onboarding_goal?: string | null
          onboarding_completed_at?: string | null
          subscription_status?: 'free' | 'active' | 'canceled' | 'expired'
          subscription_plan?: 'monthly' | 'yearly' | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          profile_image?: string | null
          onboarding_industry?: string | null
          onboarding_stage?: string | null
          onboarding_business_type?: string | null
          onboarding_concerns?: string[] | null
          onboarding_goal?: string | null
          onboarding_completed_at?: string | null
          subscription_status?: 'free' | 'active' | 'canceled' | 'expired'
          subscription_plan?: 'monthly' | 'yearly' | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      anonymous_sessions: {
        Row: {
          id: string
          session_id: string
          onboarding_industry: string | null
          onboarding_stage: string | null
          onboarding_business_type: string | null
          onboarding_concerns: string[] | null
          onboarding_goal: string | null
          onboarding_name: string | null
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          session_id: string
          onboarding_industry?: string | null
          onboarding_stage?: string | null
          onboarding_business_type?: string | null
          onboarding_concerns?: string[] | null
          onboarding_goal?: string | null
          onboarding_name?: string | null
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          onboarding_industry?: string | null
          onboarding_stage?: string | null
          onboarding_business_type?: string | null
          onboarding_concerns?: string[] | null
          onboarding_goal?: string | null
          onboarding_name?: string | null
          created_at?: string
          expires_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 편의를 위한 타입 별칭
export type User = Database['public']['Tables']['users']['Row']
export type AnonymousSession = Database['public']['Tables']['anonymous_sessions']['Row']

// 온보딩 데이터 타입
export interface OnboardingData {
  industry: string
  stage: string
  businessType?: string
  concerns: string[]
  goal: string
  name: string
}
