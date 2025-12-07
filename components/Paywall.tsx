'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface PaywallProps {
  isOpen: boolean
  onClose: () => void
}

export const Paywall: React.FC<PaywallProps> = ({ isOpen, onClose }) => {
  const router = useRouter()

  const handleSubscribe = () => {
    router.push('/payment')
  }

  const benefits = [
    '모든 콘텐츠 무제한 시청',
    'AI 맞춤 커리큘럼 무제한 생성',
    '새 콘텐츠 매주 업데이트',
    '언제든 해지 가능'
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md"
            >
              <div className="rounded-3xl bg-gradient-to-br from-[#181818] to-[#0d0d0d] border border-white/[0.08] p-8 shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Lock Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-primary/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  프리미엄 콘텐츠
                </h2>
                <p className="text-white/50 text-center mb-8">
                  계속 학습하시려면 구독이 필요해요
                </p>

                {/* Price Card */}
                <div className="rounded-2xl bg-gradient-to-br from-accent-purple/10 to-primary/5 border border-accent-purple/20 p-6 mb-6">
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-3xl font-bold text-white">17,000</span>
                    <span className="text-white/50">원 / 월</span>
                  </div>

                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-white/80">
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

                {/* Subscribe Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubscribe}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(147,97,253,0.4)] transition-shadow"
                >
                  구독 시작하기
                </motion.button>

                {/* Skip Link */}
                <button
                  onClick={onClose}
                  className="w-full mt-4 py-3 text-white/40 text-sm hover:text-white/60 transition-colors"
                >
                  나중에 하기
                </button>

                {/* Trust Badge */}
                <p className="text-center text-white/30 text-xs mt-6">
                  결제는 토스페이먼츠를 통해 안전하게 처리됩니다
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Paywall
