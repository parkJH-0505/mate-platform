'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface DashboardHeaderProps {
  userName?: string
  userAvatar?: string
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = '사용자',
  userAvatar
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="
      fixed top-0 left-0 right-0 z-50
      h-16 px-4
      bg-[#0a0a0a]/90 backdrop-blur-lg
      border-b border-white/[0.05]
    ">
      <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">MATE</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="
            relative p-2 rounded-full
            text-white/50 hover:text-white hover:bg-white/[0.05]
            transition-colors
          ">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="
                flex items-center gap-2 p-1.5 rounded-full
                hover:bg-white/[0.05] transition-colors
              "
            >
              <div className="
                w-8 h-8 rounded-full
                bg-gradient-to-br from-primary/30 to-primary/10
                flex items-center justify-center
                text-sm font-medium text-white
              ">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  userName.charAt(0)
                )}
              </div>
            </button>

            {/* Profile Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="
                  absolute top-full right-0 mt-2 w-48
                  py-2 rounded-xl
                  bg-[#1a1a1a] border border-white/[0.1]
                  shadow-xl
                  animate-fadeIn
                ">
                  <div className="px-4 py-2 border-b border-white/[0.05]">
                    <p className="text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-white/40">무료 플랜</p>
                  </div>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05]"
                  >
                    설정
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05]"
                    onClick={() => {
                      // TODO: 로그아웃 처리
                      setShowProfileMenu(false)
                    }}
                  >
                    로그아웃
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
