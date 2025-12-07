'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSubscription } from '@/hooks/useSubscription'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmText: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
  isLoading?: boolean
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText,
  onConfirm,
  onCancel,
  danger = false,
  isLoading = false
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/[0.1] rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/70 font-medium hover:bg-white/[0.1] transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 ${
              danger
                ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                : 'bg-accent-purple text-white hover:bg-accent-purple/90'
            }`}
          >
            {isLoading ? '처리 중...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export const SubscriptionSection: React.FC = () => {
  const router = useRouter()
  const { isSubscribed, subscription, isLoading, cancelSubscription } = useSubscription()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)

  const handleCancelSubscription = async () => {
    setIsCanceling(true)
    const success = await cancelSubscription()
    setIsCanceling(false)
    if (success) {
      setShowCancelModal(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/60 px-1">구독</h3>
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-white/10 rounded mb-2" />
              <div className="h-3 w-32 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/60 px-1">구독</h3>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        {isSubscribed && subscription ? (
          <>
            {/* 구독 상태 */}
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {subscription.planType === 'yearly' ? '연간 구독' : '월간 구독'}
                  </p>
                  <p className="text-xs text-white/50">
                    {subscription.status === 'canceled' ? (
                      <span className="text-amber-400">해지 예정</span>
                    ) : (
                      <span className="text-green-400">구독 중</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">다음 결제일</span>
                  <span className="text-white">
                    {subscription.status === 'canceled'
                      ? '자동결제 없음'
                      : formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">이용 만료일</span>
                  <span className="text-white">{formatDate(subscription.currentPeriodEnd)}</span>
                </div>
                {subscription.canceledAt && (
                  <div className="flex justify-between">
                    <span className="text-white/50">해지 신청일</span>
                    <span className="text-white">{formatDate(subscription.canceledAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 구독 관리 버튼 */}
            {subscription.status !== 'canceled' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-medium text-red-400">구독 해지</span>
                <span className="text-red-400/50">→</span>
              </button>
            )}
          </>
        ) : (
          /* 구독 안 함 */
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">구독 안 함</p>
                <p className="text-xs text-white/50">첫 번째 콘텐츠만 이용 가능</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/payment')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-medium text-sm"
            >
              프리미엄 구독하기
            </button>

            <p className="text-xs text-white/30 text-center mt-3">
              월 17,000원 · 언제든 해지 가능
            </p>
          </div>
        )}
      </div>

      {/* 구독 해지 확인 모달 */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="구독을 해지하시겠어요?"
        description={`구독을 해지하면 ${subscription ? formatDate(subscription.currentPeriodEnd) : ''}까지 이용 가능하며, 이후에는 첫 번째 콘텐츠만 이용할 수 있습니다.`}
        confirmText="구독 해지"
        onConfirm={handleCancelSubscription}
        onCancel={() => setShowCancelModal(false)}
        danger
        isLoading={isCanceling}
      />
    </div>
  )
}
