'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { useAuth } from '@/hooks/useAuth'

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ''

export default function PaymentPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/payment')
    }
  }, [authLoading, user, router])

  const plans = {
    monthly: {
      name: '월간 구독',
      price: 17000,
      pricePerMonth: 17000,
      period: '월',
      badge: null
    },
    yearly: {
      name: '연간 구독',
      price: 170000,
      pricePerMonth: Math.round(170000 / 12),
      period: '년',
      badge: '17% 할인'
    }
  }

  const benefits = [
    '모든 콘텐츠 무제한 시청',
    'AI 맞춤 커리큘럼 무제한 생성',
    '새 콘텐츠 매주 업데이트',
    '언제든 해지 가능'
  ]

  const handlePayment = async () => {
    if (!TOSS_CLIENT_KEY) {
      setError('결제 시스템이 설정되지 않았습니다')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // 1. 결제 요청 생성
      const createResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType })
      })

      const createData = await createResponse.json()

      if (!createResponse.ok) {
        throw new Error(createData.error || '결제 생성에 실패했습니다')
      }

      // 2. 토스페이먼츠 SDK 로드
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)

      // 3. 결제창 열기
      await tossPayments.requestPayment('카드', {
        amount: createData.amount,
        orderId: createData.orderId,
        orderName: createData.orderName,
        customerName: createData.customerName,
        customerEmail: createData.customerEmail,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment?error=failed`
      })

    } catch (err: any) {
      console.error('Payment error:', err)

      // 사용자가 결제창을 닫은 경우
      if (err.code === 'USER_CANCEL') {
        setError(null)
        return
      }

      setError(err.message || '결제 처리 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-white">구독하기</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Content */}
      <main className="pt-20 pb-32 px-4">
        <div className="max-w-lg mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-primary/20 flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">MATE 프리미엄</h2>
            <p className="text-white/50">창업에 필요한 모든 콘텐츠를 무제한으로</p>
          </div>

          {/* Plan Selection */}
          <div className="space-y-3 mb-8">
            {(['monthly', 'yearly'] as const).map((type) => {
              const plan = plans[type]
              const isSelected = planType === type

              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPlanType(type)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-accent-purple bg-accent-purple/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-accent-purple' : 'border-white/30'
                      }`}>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-accent-purple" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{plan.name}</span>
                          {plan.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        {type === 'yearly' && (
                          <p className="text-sm text-white/40 mt-0.5">
                            월 {plan.pricePerMonth.toLocaleString()}원
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-white/50 text-sm">원/{plan.period}</span>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Benefits */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 mb-8">
            <h3 className="font-semibold text-white mb-4">포함된 혜택</h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-5 h-5 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-4 text-white/30 text-xs">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>안전결제</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>언제든 해지</span>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="max-w-lg mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(147,97,253,0.4)] transition-shadow"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                처리 중...
              </span>
            ) : (
              `${plans[planType].price.toLocaleString()}원 결제하기`
            )}
          </motion.button>
          <p className="text-center text-white/30 text-xs mt-3">
            토스페이먼츠를 통해 안전하게 결제됩니다
          </p>
        </div>
      </div>
    </div>
  )
}
