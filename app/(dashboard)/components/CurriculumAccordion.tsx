'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface ContentItem {
  id: string
  title: string
  type: string
  duration: string
  isCompleted?: boolean
}

interface Module {
  weekNumber: number
  title: string
  description: string
  contents: ContentItem[]
}

interface CurriculumAccordionProps {
  modules: Module[]
  currentWeek?: number
  completedContentIds?: string[]
}

const TYPE_ICONS: Record<string, string> = {
  video: '🎬',
  article: '📄',
  quiz: '✍️',
  exercise: '💪',
  tool: '🛠️',
  case: '📊',
}

const TYPE_LABELS: Record<string, string> = {
  video: '영상',
  article: '아티클',
  quiz: '퀴즈',
  exercise: '실습',
  tool: '도구',
  case: '케이스',
}

export function CurriculumAccordion({
  modules,
  currentWeek = 1,
  completedContentIds = []
}: CurriculumAccordionProps) {
  const router = useRouter()
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([currentWeek])

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev =>
      prev.includes(weekNumber)
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    )
  }

  const handleContentClick = (contentId: string) => {
    router.push(`/content/${contentId}`)
  }

  const getModuleProgress = (module: Module) => {
    const completedInModule = module.contents.filter(
      c => completedContentIds.includes(c.id)
    ).length
    return {
      completed: completedInModule,
      total: module.contents.length,
      percentage: module.contents.length > 0
        ? Math.round((completedInModule / module.contents.length) * 100)
        : 0
    }
  }

  const getWeekStatus = (module: Module) => {
    const progress = getModuleProgress(module)
    if (progress.percentage === 100) return 'completed'
    if (progress.completed > 0) return 'in-progress'
    if (module.weekNumber === currentWeek) return 'current'
    if (module.weekNumber < currentWeek) return 'unlocked'
    return 'locked'
  }

  const STATUS_STYLES = {
    completed: {
      badge: 'bg-green-500/20 text-green-400 border-green-500/30',
      ring: 'ring-green-500/30',
      icon: '✓',
    },
    'in-progress': {
      badge: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
      ring: 'ring-accent-purple/30',
      icon: '→',
    },
    current: {
      badge: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
      ring: 'ring-accent-purple/30',
      icon: '▶',
    },
    unlocked: {
      badge: 'bg-white/10 text-white/60 border-white/20',
      ring: 'ring-white/10',
      icon: '○',
    },
    locked: {
      badge: 'bg-white/5 text-white/30 border-white/10',
      ring: 'ring-white/5',
      icon: '🔒',
    },
  }

  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const isExpanded = expandedWeeks.includes(module.weekNumber)
        const status = getWeekStatus(module)
        const progress = getModuleProgress(module)
        const styles = STATUS_STYLES[status]

        return (
          <motion.div
            key={module.weekNumber}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: module.weekNumber * 0.05 }}
            className={`rounded-xl border overflow-hidden transition-all ${
              status === 'locked'
                ? 'bg-white/[0.01] border-white/[0.04]'
                : 'bg-white/[0.03] border-white/[0.08]'
            }`}
          >
            {/* Week Header */}
            <button
              onClick={() => status !== 'locked' && toggleWeek(module.weekNumber)}
              disabled={status === 'locked'}
              className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                status === 'locked'
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              {/* Week Number Badge */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border ${styles.badge}`}>
                {status === 'completed' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : status === 'locked' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{module.weekNumber}</span>
                )}
              </div>

              {/* Week Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">{module.weekNumber}주차</span>
                  {status === 'current' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent-purple text-white font-medium">
                      현재
                    </span>
                  )}
                </div>
                <h4 className={`font-medium truncate ${status === 'locked' ? 'text-white/40' : 'text-white'}`}>
                  {module.title}
                </h4>
                {status !== 'locked' && (
                  <p className="text-xs text-white/40 mt-0.5">
                    {progress.completed}/{progress.total} 완료
                  </p>
                )}
              </div>

              {/* Progress Ring */}
              {status !== 'locked' && (
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-white/10"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${progress.percentage} 100`}
                      strokeLinecap="round"
                      className={status === 'completed' ? 'text-green-400' : 'text-accent-purple'}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/60">
                    {progress.percentage}%
                  </span>
                </div>
              )}

              {/* Expand Icon */}
              {status !== 'locked' && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/40"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              )}
            </button>

            {/* Contents List */}
            <AnimatePresence>
              {isExpanded && status !== 'locked' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {/* Week Description */}
                    {module.description && (
                      <p className="text-xs text-white/50 pb-2 border-b border-white/5">
                        {module.description}
                      </p>
                    )}

                    {/* Content Items */}
                    {module.contents.map((content, idx) => {
                      const isCompleted = completedContentIds.includes(content.id)

                      return (
                        <motion.button
                          key={content.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => handleContentClick(content.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                            isCompleted
                              ? 'bg-green-500/10 hover:bg-green-500/15'
                              : 'bg-white/[0.02] hover:bg-white/[0.05]'
                          }`}
                        >
                          {/* Completion Status */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? 'bg-green-500/20'
                              : 'bg-white/10'
                          }`}>
                            {isCompleted ? (
                              <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="text-xs text-white/40">{idx + 1}</span>
                            )}
                          </div>

                          {/* Content Info */}
                          <div className="flex-1 min-w-0 text-left">
                            <p className={`text-sm truncate ${isCompleted ? 'text-white/60' : 'text-white'}`}>
                              {content.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-white/40">
                                {TYPE_ICONS[content.type] || '📚'} {TYPE_LABELS[content.type] || content.type}
                              </span>
                              <span className="text-xs text-white/30">·</span>
                              <span className="text-xs text-white/40">{content.duration}</span>
                            </div>
                          </div>

                          {/* Arrow */}
                          <svg className={`w-4 h-4 flex-shrink-0 ${isCompleted ? 'text-green-400/50' : 'text-white/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
