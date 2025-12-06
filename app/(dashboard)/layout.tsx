'use client'

import React from 'react'
import { DashboardHeader, BottomNavigation } from './components'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // TODO: 실제 사용자 데이터 연동
  const mockUser = {
    name: '준호',
    avatar: undefined
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <DashboardHeader
        userName={mockUser.name}
        userAvatar={mockUser.avatar}
      />

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
