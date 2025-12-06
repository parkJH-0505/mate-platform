'use client'

import React from 'react'
import { NotificationSettings as NotificationSettingsType, updateNotifications } from '@/app/data/settingsData'

interface ToggleItemProps {
  label: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}

const ToggleItem: React.FC<ToggleItemProps> = ({
  label,
  description,
  enabled,
  onChange
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/40 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative w-12 h-7 rounded-full
          transition-colors duration-200
          ${enabled ? 'bg-primary' : 'bg-white/10'}
        `}
      >
        <div className={`
          absolute top-1 w-5 h-5 rounded-full
          bg-white shadow-md
          transition-transform duration-200
          ${enabled ? 'left-6' : 'left-1'}
        `} />
      </button>
    </div>
  )
}

interface NotificationSettingsProps {
  notifications: NotificationSettingsType
  onUpdate: (notifications: NotificationSettingsType) => void
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notifications,
  onUpdate
}) => {
  const handleToggle = (key: keyof NotificationSettingsType, value: boolean) => {
    const updated = updateNotifications({ [key]: value })
    onUpdate(updated.notifications)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/60 px-1">알림 설정</h3>

      <div className="
        px-4 rounded-2xl
        bg-white/[0.03] border border-white/[0.06]
        divide-y divide-white/[0.06]
      ">
        <ToggleItem
          label="매일 학습 알림"
          description="매일 오전 9시에 학습 리마인더를 받습니다"
          enabled={notifications.dailyReminder}
          onChange={(v) => handleToggle('dailyReminder', v)}
        />
        <ToggleItem
          label="단계 완료 알림"
          description="단계를 완료하면 알림을 받습니다"
          enabled={notifications.stepComplete}
          onChange={(v) => handleToggle('stepComplete', v)}
        />
        <ToggleItem
          label="성취 획득 알림"
          description="새로운 배지를 획득하면 알림을 받습니다"
          enabled={notifications.achievementUnlock}
          onChange={(v) => handleToggle('achievementUnlock', v)}
        />
        <ToggleItem
          label="주간 리포트"
          description="매주 월요일 학습 현황 리포트를 받습니다"
          enabled={notifications.weeklyReport}
          onChange={(v) => handleToggle('weeklyReport', v)}
        />
      </div>

      <p className="text-xs text-white/30 px-1">
        * 알림 기능은 현재 개발 중입니다
      </p>
    </div>
  )
}
