'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export const HeroSection: React.FC = () => {
  const router = useRouter()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
            AI 개인화 창업 학습 플랫폼
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
          뭘 공부해야 할지
          <br />
          <span className="bg-gradient-to-r from-accent-purple via-primary to-accent-blue bg-clip-text text-transparent">
            AI가 찾아드립니다
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
          당신의 산업, 단계, 고민에 맞는 맞춤형 커리큘럼.
          <br className="hidden sm:block" />
          유튜브에서 절대 못 찾는, 오직 나만을 위한 학습 로드맵.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={() => router.push('/onboarding')}
            className="
              w-full sm:w-auto px-8 py-4 rounded-xl
              bg-gradient-to-r from-accent-purple to-primary
              text-white font-semibold text-lg
              transition-all duration-300 ease-out
              hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]
              hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            무료로 커리큘럼 받기
          </button>
          <button
            onClick={() => {
              const section = document.getElementById('how-it-works')
              section?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="
              w-full sm:w-auto px-8 py-4 rounded-xl
              bg-white/5 border border-white/10
              text-white/80 font-medium text-lg
              transition-all duration-300 ease-out
              hover:bg-white/10 hover:border-white/20
            "
          >
            어떻게 작동하나요?
          </button>
        </div>

        {/* Price Info */}
        <p className="text-sm text-white/40 mb-16">
          커리큘럼 생성 무료 · 콘텐츠 구독 월 17,000원
        </p>

        {/* Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">3분 온보딩</h3>
            <p className="text-sm text-white/40">산업, 단계, 고민만 알려주세요</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">맞춤 커리큘럼</h3>
            <p className="text-sm text-white/40">AI가 최적의 학습 순서 설계</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">실전 콘텐츠</h3>
            <p className="text-sm text-white/40">검증된 창업가의 노하우</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
