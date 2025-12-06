'use client'

import React, { useEffect } from 'react'
import { Button } from './Button'
import { Heading, Text } from './Typography'

// Modal 컴포넌트의 속성 타입 정의
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'full'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  footer?: React.ReactNode
}

// 모달 사이즈별 클래스 매핑
const modalSizeClasses = {
  small: 'max-w-md',
  medium: 'max-w-lg',
  large: 'max-w-2xl',
  full: 'max-w-4xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer
}) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])
  
  // 모달이 열려있을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`
          relative bg-gradient-to-br from-[#181818] to-[#0d0d0d] rounded-lg
          shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]
          transform transition-all duration-300
          border border-white/[0.08]
          backdrop-blur-2xl
          w-full ${modalSizeClasses[size]}
        `}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-5 border-b border-white/[0.06]">
              {title && (
                <Heading as="h3" variant="h4" color="white">
                  {title}
                </Heading>
              )}
              {showCloseButton && (
                <button
                  className="ml-auto p-1.5 rounded text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
                  onClick={onClose}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-5 text-white/70">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/[0.06] bg-black/20 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Alert 컴포넌트의 속성 타입 정의
export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  closable?: boolean
  onClose?: () => void
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

// Alert 타입별 스타일 매핑 - Premium Digital Style
const alertTypeStyles = {
  info: {
    container: 'bg-blue-500/[0.08] border-blue-500/20 backdrop-blur-sm',
    icon: 'text-blue-400',
    title: 'text-blue-300',
    content: 'text-blue-200/80'
  },
  success: {
    container: 'bg-emerald-500/[0.08] border-emerald-500/20 backdrop-blur-sm',
    icon: 'text-emerald-400',
    title: 'text-emerald-300',
    content: 'text-emerald-200/80'
  },
  warning: {
    container: 'bg-amber-500/[0.08] border-amber-500/20 backdrop-blur-sm',
    icon: 'text-amber-400',
    title: 'text-amber-300',
    content: 'text-amber-200/80'
  },
  error: {
    container: 'bg-red-500/[0.08] border-red-500/20 backdrop-blur-sm',
    icon: 'text-red-400',
    title: 'text-red-300',
    content: 'text-red-200/80'
  }
}

// 기본 아이콘들
const defaultIcons = {
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  closable = false,
  onClose,
  icon,
  action,
  className = ''
}) => {
  const styles = alertTypeStyles[type]
  const defaultIcon = defaultIcons[type]
  
  return (
    <div className={`
      rounded-xl border p-4
      ${styles.container}
      ${className}
    `}>
      <div className="flex">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {icon || defaultIcon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-semibold ${styles.title} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles.content}`}>
            {children}
          </div>
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
        {closable && (
          <div className="ml-auto pl-3">
            <button
              className={`
                inline-flex rounded-lg p-1.5
                ${styles.icon}
                hover:bg-alpha-white10
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
                transition-all duration-200
              `}
              onClick={onClose}
            >
              <span className="sr-only">닫기</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Toast 컴포넌트의 속성 타입 정의
export interface ToastProps extends AlertProps {
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

// Position별 클래스 매핑
const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4'
}

export const Toast: React.FC<ToastProps> = ({
  duration = 5000,
  position = 'top-right',
  onClose,
  ...alertProps
}) => {
  useEffect(() => {
    if (duration && duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])
  
  return (
    <div className={`fixed z-50 ${positionClasses[position]} max-w-sm`}>
      <div className="animate-[slideIn_0.3s_ease-out] shadow-lg">
        <Alert {...alertProps} closable={true} onClose={onClose} />
      </div>
    </div>
  )
}

// Dialog 컴포넌트 (Confirmation Modal)
export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'error'
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  type = 'info'
}) => {
  const typeStyles = {
    info: 'text-blue-400 bg-[rgba(59,130,246,0.15)]',
    warning: 'text-amber-400 bg-[rgba(245,158,11,0.15)]',
    error: 'text-red-400 bg-[rgba(239,68,68,0.15)]'
  }

  const typeButtonVariants = {
    info: 'primary' as const,
    warning: 'primary' as const,
    error: 'primary' as const
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      showCloseButton={false}
    >
      <div className="text-center">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${typeStyles[type]}`}>
          {defaultIcons[type === 'info' ? 'info' : type]}
        </div>
        <div className="mt-4">
          <Heading as="h3" variant="h4" align="center" color="white">
            {title}
          </Heading>
          <Text className="mt-2" align="center" color="light-gray">
            {description}
          </Text>
        </div>
      </div>
      <div className="mt-6 flex gap-3 justify-center">
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={typeButtonVariants[type]} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}
