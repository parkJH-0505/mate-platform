'use client'

import React, { useState, useEffect } from 'react'
import {
  ProfileSection,
  NotificationSettings,
  DataManagement,
  AppInfo,
  AccountSection
} from '../components/settings'
import { SubscriptionSection } from '../components/settings/SubscriptionSection'
import { BottomNavigation } from '../components/BottomNavigation'
import {
  AppSettings,
  getSettings,
  UserProfile,
  NotificationSettings as NotificationSettingsType
} from '@/app/data/settingsData'

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadedSettings = getSettings()
    setSettings(loadedSettings)
    setIsLoading(false)
  }, [])

  const handleProfileUpdate = (profile: UserProfile) => {
    if (settings) {
      setSettings({ ...settings, profile })
    }
  }

  const handleNotificationsUpdate = (notifications: NotificationSettingsType) => {
    if (settings) {
      setSettings({ ...settings, notifications })
    }
  }

  const handleDataReset = () => {
    // 데이터 초기화 후 페이지 새로고침
    window.location.reload()
  }

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="pt-6 pb-24 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-2xl font-bold text-white">설정</h1>
            <p className="text-sm text-white/50 mt-1">
              앱 설정을 관리하세요
            </p>
          </div>

          {/* 프로필 섹션 */}
          <ProfileSection
            profile={settings.profile}
            onUpdate={handleProfileUpdate}
          />

          {/* 구독 관리 */}
          <SubscriptionSection />

          {/* 알림 설정 */}
          <NotificationSettings
            notifications={settings.notifications}
            onUpdate={handleNotificationsUpdate}
          />

          {/* 데이터 관리 */}
          <DataManagement onDataReset={handleDataReset} />

          {/* 앱 정보 */}
          <AppInfo />

          {/* 계정 관리 */}
          <AccountSection />
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}
