'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export const CTASection: React.FC = () => {
  const router = useRouter()

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]" />

      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <div className="
          p-12 sm:p-16 rounded-3xl
          bg-gradient-to-br from-white/[0.04] to-transparent
          border border-white/[0.08]
          backdrop-blur-xl
          shadow-[0_0_80px_rgba(147,97,253,0.05)]
        ">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            뭘 공부해야 할지
            <br />
            <span className="bg-gradient-to-r from-accent-purple via-primary to-accent-blue bg-clip-text text-transparent">
              더 이상 고민하지 마세요
            </span>
          </h2>

          <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
            3분 온보딩으로 나만의 맞춤 커리큘럼을 받아보세요.
            <br />
            커리큘럼 생성은 무료입니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/onboarding')}
              className="
                px-8 py-4 rounded-xl
                bg-gradient-to-r from-accent-purple to-primary
                text-white font-semibold text-lg
                transition-all duration-300 ease-out
                hover:shadow-[0_0_40px_rgba(147,97,253,0.4)]
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              무료로 커리큘럼 받기
            </button>

            <button
              onClick={() => {
                const howItWorks = document.querySelector('#how-it-works')
                howItWorks?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="
                px-8 py-4 rounded-xl
                bg-transparent border border-white/20
                text-white/70 font-medium text-lg
                transition-all duration-300 ease-out
                hover:bg-white/5 hover:border-white/40 hover:text-white
              "
            >
              어떻게 작동하나요?
            </button>
          </div>

          {/* Trust Badge */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/30">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">커리큘럼 생성 무료</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">월 17,000원</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">언제든 해지 가능</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
