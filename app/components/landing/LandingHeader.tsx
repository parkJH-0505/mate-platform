'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const LandingHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-out
        ${scrolled
          ? 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.06]'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-[#ff6b4a] bg-clip-text text-transparent">
              MATE
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="
                px-4 py-2 rounded-md
                text-sm font-medium text-white/60
                transition-all duration-200
                hover:text-white hover:bg-white/5
              "
            >
              로그인
            </button>
            <button
              onClick={() => router.push('/onboarding')}
              className="
                px-5 py-2.5 rounded-lg
                bg-gradient-to-r from-accent-purple to-primary
                text-sm font-semibold text-white
                transition-all duration-300 ease-out
                hover:shadow-[0_0_20px_rgba(147,97,253,0.4)]
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              무료로 시작하기
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
