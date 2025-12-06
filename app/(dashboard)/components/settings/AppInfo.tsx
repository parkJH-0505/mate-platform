'use client'

import React from 'react'
import { APP_INFO } from '@/app/data/settingsData'

interface InfoItemProps {
  label: string
  value: string
  onClick?: () => void
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, onClick }) => {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`
        w-full px-4 py-3.5
        flex items-center justify-between
        ${onClick ? 'hover:bg-white/[0.02] transition-colors' : ''}
      `}
    >
      <span className="text-sm text-white/60">{label}</span>
      <span className={`text-sm ${onClick ? 'text-primary' : 'text-white/40'}`}>
        {value}
        {onClick && <span className="ml-1">→</span>}
      </span>
    </Component>
  )
}

export const AppInfo: React.FC = () => {
  const handleTerms = () => {
    // 이용약관 페이지로 이동 (추후 구현)
    alert('이용약관 페이지는 준비 중입니다.')
  }

  const handlePrivacy = () => {
    // 개인정보처리방침 페이지로 이동 (추후 구현)
    alert('개인정보처리방침 페이지는 준비 중입니다.')
  }

  const handleOpenSource = () => {
    // 오픈소스 라이선스 페이지로 이동 (추후 구현)
    alert('오픈소스 라이선스 페이지는 준비 중입니다.')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/60 px-1">앱 정보</h3>

      <div className="
        rounded-2xl
        bg-white/[0.03] border border-white/[0.06]
        divide-y divide-white/[0.06]
      ">
        <InfoItem label="버전" value={APP_INFO.version} />
        <InfoItem label="이용약관" value="보기" onClick={handleTerms} />
        <InfoItem label="개인정보처리방침" value="보기" onClick={handlePrivacy} />
        <InfoItem label="오픈소스 라이선스" value="보기" onClick={handleOpenSource} />
      </div>

      {/* 로고 및 저작권 */}
      <div className="text-center py-4">
        <div className="text-2xl mb-2">🚀</div>
        <p className="text-sm font-semibold text-white/80">MATE</p>
        <p className="text-xs text-white/30 mt-1">
          © 2024 {APP_INFO.developer}. All rights reserved.
        </p>
      </div>
    </div>
  )
}
