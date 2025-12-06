'use client'

import React from 'react'

type Provider = 'google' | 'kakao' | 'apple'

interface SocialLoginButtonProps {
  provider: Provider
  onClick?: () => void
  disabled?: boolean
}

const providerConfig = {
  google: {
    label: 'Google로 시작하기',
    bg: 'bg-white hover:bg-white/90',
    textColor: 'text-black',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    )
  },
  kakao: {
    label: '카카오로 시작하기',
    bg: 'bg-[#FEE500] hover:bg-[#FEE500]/90',
    textColor: 'text-black',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 3C6.5 3 2 6.58 2 11c0 2.77 1.8 5.2 4.5 6.6-.2.75-.73 2.72-.84 3.15-.13.52.19.51.4.37.17-.11 2.62-1.78 3.68-2.5.74.1 1.5.16 2.26.16 5.5 0 10-3.58 10-8s-4.5-7.78-10-7.78z"/>
      </svg>
    )
  },
  apple: {
    label: 'Apple로 시작하기',
    bg: 'bg-black hover:bg-black/90 border border-white/20',
    textColor: 'text-white',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    )
  }
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
  disabled = false
}) => {
  const config = providerConfig[provider]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-3.5 rounded-xl font-medium
        ${config.bg} ${config.textColor}
        flex items-center justify-center gap-3
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
      `}
    >
      {config.icon}
      {config.label}
    </button>
  )
}
