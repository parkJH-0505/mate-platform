'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { ActionHeader } from './components/ActionHeader'
import { ActionForm } from './components/ActionForm'
import { ActionTips } from './components/ActionTips'

interface Action {
  id: string
  title: string
  description: string
  instruction: string
  type: 'text' | 'checklist' | 'file' | 'link' | 'number'
  estimated_minutes: number
  difficulty: number
  tips: string[]
  example_submission: string
  checklist_items: string[]
  userProgress?: {
    id: string
    status: string
    submission_text?: string
    submission_url?: string
    submission_number?: number
    checklist_progress?: Record<string, boolean>
  }
  curriculum_contents?: {
    id: string
    title: string
    content_type: string
  }
}

export default function ActionPage() {
  const params = useParams()
  const router = useRouter()
  const { sessionId } = useOnboardingStore()

  const [action, setAction] = useState<Action | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAction = useCallback(async () => {
    try {
      setError(null)
      const queryParams = new URLSearchParams()
      if (sessionId) queryParams.set('sessionId', sessionId)

      const response = await fetch(`/api/actions/${params.id}?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setAction(data.action)
        if (data.action.userProgress?.status === 'submitted' ||
            data.action.userProgress?.status === 'completed') {
          setIsSubmitted(true)
        }
      } else {
        setError(data.error || '미션을 불러오는데 실패했습니다')
      }
    } catch (err) {
      console.error('Failed to fetch action:', err)
      setError('미션을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [params.id, sessionId])

  useEffect(() => {
    fetchAction()
  }, [fetchAction])

  const handleSubmit = async (submission: any) => {
    if (!action) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/actions/${action.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          ...submission
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)

        // 3초 후 대시보드로 이동
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        setError(data.error || '제출에 실패했습니다')
      }
    } catch (err) {
      console.error('Failed to submit:', err)
      setError('제출에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <ActionSkeleton />
  }

  if (error && !action) {
    return <ActionError error={error} onRetry={fetchAction} onBack={() => router.back()} />
  }

  if (!action) {
    return <ActionNotFound onBack={() => router.back()} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <ActionHeader
        title={action.title}
        estimatedMinutes={action.estimated_minutes}
        difficulty={action.difficulty}
        onBack={() => router.back()}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <SubmissionSuccess
              key="success"
              action={action}
            />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 연결된 콘텐츠 */}
              {action.curriculum_contents && (
                <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📚</span>
                    <span className="text-xs text-blue-400">연결된 학습:</span>
                    <span className="text-xs text-white/70">
                      {action.curriculum_contents.title}
                    </span>
                  </div>
                </div>
              )}

              {/* 설명 */}
              <section className="mb-6">
                <p className="text-white/70 leading-relaxed">
                  {action.description}
                </p>
                {action.instruction && (
                  <div className="mt-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                    <h4 className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                      <span>📝</span> 안내
                    </h4>
                    <p className="text-sm text-white/60 whitespace-pre-line">
                      {action.instruction}
                    </p>
                  </div>
                )}
              </section>

              {/* 제출 폼 */}
              <ActionForm
                type={action.type}
                checklistItems={action.checklist_items}
                exampleSubmission={action.example_submission}
                existingSubmission={action.userProgress}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />

              {/* 에러 메시지 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* 팁 */}
              {action.tips && action.tips.length > 0 && (
                <ActionTips tips={action.tips} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function ActionSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-white/[0.06] px-4 py-4">
        <div className="h-6 w-48 bg-white/[0.05] rounded animate-pulse" />
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          <div className="h-20 bg-white/[0.03] rounded-xl animate-pulse" />
          <div className="h-40 bg-white/[0.03] rounded-xl animate-pulse" />
          <div className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function ActionError({ error, onRetry, onBack }: { error: string, onRetry: () => void, onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="text-3xl">😕</span>
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">문제가 발생했어요</h2>
        <p className="text-sm text-white/60 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/[0.05] text-white/70"
          >
            돌아가기
          </button>
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-accent-purple text-white"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
          <span className="text-3xl">🔍</span>
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">미션을 찾을 수 없어요</h2>
        <p className="text-sm text-white/60 mb-6">이미 삭제되었거나 잘못된 링크일 수 있어요</p>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-accent-purple text-white"
        >
          돌아가기
        </button>
      </div>
    </div>
  )
}

function SubmissionSuccess({ action }: { action: Action }) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
      >
        <span className="text-5xl">🎉</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-white mb-2"
      >
        미션 완료!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-white/60 mb-2"
      >
        "{action.title}" 미션을 완료했습니다
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-accent-purple/10 border border-accent-purple/20 rounded-xl inline-block"
      >
        <p className="text-sm text-accent-purple">
          🏆 성장 기록에 저장되었어요!
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-sm text-white/40"
      >
        잠시 후 대시보드로 이동합니다...
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={() => router.push('/dashboard')}
        className="mt-4 text-sm text-accent-purple underline"
      >
        지금 바로 이동
      </motion.button>
    </motion.div>
  )
}
