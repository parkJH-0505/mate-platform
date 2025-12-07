'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey')
      const orderId = searchParams.get('orderId')
      const amount = searchParams.get('amount')

      if (!paymentKey || !orderId || !amount) {
        setStatus('error')
        setError('결제 정보가 올바르지 않습니다')
        return
      }

      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            planType: orderId.includes('yearly') ? 'yearly' : 'monthly'
          })
        })

        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setSubscription(data.subscription)
        } else {
          throw new Error(data.error)
        }
      } catch (err: any) {
        setStatus('error')
        setError(err.message || '결제 확인에 실패했습니다')
      }
    }

    confirmPayment()
  }, [searchParams])

  const handleContinue = () => {
    router.push('/curriculum')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-white mb-2">결제 확인 중...</h2>
          <p className="text-white/50">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">결제 실패</h2>
          <p className="text-white/50 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/payment')}
              className="w-full py-3 rounded-xl bg-accent-purple text-white font-medium"
            >
              다시 시도하기
            </button>
            <button
              onClick={() => router.push('/curriculum')}
              className="w-full py-3 rounded-xl bg-white/5 text-white/60 font-medium"
            >
              나중에 하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-12 h-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">구독 완료!</h2>
          <p className="text-white/50 mb-8">
            이제 모든 콘텐츠를 무제한으로 이용하실 수 있어요
          </p>

          {/* Subscription Info */}
          {subscription && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 mb-8 text-left">
              <h3 className="font-semibold text-white mb-4">구독 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">플랜</span>
                  <span className="text-white">
                    {subscription.planType === 'yearly' ? '연간 구독' : '월간 구독'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">다음 결제일</span>
                  <span className="text-white">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="rounded-2xl bg-gradient-to-br from-accent-purple/10 to-primary/5 border border-accent-purple/20 p-6 mb-8">
            <p className="text-accent-purple font-medium mb-3">이제 이용 가능해요</p>
            <ul className="space-y-2 text-left">
              {[
                '모든 콘텐츠 무제한 시청',
                'AI 맞춤 커리큘럼 무제한',
                '새 콘텐츠 매주 업데이트'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                  <svg className="w-4 h-4 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(147,97,253,0.4)] transition-shadow"
          >
            학습 시작하기
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
