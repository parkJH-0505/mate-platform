'use client'

import React from 'react'
import Link from 'next/link'

export const LandingFooter: React.FC = () => {
  return (
    <footer className="relative py-16 bg-[#0a0a0a] border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-[#ff6b4a] bg-clip-text text-transparent">
                MATE
              </span>
            </Link>
            <p className="mt-2 text-sm text-white/40 max-w-xs">
              AI 기반 스타트업 문제 해결 플랫폼
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm">
            <Link href="/terms" className="text-white/40 hover:text-white transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="text-white/40 hover:text-white transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/contact" className="text-white/40 hover:text-white transition-colors">
              문의하기
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/[0.04] text-center">
          <p className="text-xs text-white/30">
            © 2025 MATE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
