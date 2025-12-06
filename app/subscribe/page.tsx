'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SubscribePage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = {
    monthly: {
      price: 17000,
      displayPrice: '17,000',
      period: '월',
      description: '매월 결제',
      savings: null
    },
    yearly: {
      price: 170000,
      displayPrice: '170,000',
      period: '년',
      description: '연간 결제',
      savings: '2개월 무료 (연 34,000원 절약)'
    }
  }

  const selectedPlanData = plans[selectedPlan]

  const handleSubscribe = () => {
    setIsProcessing(true)
    // 실제로는 결제 처리
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 rounded-full border-4 border-accent-purple border-t-transparent animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">결제 처리 중...</h2>
          <p className="text-white/50">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
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
          <div className="w-16" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3">
              구독 플랜 선택
            </h1>
            <p className="text-white/50">
              맞춤 커리큘럼으로 창업 학습을 시작하세요
            </p>
          </div>

          {/* Plan Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`
                  px-6 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${selectedPlan === 'monthly'
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/70'
                  }
                `}
              >
                월간
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`
                  px-6 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${selectedPlan === 'yearly'
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/70'
                  }
                `}
              >
                연간 <span className="text-accent-purple ml-1">-17%</span>
              </button>
            </div>
          </div>

          {/* Selected Plan Card */}
          <motion.div
            key={selectedPlan}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10"
          >
            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold text-white">
                  {selectedPlanData.displayPrice}
                </span>
                <span className="text-xl text-white/50">원/{selectedPlanData.period}</span>
              </div>
              {selectedPlanData.savings && (
                <p className="text-sm text-accent-purple">{selectedPlanData.savings}</p>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
                포함된 기능
              </h3>
              <div className="space-y-3">
                {[
                  '500+ 큐레이션된 창업 콘텐츠',
                  'AI 맞춤 커리큘럼 무제한',
                  '콘텐츠 북마크 & 노트',
                  '학습 진행률 추적',
                  '새로운 콘텐츠 우선 접근',
                  '커뮤니티 액세스 (출시 예정)'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent-purple flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleSubscribe}
              className="
                w-full py-4 rounded-xl
                bg-gradient-to-r from-accent-purple to-primary
                text-white font-semibold text-lg
                transition-all duration-300
                hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]
                hover:scale-[1.01]
                active:scale-[0.99]
              "
            >
              7일 무료 체험 시작
            </button>

            <p className="text-center text-xs text-white/40 mt-4">
              7일 무료 체험 후 자동 결제 · 언제든 해지 가능
            </p>
          </motion.div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 text-white/30 mb-8">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs">SSL 보안</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-xs">카드/페이 결제</span>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">
              자주 묻는 질문
            </h3>

            <div className="space-y-3">
              <details className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm text-white/80">언제든 해지할 수 있나요?</span>
                  <svg className="w-4 h-4 text-white/40 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-white/50">
                  네, 언제든 해지 가능합니다. 해지 후에도 결제 기간이 끝날 때까지 이용하실 수 있습니다.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm text-white/80">무료 체험은 어떻게 작동하나요?</span>
                  <svg className="w-4 h-4 text-white/40 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-white/50">
                  7일 동안 모든 기능을 무료로 이용할 수 있습니다. 체험 종료 전 알림을 드리며, 해지하지 않으면 자동 결제됩니다.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm text-white/80">어떤 결제 수단을 지원하나요?</span>
                  <svg className="w-4 h-4 text-white/40 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-white/50">
                  신용카드, 체크카드, 카카오페이, 네이버페이를 지원합니다.
                </p>
              </details>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
