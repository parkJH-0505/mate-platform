'use client'

import React from 'react'
import { ActivityRecord, formatTime } from '@/app/data/statusData'

interface ActivityItemProps {
  activity: ActivityRecord
  isLast?: boolean
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isLast }) => {
  // 타입별 스타일
  const getTypeStyles = () => {
    switch (activity.type) {
      case 'problem_complete':
        return {
          iconBg: 'bg-yellow-500/20',
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-400'
        }
      case 'step_complete':
        return {
          iconBg: 'bg-primary/20',
          iconColor: 'text-primary',
          textColor: 'text-primary'
        }
      case 'streak_milestone':
        return {
          iconBg: 'bg-orange-500/20',
          iconColor: 'text-orange-500',
          textColor: 'text-orange-400'
        }
      case 'problem_start':
        return {
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          textColor: 'text-blue-400'
        }
      default:
        return {
          iconBg: 'bg-white/10',
          iconColor: 'text-white/60',
          textColor: 'text-white/80'
        }
    }
  }

  const styles = getTypeStyles()
  const time = formatTime(activity.timestamp)

  return (
    <div className="flex gap-3">
      {/* 타임라인 라인 */}
      <div className="flex flex-col items-center">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm
          ${styles.iconBg}
        `}>
          {activity.icon}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-white/10 my-1" />
        )}
      </div>

      {/* 내용 */}
      <div className="flex-1 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium ${styles.textColor}`}>
              {activity.title}
            </p>
            {activity.description && (
              <p className="text-xs text-white/40 mt-0.5">
                {activity.description}
              </p>
            )}
          </div>
          <span className="text-xs text-white/30 flex-shrink-0 ml-2">
            {time}
          </span>
        </div>
      </div>
    </div>
  )
}
