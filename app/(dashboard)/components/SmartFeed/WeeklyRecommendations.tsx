'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { RecommendationCard } from './RecommendationCard'

interface Recommendation {
  id: string
  title: string
  content_type: string
  duration_minutes: number | null
  thumbnail_url: string | null
  category: string | null
  level: number
  recommendReason: string
}

interface Props {
  sessionId?: string
}

export function WeeklyRecommendations({ sessionId }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecommendations()
  }, [sessionId])

  const fetchRecommendations = async () => {
    try {
      const params = new URLSearchParams()
      if (sessionId) params.set('sessionId', sessionId)
      params.set('limit', '3')

      const response = await fetch(`/api/feed/recommendations?${params}`)
      const data = await response.json()

      if (data.success) {
        setRecommendations(data.recommendations)
      } else {
        setError(data.error || 'Failed to load recommendations')
      }
    } catch (err) {
      setError('추천을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <RecommendationsSkeleton />
  }

  if (error || recommendations.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl p-5 border border-white/[0.06]"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">이번 주 추천</h3>
            <p className="text-xs text-white/50">당신을 위한 맞춤 콘텐츠</p>
          </div>
        </div>

        <Link
          href="/explore"
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          더 보기 →
        </Link>
      </div>

      {/* 추천 목록 */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  )
}

function RecommendationsSkeleton() {
  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-white/[0.06]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.05] animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-white/[0.05] rounded animate-pulse" />
          <div className="h-3 w-32 bg-white/[0.05] rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-white/[0.03] rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
