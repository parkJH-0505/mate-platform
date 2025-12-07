'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

interface SubscriptionData {
  id: string
  planType: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  canceledAt: string | null
}

interface UseSubscriptionReturn {
  isSubscribed: boolean
  subscription: SubscriptionData | null
  isLoading: boolean
  error: string | null
  checkSubscription: () => Promise<void>
  cancelSubscription: () => Promise<boolean>
}

export function useSubscription(): UseSubscriptionReturn {
  const { user, isLoading: authLoading } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setIsSubscribed(false)
      setSubscription(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/subscriptions/status')
      const data = await response.json()

      if (data.success) {
        setIsSubscribed(data.isSubscribed)
        setSubscription(data.subscription)
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Error checking subscription:', err)
      setError('구독 상태 확인에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const cancelSubscription = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        setSubscription(data.subscription)
        // 취소되어도 현재 기간이 끝날 때까지는 구독 상태 유지
        return true
      } else {
        setError(data.error)
        return false
      }
    } catch (err) {
      console.error('Error canceling subscription:', err)
      setError('구독 취소에 실패했습니다')
      return false
    }
  }, [])

  useEffect(() => {
    if (!authLoading) {
      checkSubscription()
    }
  }, [authLoading, checkSubscription])

  return {
    isSubscribed,
    subscription,
    isLoading: authLoading || isLoading,
    error,
    checkSubscription,
    cancelSubscription
  }
}
