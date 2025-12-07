'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 산업별 라벨 매핑
const INDUSTRY_LABELS: Record<string, string> = {
  'tech': 'IT/소프트웨어',
  'IT/소프트웨어': 'IT/소프트웨어',
  'ecommerce': '이커머스/커머스',
  '이커머스/커머스': '이커머스/커머스',
  'fnb': 'F&B/요식업',
  'F&B/요식업': 'F&B/요식업',
  'content': '콘텐츠/미디어',
  '콘텐츠/미디어': '콘텐츠/미디어',
  'education': '교육/에듀테크',
  '교육/에듀테크': '교육/에듀테크',
  'health': '헬스케어/바이오',
  '헬스케어/바이오': '헬스케어/바이오',
  'finance': '핀테크/금융',
  '핀테크/금융': '핀테크/금융',
  'other': '기타',
}

// 단계별 라벨 매핑
const STAGE_LABELS: Record<string, string> = {
  'idea': '아이디어 단계',
  '아이디어 단계': '아이디어 단계',
  '아이디어만 있음': '아이디어 단계',
  'validation': 'PMF 검증 중',
  'PMF 검증 중': 'PMF 검증 중',
  'mvp': 'MVP 개발/출시',
  'MVP 개발/출시': 'MVP 개발/출시',
  'growth': '초기 성장',
  '초기 성장': '초기 성장',
  'scale': '스케일업',
  '스케일업': '스케일업',
}

// 목표별 라벨 매핑
const GOAL_LABELS: Record<string, string> = {
  'validate': '아이디어 검증 완료',
  '아이디어 검증 완료': '아이디어 검증 완료',
  'launch': 'MVP 출시',
  'MVP 출시': 'MVP 출시',
  'first-customer': '첫 유료 고객 확보',
  '첫 유료 고객 확보': '첫 유료 고객 확보',
  'revenue-growth': '매출 성장',
  '매출 성장': '매출 성장',
  'funding': '투자 유치',
  '투자 유치': '투자 유치',
}

interface CurriculumModule {
  weekNumber: number
  title: string
  description: string
  contents: Array<{ id: string; title: string; type: string; duration: string }>
}

interface RoadmapModalProps {
  isOpen: boolean
  onClose: () => void
  onStartLearning: () => void
  curriculum: {
    userName: string
    industry: string
    stage: string
    goal: string
    durationWeeks: number
    modules: CurriculumModule[]
    totalContents: number
  } | null
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  isOpen,
  onClose,
  onStartLearning,
  curriculum,
}) => {
  if (!curriculum) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] bottom-auto md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="relative bg-[#121212] rounded-3xl border border-white/10 overflow-hidden max-h-[80vh] overflow-y-auto">
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-purple/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
              >
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent-purple to-primary flex items-center justify-center"
                  >
                    <span className="text-3xl">🎉</span>
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {curriculum.userName}님의 로드맵 완성!
                  </h2>
                  <p className="text-white/50 text-sm">
                    AI가 분석한 맞춤 학습 경로예요
                  </p>
                </div>

                {/* 개인화 요약 */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-accent-purple/20 text-accent-purple text-sm font-medium">
                      {INDUSTRY_LABELS[curriculum.industry] || curriculum.industry}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      {STAGE_LABELS[curriculum.stage] || curriculum.stage}
                    </span>
                  </div>
                  <p className="text-center text-white/60 text-sm mt-3">
                    목표: <span className="text-white font-medium">{GOAL_LABELS[curriculum.goal] || curriculum.goal}</span>
                  </p>
                </div>

                {/* 주차별 로드맵 타임라인 */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white/60 mb-4 text-center">
                    {curriculum.durationWeeks}주 로드맵
                  </h3>

                  <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                    {curriculum.modules.map((module, idx) => (
                      <React.Fragment key={module.weekNumber}>
                        <div className="flex-shrink-0 text-center">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center mb-2
                            ${idx === 0
                              ? 'bg-gradient-to-r from-accent-purple to-primary text-white'
                              : 'bg-white/10 text-white/60'
                            }
                          `}>
                            <span className="text-sm font-bold">W{module.weekNumber}</span>
                          </div>
                          <p className="text-xs text-white/50 max-w-[80px] truncate">
                            {module.title}
                          </p>
                        </div>
                        {idx < curriculum.modules.length - 1 && (
                          <div className="w-8 h-0.5 bg-white/10 flex-shrink-0 mt-[-20px]" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* 콘텐츠 수 */}
                <div className="text-center mb-6">
                  <p className="text-white/40 text-sm">
                    총 <span className="text-accent-purple font-bold">{curriculum.totalContents}개</span> 콘텐츠 · {curriculum.durationWeeks}주 완성
                  </p>
                </div>

                {/* CTA 버튼 */}
                <button
                  onClick={onStartLearning}
                  className="
                    w-full py-4 rounded-xl
                    bg-gradient-to-r from-accent-purple to-primary
                    text-white font-semibold text-lg
                    hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]
                    transition-all duration-300
                    flex items-center justify-center gap-2
                  "
                >
                  <span className="text-xl">👟</span>
                  학습 시작하기
                </button>

                <p className="text-center text-white/30 text-xs mt-4">
                  언제든 대시보드에서 진행 상황을 확인할 수 있어요
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
