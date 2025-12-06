'use client'

import React, { useState } from 'react'
import { ActivityRecord, groupActivitiesByDate } from '@/app/data/statusData'
import { ActivityItem } from './ActivityItem'

interface ActivityTimelineProps {
  activities: ActivityRecord[]
  initialLimit?: number
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  initialLimit = 10
}) => {
  const [showAll, setShowAll] = useState(false)

  if (activities.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white/80">최근 활동</h3>
        <div className="
          p-6 rounded-xl text-center
          bg-white/[0.03] border border-white/[0.06]
        ">
          <div className="text-3xl mb-2">📝</div>
          <p className="text-sm text-white/50">아직 활동 기록이 없어요</p>
          <p className="text-xs text-white/30 mt-1">
            문제를 풀면 여기에 기록됩니다
          </p>
        </div>
      </div>
    )
  }

  const displayActivities = showAll ? activities : activities.slice(0, initialLimit)
  const groupedActivities = groupActivitiesByDate(displayActivities)
  const dateKeys = Object.keys(groupedActivities)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/80">최근 활동</h3>
        {activities.length > initialLimit && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            {showAll ? '접기' : '더보기'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {dateKeys.map((dateKey, dateIndex) => {
          const dayActivities = groupedActivities[dateKey]

          return (
            <div key={dateKey}>
              {/* 날짜 헤더 */}
              <div className="text-xs text-white/40 mb-3 font-medium">
                {dateKey}
              </div>

              {/* 해당 날짜의 활동들 */}
              <div className="
                pl-2 border-l border-white/[0.06]
                ml-4
              ">
                {dayActivities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    isLast={
                      dateIndex === dateKeys.length - 1 &&
                      index === dayActivities.length - 1
                    }
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {!showAll && activities.length > initialLimit && (
        <button
          onClick={() => setShowAll(true)}
          className="
            w-full py-3 rounded-xl text-sm
            bg-white/[0.03] border border-white/[0.06]
            text-white/50 hover:text-white/70 hover:bg-white/[0.05]
            transition-all
          "
        >
          이전 활동 더 보기 ({activities.length - initialLimit}개)
        </button>
      )}
    </div>
  )
}
