'use client'

import React from 'react'

const testimonials = [
  {
    id: 1,
    quote: "뭘 공부해야 할지 막막했는데, MATE가 제 상황에 맞는 커리큘럼을 만들어줬어요. 시간 낭비 없이 필요한 것만 배웠습니다.",
    author: "김준영",
    role: "예비창업자 → 프리랜서",
    avatar: "👨‍💻"
  },
  {
    id: 2,
    quote: "유튜브로 창업 공부했는데 체계가 없었어요. MATE는 제 산업, 단계에 맞춰서 순서대로 알려줘서 좋아요.",
    author: "이서연",
    role: "직장인 → 사이드프로젝트",
    avatar: "👩‍💼"
  },
  {
    id: 3,
    quote: "이렇게까지 개인화된 추천은 처음이에요. 제가 F&B 초기창업자인 걸 알고 거기 맞는 콘텐츠만 보여주더라고요.",
    author: "박민수",
    role: "Pre-Seed 스타트업 대표",
    avatar: "👨‍🚀"
  }
]

const stats = [
  { value: '500+', label: '큐레이션된 콘텐츠', description: '검증된 창업가의 실전 노하우' },
  { value: '17,000원', label: '월 구독료', description: '커피 3잔 가격으로 무제한 학습' },
  { value: '3분', label: '온보딩 시간', description: '빠르게 맞춤 커리큘럼 생성' }
]

export const TrustSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#0a0a0a]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-purple/[0.02] to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-accent-purple uppercase tracking-wider">
            Trusted by Founders
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white">
            창업가들의 실제 후기
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="
                group p-6 rounded-2xl
                bg-gradient-to-br from-white/[0.03] to-transparent
                border border-white/[0.06]
                backdrop-blur-sm
                transition-all duration-300 ease-out
                hover:border-white/[0.12]
                hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]
                hover:-translate-y-1
              "
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <svg className="w-8 h-8 text-accent-purple/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Quote Text */}
              <p className="text-white/70 leading-relaxed mb-6 text-sm sm:text-base">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{testimonial.author}</p>
                  <p className="text-xs text-white/40">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-accent-purple uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-white/40">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
