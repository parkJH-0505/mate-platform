'use client'

import React, { useEffect } from 'react'
import { SocialLoginButton } from './SocialLoginButton'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'signup' | 'login'
  title?: string
  description?: string
  onGoogleClick?: () => void
  onKakaoClick?: () => void
  onAppleClick?: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode = 'signup',
  title,
  description,
  onGoogleClick,
  onKakaoClick,
  onAppleClick
}) => {
  // Escape 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const defaultTitle = mode === 'signup' ? '시작할 준비가 됐어요!' : '다시 만나서 반가워요!'
  const defaultDescription = mode === 'signup'
    ? '무료로 계정을 만들고 실행 체크리스트를\n저장하고 관리하세요.'
    : '계속하려면 로그인하세요.'

  const displayTitle = title || defaultTitle
  const displayDescription = description || defaultDescription

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="
            w-full max-w-md p-8 rounded-3xl
            bg-[#121212] border border-white/[0.1]
            shadow-2xl animate-fadeIn
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4 p-2 rounded-full
              text-white/40 hover:text-white hover:bg-white/[0.05]
              transition-colors
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">{mode === 'signup' ? '🚀' : '👋'}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-3">
              {displayTitle}
            </h2>

            {/* Description */}
            <p className="text-white/60 mb-8 whitespace-pre-line">
              {displayDescription}
            </p>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <SocialLoginButton
                provider="google"
                onClick={onGoogleClick}
              />
              <SocialLoginButton
                provider="kakao"
                onClick={onKakaoClick}
              />
            </div>

            {/* Terms */}
            {mode === 'signup' && (
              <p className="mt-6 text-xs text-white/30">
                가입 시{' '}
                <a href="/terms" className="underline hover:text-white/50">이용약관</a>
                {' '}및{' '}
                <a href="/privacy" className="underline hover:text-white/50">개인정보처리방침</a>
                에 동의하게 됩니다.
              </p>
            )}

            {/* Switch Mode */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-sm text-white/40">
                {mode === 'signup' ? (
                  <>
                    이미 계정이 있으신가요?{' '}
                    <button className="text-primary hover:underline">
                      로그인
                    </button>
                  </>
                ) : (
                  <>
                    계정이 없으신가요?{' '}
                    <button className="text-primary hover:underline">
                      가입하기
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Skip */}
            <button
              onClick={onClose}
              className="mt-4 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              나중에 할게요
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
