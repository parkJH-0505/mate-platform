'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Props {
  item: {
    id: string
    type: 'content' | 'action'
    title: string
    duration?: string
    status: 'pending' | 'completed'
    actionType?: string
  }
  index: number
  onComplete: () => void
}

export function PlanItem({ item, index, onComplete }: Props) {
  const isCompleted = item.status === 'completed'

  const getIcon = () => {
    if (item.type === 'content') return '📚'
    switch (item.actionType) {
      case 'text': return '✍️'
      case 'checklist': return '☑️'
      case 'file': return '📎'
      case 'link': return '🔗'
      case 'number': return '🔢'
      default: return '🎯'
    }
  }

  const getLabel = () => {
    return item.type === 'content' ? '학습' : '미션'
  }

  const getLabelColor = () => {
    return item.type === 'content'
      ? 'bg-blue-500/20 text-blue-400'
      : 'bg-purple-500/20 text-purple-400'
  }

  const getLink = () => {
    return item.type === 'content'
      ? `/content/${item.id}`
      : `/action/${item.id}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative flex items-center gap-3 p-3 rounded-xl
        transition-all duration-200
        ${isCompleted
          ? 'bg-white/[0.02] border border-white/[0.04]'
          : 'bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.07]'
        }
      `}
    >
      {/* 체크박스 */}
      <button
        onClick={onComplete}
        disabled={isCompleted}
        className={`
          w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${isCompleted
            ? 'bg-green-500/20 text-green-400 cursor-default'
            : 'bg-white/[0.05] hover:bg-white/[0.1] text-white/30 hover:text-white/50'
          }
        `}
      >
        {isCompleted ? (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </motion.svg>
        ) : (
          <span className="text-xs font-medium">{index + 1}</span>
        )}
      </button>

      {/* 아이콘 */}
      <span className={`text-lg flex-shrink-0 ${isCompleted ? 'opacity-50' : ''}`}>
        {getIcon()}
      </span>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getLabelColor()}`}>
            {getLabel()}
          </span>
          {item.duration && (
            <span className="text-[10px] text-white/30">{item.duration}</span>
          )}
        </div>
        <p className={`
          text-sm truncate
          ${isCompleted ? 'text-white/40 line-through' : 'text-white/80'}
        `}>
          {item.title}
        </p>
      </div>

      {/* 액션 버튼 */}
      {!isCompleted && (
        <Link
          href={getLink()}
          className="
            px-3 py-1.5 rounded-lg flex-shrink-0
            bg-accent-purple/20 text-accent-purple text-xs font-medium
            hover:bg-accent-purple/30 transition-colors
          "
        >
          시작
        </Link>
      )}

      {/* 완료 시 체크 효과 */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0 text-green-400/60 text-xs"
        >
          완료
        </motion.div>
      )}
    </motion.div>
  )
}
