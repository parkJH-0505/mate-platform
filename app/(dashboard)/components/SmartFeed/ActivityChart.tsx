'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  data: { date: string; count: number }[]
}

export function ActivityChart({ data }: Props) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return days[date.getDay()]
  }

  const getBarColor = (count: number, isToday: boolean) => {
    if (count === 0) return 'bg-white/[0.1]'
    if (isToday) return 'bg-purple-500'
    return 'bg-purple-500/50'
  }

  return (
    <div className="flex items-end justify-between gap-1 h-16">
      {data.map((day, index) => {
        const height = day.count > 0 ? Math.max((day.count / maxCount) * 100, 15) : 10
        const isToday = index === data.length - 1

        return (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`
                w-full rounded-t-sm min-h-[4px]
                ${getBarColor(day.count, isToday)}
              `}
              title={`${day.date}: ${day.count}개 활동`}
            />
            <span className={`text-[10px] ${isToday ? 'text-white/80 font-medium' : 'text-white/40'}`}>
              {getDayLabel(day.date)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
