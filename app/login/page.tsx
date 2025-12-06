'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState<'google' | 'kakao' | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 로그인 후 리다이렉트할 경로
  const redirectTo = searchParams.get('redirect') || '/curriculum'

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setIsLoading(provider)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.')
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>뒤로</span>
          </button>
          <span className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-primary bg-clip-text text-transparent">
            MATE
          </span>
          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3">
              로그인
            </h1>
            <p className="text-white/50">
              커리큘럼을 저장하고 학습을 이어가세요
            </p>
          </div>

          {/* Login Buttons */}
          <div className="space-y-4">
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
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <p className="text-sm text-red-400 text-center">{error}</p>
            </motion.div>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0a0a] text-white/40">또는</span>
            </div>
          </div>

          {/* Skip Login */}
          <button
            onClick={() => router.push('/onboarding')}
            className="w-full py-3 rounded-xl text-white/50 hover:text-white/70 transition-colors text-sm"
          >
            로그인 없이 둘러보기
          </button>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-white/30">
            로그인 시{' '}
            <a href="#" className="text-white/50 hover:text-white/70 underline">
              서비스 이용약관
            </a>
            {' '}및{' '}
            <a href="#" className="text-white/50 hover:text-white/70 underline">
              개인정보 처리방침
            </a>
            에 동의합니다.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
