'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  type: 'text' | 'checklist' | 'file' | 'link' | 'number'
  checklistItems?: string[]
  exampleSubmission?: string
  existingSubmission?: {
    submission_text?: string
    submission_url?: string
    submission_number?: number
    checklist_progress?: Record<string, boolean>
  }
  isSubmitting: boolean
  onSubmit: (data: any) => void
}

export function ActionForm({
  type,
  checklistItems = [],
  exampleSubmission,
  existingSubmission,
  isSubmitting,
  onSubmit
}: Props) {
  // 텍스트 입력
  const [text, setText] = useState(existingSubmission?.submission_text || '')

  // 링크 입력
  const [url, setUrl] = useState(existingSubmission?.submission_url || '')

  // 숫자 입력
  const [number, setNumber] = useState(existingSubmission?.submission_number?.toString() || '')

  // 체크리스트
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    existingSubmission?.checklist_progress || {}
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    switch (type) {
      case 'text':
        if (text.trim()) {
          onSubmit({ submissionType: 'text', text: text.trim() })
        }
        break
      case 'link':
        if (url.trim()) {
          onSubmit({ submissionType: 'link', url: url.trim() })
        }
        break
      case 'number':
        if (number) {
          onSubmit({ submissionType: 'number', number: parseFloat(number) })
        }
        break
      case 'checklist':
        onSubmit({ submissionType: 'checklist', checklistProgress: checklist })
        break
      default:
        break
    }
  }

  const isValid = () => {
    switch (type) {
      case 'text':
        return text.trim().length > 0
      case 'link':
        return url.trim().length > 0
      case 'number':
        return number.length > 0 && !isNaN(parseFloat(number))
      case 'checklist':
        return Object.values(checklist).some(v => v)
      default:
        return false
    }
  }

  const toggleChecklistItem = (item: string) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  const checklistProgress = () => {
    const completed = Object.values(checklist).filter(Boolean).length
    return Math.round((completed / checklistItems.length) * 100)
  }

  // 텍스트 폼
  if (type === 'text') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            내 답변
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={exampleSubmission || '여기에 작성해주세요...'}
            rows={8}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/[0.05] border border-white/[0.08]
              text-white placeholder-white/30
              focus:border-accent-purple/50 focus:outline-none focus:ring-1 focus:ring-accent-purple/30
              resize-none transition-all
            "
          />
          <div className="mt-2 flex items-center justify-between text-xs text-white/40">
            <span>{text.length}자</span>
            {text.length > 0 && text.length < 20 && (
              <span className="text-yellow-400">좀 더 자세히 작성해보세요</span>
            )}
          </div>
        </div>

        <SubmitButtons
          isSubmitting={isSubmitting}
          isValid={isValid()}
        />
      </form>
    )
  }

  // 링크 폼
  if (type === 'link') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            URL 입력
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/[0.05] border border-white/[0.08]
              text-white placeholder-white/30
              focus:border-accent-purple/50 focus:outline-none focus:ring-1 focus:ring-accent-purple/30
              transition-all
            "
          />
        </div>

        <SubmitButtons
          isSubmitting={isSubmitting}
          isValid={isValid()}
        />
      </form>
    )
  }

  // 숫자 폼
  if (type === 'number') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            숫자 입력
          </label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="0"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/[0.05] border border-white/[0.08]
              text-white placeholder-white/30
              focus:border-accent-purple/50 focus:outline-none focus:ring-1 focus:ring-accent-purple/30
              transition-all text-2xl font-bold text-center
            "
          />
        </div>

        <SubmitButtons
          isSubmitting={isSubmitting}
          isValid={isValid()}
        />
      </form>
    )
  }

  // 체크리스트 폼
  if (type === 'checklist') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-white/70">
              체크리스트
            </label>
            <span className="text-xs text-accent-purple">
              {checklistProgress()}% 완료
            </span>
          </div>

          {/* 진행률 바 */}
          <div className="h-1.5 bg-white/[0.05] rounded-full mb-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${checklistProgress()}%` }}
              className="h-full bg-accent-purple rounded-full"
            />
          </div>

          <div className="space-y-2">
            {checklistItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleChecklistItem(item)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl
                  transition-all text-left
                  ${checklist[item]
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                  }
                `}
              >
                <div className={`
                  w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                  ${checklist[item]
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-white/[0.05] text-white/30'
                  }
                `}>
                  {checklist[item] ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${checklist[item] ? 'text-white/60 line-through' : 'text-white/80'}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>

        <SubmitButtons
          isSubmitting={isSubmitting}
          isValid={isValid()}
        />
      </form>
    )
  }

  // 지원하지 않는 유형
  return (
    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
      <p className="text-yellow-400 text-sm">
        이 미션 유형({type})은 곧 지원될 예정입니다.
      </p>
    </div>
  )
}

function SubmitButtons({ isSubmitting, isValid }: { isSubmitting: boolean, isValid: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        className="
          flex-1 py-3.5 rounded-xl
          bg-white/[0.05] text-white/70 font-medium
          hover:bg-white/[0.08] transition-colors
        "
      >
        임시저장
      </button>
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="
          flex-1 py-3.5 rounded-xl
          bg-accent-purple text-white font-semibold
          hover:bg-accent-purple/80 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            제출 중...
          </>
        ) : (
          '제출하기'
        )}
      </button>
    </div>
  )
}
