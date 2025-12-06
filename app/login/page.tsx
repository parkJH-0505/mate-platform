'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useOnboardingStore } from '@/stores/onboardingStore'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { sessionId } = useOnboardingStore()

  const [isLoading, setIsLoading] = useState<'google' | 'github' | 'email' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)

  // 로그인 후 리다이렉트할 경로
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(provider)
    setError(null)

    try {
      const supabase = createClient()

      // sessionId를 URL에 포함하여 마이그레이션에 사용
      const callbackUrl = sessionId
        ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}&sessionId=${sessionId}`
        : `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl,
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading('email')
    setError(null)

    try {
      const supabase = createClient()

      if (mode === 'signup') {
        // 회원가입
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        })

        if (error) throw error

        if (data.user) {
          // 세션 데이터 마이그레이션
          if (sessionId) {
            await migrateSessionData(supabase, sessionId, data.user.id)
          }
          router.push(redirectTo)
        }
      } else {
        // 로그인
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          // 세션 데이터 마이그레이션
          if (sessionId) {
            await migrateSessionData(supabase, sessionId, data.user.id)
          }
          router.push(redirectTo)
        }
      }
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else if (err.message.includes('User already registered')) {
        setError('이미 등록된 이메일입니다. 로그인해주세요.')
        setMode('login')
      } else {
        setError(err.message || '인증 중 오류가 발생했습니다.')
      }
      setIsLoading(null)
    }
  }

  const migrateSessionData = async (supabase: any, sessionId: string, userId: string) => {
    try {
      // 온보딩 데이터 마이그레이션
      await supabase
        .from('onboarding_responses')
        .update({ user_id: userId })
        .eq('session_id', sessionId)
        .is('user_id', null)

      // 커리큘럼 마이그레이션
      await supabase
        .from('curriculums')
        .update({ user_id: userId })
        .eq('session_id', sessionId)
        .is('user_id', null)

      // 학습 진행 마이그레이션
      await supabase
        .from('user_progress')
        .update({ user_id: userId })
        .eq('session_id', sessionId)
        .is('user_id', null)
    } catch (err) {
      console.error('Migration error:', err)
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
              {mode === 'login' ? '로그인' : '회원가입'}
            </h1>
            <p className="text-white/50">
              {sessionId
                ? '학습 진행 상황을 저장하고 이어서 학습하세요'
                : '커리큘럼을 저장하고 학습을 이어가세요'
              }
            </p>
          </div>

          {/* Social Login Buttons */}
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
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span>Google로 계속하기</span>
            </button>

            {/* GitHub Login */}
            <button
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading !== null}
              className={`
                w-full py-4 px-6 rounded-xl
                flex items-center justify-center gap-3
                bg-[#24292e] text-white font-medium
                transition-all duration-200
                ${isLoading === 'github' ? 'opacity-70 cursor-wait' : 'hover:bg-[#2f363d]'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading === 'github' ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
              )}
              <span>GitHub로 계속하기</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0a0a] text-white/40">또는</span>
            </div>
          </div>

          {/* Email Form Toggle */}
          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 bg-white/5 text-white/80 font-medium hover:bg-white/10 transition-all duration-200 border border-white/10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>이메일로 계속하기</span>
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleEmailAuth}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm text-white/60 mb-2">이름</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-purple transition-colors"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-white/60 mb-2">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-purple transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-purple transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading !== null}
                className={`
                  w-full py-4 rounded-xl font-semibold
                  bg-gradient-to-r from-accent-purple to-primary text-white
                  transition-all duration-200
                  ${isLoading === 'email' ? 'opacity-70 cursor-wait' : 'hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isLoading === 'email' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  mode === 'login' ? '로그인' : '회원가입'
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="w-full text-sm text-white/50 hover:text-white/70 transition-colors"
              >
                {mode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
              </button>
            </motion.form>
          )}

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

          {/* Skip Login */}
          <div className="mt-6">
            <button
              onClick={() => router.push('/onboarding')}
              className="w-full py-3 rounded-xl text-white/50 hover:text-white/70 transition-colors text-sm"
            >
              로그인 없이 둘러보기
            </button>
          </div>

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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
