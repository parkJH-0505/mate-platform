'use client'

import React from 'react'

const steps = [
  {
    number: '01',
    title: '3분 온보딩',
    description: '산업, 창업 단계, 지금 겪는 고민을 알려주세요. AI가 당신을 파악합니다.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    number: '02',
    title: '맞춤 커리큘럼 생성',
    description: 'AI가 당신의 상황에 맞는 학습 순서와 콘텐츠를 큐레이션합니다.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    number: '03',
    title: '학습 & 실행',
    description: '검증된 창업가의 콘텐츠로 배우고, 바로 실행하세요.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
]

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-accent-purple uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white">
            어떻게 작동하나요?
          </h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto">
            3단계만으로 나만의 맞춤 커리큘럼을 받으세요
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Card */}
              <div className="
                relative z-10 p-8 rounded-2xl text-center
                bg-gradient-to-br from-white/[0.04] to-transparent
                border border-white/[0.06]
                backdrop-blur-sm
                transition-all duration-500 ease-out
                hover:border-accent-purple/30
                hover:shadow-[0_0_40px_rgba(147,97,253,0.1)]
                hover:-translate-y-2
              ">
                {/* Step Number */}
                <div className="
                  inline-flex items-center justify-center
                  w-16 h-16 mb-6 rounded-2xl
                  bg-gradient-to-br from-accent-purple/20 to-accent-purple/5
                  border border-accent-purple/20
                  group-hover:shadow-[0_0_30px_rgba(147,97,253,0.3)]
                  transition-all duration-500
                ">
                  <span className="text-accent-purple">{step.icon}</span>
                </div>

                {/* Number Badge */}
                <div className="
                  absolute -top-3 -right-3
                  w-10 h-10 rounded-full
                  bg-[#0a0a0a] border border-white/[0.08]
                  flex items-center justify-center
                  text-xs font-bold text-white/60
                ">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow (Mobile) */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4 md:hidden">
                  <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
