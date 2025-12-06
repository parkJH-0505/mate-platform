'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboardingStore'

export default function OnboardingCompletePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<'google' | 'kakao' | null>(null)

  const { name, sessionId } = useOnboardingStore()

  // 세션이 없으면 온보딩으로 리다이렉트
  useEffect(() => {
    if (!sessionId && !name) {
      router.push('/onboarding')
    }
  }, [sessionId, name, router])

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setIsLoading(provider)
    // 프로토타입: 소셜 로그인 없이 바로 커리큘럼 생성으로 이동
    setTimeout(() => {
      router.push('/curriculum/generating')
    }, 500)
  }

  const handleSkip = () => {
    // 로그인 없이 커리큘럼 생성으로 이동
    router.push('/curriculum/generating')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-primary bg-clip-text text-transparent">
            MATE
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-accent-purple to-primary p-[2px]">
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <svg className="w-10 h-10 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-3">
            커리큘럼이 완성되었습니다!
          </h1>
          <p className="text-white/50 mb-8">
            {name}님, 로그인하면 커리큘럼을 저장하고<br />
            학습 진행 상황을 추적할 수 있어요
          </p>

          {/* Benefits */}
          <div className="mb-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-left">
                <svg className="w-5 h-5 text-accent-purple flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/70 text-sm">맞춤 커리큘럼 영구 저장</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <svg className="w-5 h-5 text-accent-purple flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/70 text-sm">학습 진행률 자동 추적</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <svg className="w-5 h-5 text-accent-purple flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/70 text-sm">언제든지 이어서 학습</span>
              </div>
            </div>
          </div>

          {/* Login Buttons */}
          <div className="space-y-3">
            {/* Google Login */}
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading !== null}
              className={`
                w-full py-4 px-6 rounded-xl
                flex items-center justify-center gap-3
                bg-white text-gray-800 font-medium
                transition-all duration-200
                ${isLoading === 'google' ? 'opacity-70 cursor-wait' : 'hover:bg-gray-100'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>Google로 계속하기</span>
            </button>

            {/* Kakao Login */}
            <button
              onClick={() => handleSocialLogin('kakao')}
              disabled={isLoading !== null}
              className={`
                w-full py-4 px-6 rounded-xl
                flex items-center justify-center gap-3
                bg-[#FEE500] text-[#191919] font-medium
                transition-all duration-200
                ${isLoading === 'kakao' ? 'opacity-70 cursor-wait' : 'hover:bg-[#FFEB3B]'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading === 'kakao' ? (
                <div className="w-5 h-5 border-2 border-[#191919]/40 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#191919">
                  <path d="M12 3c-5.52 0-10 3.59-10 8 0 2.84 1.89 5.34 4.72 6.77-.21.79-.77 2.86-.88 3.3-.14.56.2.55.42.4.17-.12 2.73-1.86 3.84-2.61.63.09 1.27.14 1.9.14 5.52 0 10-3.59 10-8s-4.48-8-10-8z" />
                </svg>
              )}
              <span>카카오로 계속하기</span>
            </button>
          </div>

          {/* Error Message */}
          {/* Skip */}
          <button
            onClick={handleSkip}
            className="mt-6 text-white/40 hover:text-white/60 transition-colors text-sm"
          >
            로그인 없이 커리큘럼 보기
          </button>

          <p className="mt-4 text-xs text-white/30">
            로그인 없이 보는 경우 브라우저를 닫으면 커리큘럼이 사라집니다
          </p>
        </motion.div>
      </main>
    </div>
  )
}
