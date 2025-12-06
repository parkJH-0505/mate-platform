'use client'

import React from 'react'
import { theme, commonStyles } from '@/lib/theme'

// Card 컴포넌트의 속성 타입 정의
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass'
  padding?: 'none' | 'small' | 'medium' | 'large'
  hoverEffect?: boolean
}

// 패딩별 스타일 매핑
const paddingClasses = {
  none: 'p-0',
  small: 'p-4',
  medium: 'p-6',
  large: 'p-8'
}

// variant별 스타일 매핑 - Premium Digital Style
const variantClasses = {
  default: commonStyles.card,
  bordered: `
    bg-gradient-to-br from-[#151515] to-[#0d0d0d] rounded-lg p-6
    border border-white/[0.12]
    shadow-[0_4px_24px_rgba(0,0,0,0.4)]
    transition-all duration-300 ease-out
  `,
  elevated: `
    bg-gradient-to-br from-[#181818] to-[#0f0f0f] rounded-lg p-6
    border border-white/[0.06]
    shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)]
    transition-all duration-300 ease-out
  `,
  glass: `
    bg-white/[0.03] backdrop-blur-2xl rounded-lg p-6
    border border-white/[0.08]
    shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]
    transition-all duration-300 ease-out
  `,
  neon: `
    bg-gradient-to-br from-[#151515] to-[#0d0d0d] rounded-lg p-6
    border border-primary/20
    shadow-[0_0_40px_rgba(234,73,46,0.08),0_4px_24px_rgba(0,0,0,0.4)]
    transition-all duration-300 ease-out
  `
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  // variant에 따른 기본 스타일 선택
  const baseStyles = variantClasses[variant]
  
  // 패딩 스타일 (default variant가 아닌 경우에만 적용)
  const paddingStyles = variant === 'default' ? '' : paddingClasses[padding]

  // hover 효과 스타일 - Premium Digital Style
  const hoverStyles = hoverEffect
    ? 'hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-white/[0.15] cursor-pointer'
    : ''
  
  // 모든 스타일을 조합
  const combinedStyles = `
    ${baseStyles}
    ${paddingStyles}
    ${hoverStyles}
    ${className}
  `
  
  return (
    <div className={combinedStyles} {...props}>
      {children}
    </div>
  )
}

// Card Header 컴포넌트
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-5 ${className}`} {...props}>
      {(title || subtitle || action) ? (
        <div className="flex items-start justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-white/50 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="ml-4">
              {action}
            </div>
          )}
        </div>
      ) : children}
    </div>
  )
}

// Card Body 컴포넌트
export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`text-white/70 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Footer 컴포넌트
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mt-5 pt-5 border-t border-white/[0.08] text-white/60 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Grid 컴포넌트
export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4
  gap?: 'small' | 'medium' | 'large'
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
}

const gapClasses = {
  small: 'gap-4',
  medium: 'gap-6',
  large: 'gap-8'
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = 'medium',
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
