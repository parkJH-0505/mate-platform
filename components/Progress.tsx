'use client'

import React from 'react'
import { theme } from '@/lib/theme'

// Progress Bar 컴포넌트
export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
  className?: string
}

// Premium Digital Style - 그라데이션 프로그레스
const variantClasses = {
  default: 'bg-gradient-to-r from-primary to-[#ff6b4a]',
  success: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
  warning: 'bg-gradient-to-r from-amber-500 to-amber-400',
  error: 'bg-gradient-to-r from-red-500 to-red-400'
}

// 글로우 효과
const variantGlowClasses = {
  default: 'shadow-[0_0_12px_rgba(234,73,46,0.5)]',
  success: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
  warning: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
  error: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]'
}

const sizeClasses = {
  small: 'h-1',
  medium: 'h-1.5',
  large: 'h-2.5'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'default',
  size = 'medium',
  animated = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-xs font-medium uppercase tracking-wider text-white/60">{label}</span>}
          {showValue && <span className="text-xs font-medium text-white/40">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`w-full bg-white/[0.06] rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`
            ${variantClasses[variant]}
            ${variantGlowClasses[variant]}
            ${sizeClasses[size]}
            rounded-full
            transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Circular Progress 컴포넌트
export interface CircularProgressProps {
  value: number
  max?: number
  size?: 'small' | 'medium' | 'large'
  strokeWidth?: number
  showValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

const circularSizeConfig = {
  small: { size: 40, fontSize: 'text-xs' },
  medium: { size: 64, fontSize: 'text-sm' },
  large: { size: 96, fontSize: 'text-base' }
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 'medium',
  strokeWidth = 4,
  showValue = true,
  variant = 'default',
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const { size: svgSize, fontSize } = circularSizeConfig[size]
  const radius = (svgSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  // SVG 그라데이션을 위한 색상
  const gradientColors = {
    default: { start: '#ea492e', end: '#ff6b4a' },
    success: { start: '#10b981', end: '#34d399' },
    warning: { start: '#f59e0b', end: '#fbbf24' },
    error: { start: '#ef4444', end: '#f87171' }
  }

  const gradientId = `progress-gradient-${variant}`

  return (
    <div className={`relative inline-flex ${className}`}>
      <svg
        width={svgSize}
        height={svgSize}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors[variant].start} />
            <stop offset="100%" stopColor={gradientColors[variant].end} />
          </linearGradient>
        </defs>
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-white/[0.06]"
        />
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          className="transition-all duration-500 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(234,73,46,0.4))' }}
        />
      </svg>
      {showValue && (
        <div className={`absolute inset-0 flex items-center justify-center ${fontSize} font-medium text-white`}>
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  )
}

// Skeleton 컴포넌트
export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = ''
}) => {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-md'
  }

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-[wave_2s_ease-in-out_infinite]',
    none: ''
  }

  const defaultSizes = {
    text: { width: '100%', height: '1rem' },
    circular: { width: '40px', height: '40px' },
    rectangular: { width: '100%', height: '120px' },
    rounded: { width: '100%', height: '120px' }
  }

  const finalWidth = width || defaultSizes[variant].width
  const finalHeight = height || defaultSizes[variant].height

  return (
    <div
      className={`
        bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04]
        ${variantStyles[variant]}
        ${animationStyles[animation]}
        ${className}
      `}
      style={{
        width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
        height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight
      }}
    />
  )
}

// SkeletonGroup 컴포넌트
export interface SkeletonGroupProps {
  count?: number
  spacing?: 'small' | 'medium' | 'large'
  children?: React.ReactNode
}

const spacingClasses = {
  small: 'space-y-2',
  medium: 'space-y-4',
  large: 'space-y-6'
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 3,
  spacing = 'medium',
  children
}) => {
  if (children) {
    return <div className={spacingClasses[spacing]}>{children}</div>
  }
  
  return (
    <div className={spacingClasses[spacing]}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  )
}

// Spinner 컴포넌트
export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'primary' | 'white'
  className?: string
}

const spinnerSizeClasses = {
  small: 'w-4 h-4 border-2',
  medium: 'w-6 h-6 border-2',
  large: 'w-10 h-10 border-[3px]'
}

const spinnerVariantClasses = {
  default: 'border-white/[0.1] border-t-white/60',
  primary: 'border-primary/20 border-t-primary',
  white: 'border-white/10 border-t-white'
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  variant = 'default',
  className = ''
}) => {
  return (
    <div
      className={`
        rounded-full
        animate-spin
        ${spinnerSizeClasses[size]}
        ${spinnerVariantClasses[variant]}
        ${className}
      `}
      style={{
        boxShadow: variant === 'primary' ? '0 0 12px rgba(234,73,46,0.3)' : undefined
      }}
    />
  )
}

// LoadingOverlay 컴포넌트
export interface LoadingOverlayProps {
  visible?: boolean
  message?: string
  blur?: boolean
  fullScreen?: boolean
  children?: React.ReactNode
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible = true,
  message,
  blur = true,
  fullScreen = false,
  children
}) => {
  if (!visible) return null

  const overlayContent = (
    <div className={`
      absolute inset-0
      bg-black/80
      ${blur ? 'backdrop-blur-xl' : ''}
      flex items-center justify-center
      z-50
    `}>
      <div className="text-center">
        <Spinner size="large" variant="primary" />
        {message && (
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-white/50">{message}</p>
        )}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50">
        {overlayContent}
      </div>
    )
  }

  return (
    <div className="relative">
      {children}
      {overlayContent}
    </div>
  )
}
