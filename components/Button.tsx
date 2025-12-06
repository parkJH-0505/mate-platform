'use client'

import React from 'react'
import { theme, commonStyles } from '@/lib/theme'

// Button 컴포넌트의 속성 타입 정의
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

// 사이즈별 스타일 매핑 - Premium Digital Style
const sizeClasses = {
  small: 'px-4 py-2 text-[10px] uppercase tracking-wider',
  medium: 'px-6 py-2.5 text-xs uppercase tracking-wider',
  large: 'px-8 py-3.5 text-sm uppercase tracking-wide'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  // variant에 따른 기본 스타일 선택
  const baseStyles = commonStyles.button[variant]
  
  // 사이즈별 스타일 선택
  const sizeStyles = sizeClasses[size]
  
  // 전체 너비 스타일
  const widthStyles = fullWidth ? 'w-full' : ''
  
  // disabled 상태 스타일
  const disabledStyles = disabled || loading 
    ? 'opacity-50 cursor-not-allowed' 
    : ''
  
  // 모든 스타일을 조합
  const combinedStyles = `
    ${baseStyles}
    ${sizeStyles}
    ${widthStyles}
    ${disabledStyles}
    inline-flex items-center justify-center gap-2
    ${className}
  `
  
  return (
    <button
      className={combinedStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-current/20 border-t-current" />
      )}
      {!loading && icon && iconPosition === 'left' && <span className="opacity-80">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span className="opacity-80">{icon}</span>}
    </button>
  )
}

// Button Group 컴포넌트
export interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  spacing?: 'small' | 'medium' | 'large'
}

const spacingClasses = {
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6'
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  spacing = 'medium'
}) => {
  return (
    <div className={`flex items-center ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  )
}
