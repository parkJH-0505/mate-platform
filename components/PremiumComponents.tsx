'use client'

import React from 'react'
import { themeV2, premiumStyles } from '@/lib/theme-v2'

// Premium Glass Card Component
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'gradient'
  glow?: boolean
  blur?: 'small' | 'medium' | 'large'
  noBorder?: boolean
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  glow = false,
  blur = 'medium',
  noBorder = false,
  className = '',
  ...props
}) => {
  const variants = {
    default: `
      bg-background-secondary/40
      backdrop-blur-${blur}
      ${!noBorder ? 'border border-glass-border' : ''}
    `,
    elevated: `
      bg-background-tertiary/50
      backdrop-blur-${blur}
      ${!noBorder ? 'border border-glass-border' : ''}
      shadow-2xl shadow-black/50
    `,
    interactive: `
      ${premiumStyles.glassCard}
    `,
    gradient: `
      bg-gradient-to-br from-glass-light to-transparent
      backdrop-blur-${blur}
      ${!noBorder ? 'border border-glass-border' : ''}
      before:absolute before:inset-0 before:bg-gradient-to-br 
      before:from-accent-purple/10 before:to-primary-main/10
      before:opacity-0 hover:before:opacity-100
      before:transition-opacity before:duration-500
      before:rounded-xl before:-z-10
    `
  }

  const glowStyles = glow ? 'shadow-[0_0_60px_rgba(147,97,253,0.3)]' : ''

  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl p-8
        transition-all duration-300 ease-out
        ${variants[variant]}
        ${glowStyles}
        ${className}
      `}
      {...props}
    >
      {/* 노이즈 텍스처 오버레이 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-noise" />
      </div>
      
      {/* 컨텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Premium Button Component
export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient'
  size?: 'small' | 'medium' | 'large'
  glow?: boolean
  pulse?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const buttonSizes = {
  small: 'px-6 py-2.5 text-sm',
  medium: 'px-8 py-3.5 text-base',
  large: 'px-10 py-4 text-lg'
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  glow = true,
  pulse = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const variants = {
    primary: premiumStyles.neonButton.primary,
    secondary: `
      relative px-8 py-4
      bg-background-tertiary/80
      text-text-primary
      border border-primary-main/30
      rounded-lg
      backdrop-blur-sm
      transition-all duration-300 ease-out
      hover:bg-primary-main/20
      hover:border-primary-main/50
      hover:shadow-lg hover:shadow-primary-main/30
      active:scale-[0.98]
    `,
    ghost: premiumStyles.neonButton.ghost,
    gradient: `
      relative px-8 py-4
      bg-gradient-to-r from-accent-purple via-primary-main to-accent-pink
      text-white font-semibold
      rounded-lg
      transition-all duration-300 ease-out
      hover:shadow-2xl hover:shadow-primary-main/50
      hover:scale-[1.02]
      active:scale-[0.98]
      before:absolute before:inset-[2px]
      before:bg-background-primary before:rounded-md
      before:transition-opacity before:duration-300
      hover:before:opacity-0
    `
  }

  const glowStyles = glow && variant === 'primary' 
    ? 'hover:drop-shadow-[0_0_25px_rgba(94,162,255,0.5)]' 
    : ''
    
  const pulseStyles = pulse ? 'animate-pulse-slow' : ''
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <button
      className={`
        group relative overflow-hidden
        ${variants[variant]}
        ${buttonSizes[size]}
        ${glowStyles}
        ${pulseStyles}
        ${disabledStyles}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {/* 컨텐츠 래퍼 */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && icon}
        <span className="font-medium tracking-wide">{children}</span>
        {icon && iconPosition === 'right' && icon}
      </span>
    </button>
  )
}

// Gradient Heading Component
export interface GradientHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  gradient?: 'purple-blue' | 'pink-purple' | 'blue-cyan' | 'custom'
  customGradient?: string
  glow?: boolean
  animate?: boolean
}

const gradientPresets = {
  'purple-blue': 'from-accent-purple to-primary-bright',
  'pink-purple': 'from-accent-pink via-accent-purple to-primary-main',
  'blue-cyan': 'from-primary-main to-accent-blue',
  'custom': ''
}

export const GradientHeading: React.FC<GradientHeadingProps> = ({
  as: Component = 'h1',
  gradient = 'purple-blue',
  customGradient,
  glow = false,
  animate = false,
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    h1: 'text-6xl md:text-7xl lg:text-8xl font-bold leading-tight',
    h2: 'text-5xl md:text-6xl font-bold leading-tight',
    h3: 'text-4xl md:text-5xl font-bold leading-snug',
    h4: 'text-3xl md:text-4xl font-semibold leading-snug',
    h5: 'text-2xl md:text-3xl font-semibold leading-normal',
    h6: 'text-xl md:text-2xl font-semibold leading-normal'
  }

  const gradientClass = gradient === 'custom' 
    ? customGradient 
    : `bg-gradient-to-r ${gradientPresets[gradient]}`

  const glowStyles = glow 
    ? 'drop-shadow-[0_0_30px_rgba(147,97,253,0.5)]' 
    : ''
    
  const animateStyles = animate 
    ? 'bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500' 
    : ''

  return (
    <Component
      className={`
        ${sizeClasses[Component]}
        ${gradientClass}
        bg-clip-text text-transparent
        ${glowStyles}
        ${animateStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  )
}

// Animated Background Component
export const AnimatedBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* 기본 다크 배경 */}
      <div className="absolute inset-0 bg-background-primary" />
      
      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-purple/10 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-main/10 via-transparent to-transparent opacity-30" />
      
      {/* 애니메이션 블롭 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-main/20 rounded-full blur-3xl animate-float-delayed" />
      
      {/* 노이즈 텍스처 */}
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />
    </div>
  )
}

// Feature Card Component
export interface FeatureCardProps {
  icon?: React.ReactNode
  title: string
  description: string
  link?: string
  linkText?: string
  highlighted?: boolean
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  link,
  linkText = 'Learn more',
  highlighted = false
}) => {
  return (
    <GlassCard 
      variant={highlighted ? 'gradient' : 'interactive'}
      glow={highlighted}
      className="group h-full"
    >
      {/* 아이콘 */}
      {icon && (
        <div className="mb-6 text-primary-bright group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}
      
      {/* 타이틀 */}
      <h3 className="text-2xl font-semibold text-text-primary mb-3 group-hover:text-primary-bright transition-colors">
        {title}
      </h3>
      
      {/* 설명 */}
      <p className="text-text-secondary leading-relaxed mb-6">
        {description}
      </p>
      
      {/* 링크 */}
      {link && (
        <a 
          href={link}
          className="inline-flex items-center gap-2 text-primary-main hover:text-primary-bright transition-colors duration-300"
        >
          <span className="text-sm font-medium">{linkText}</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </GlassCard>
  )
}

// Stat Card Component
export interface StatCardProps {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  trend = 'neutral'
}) => {
  const trendColors = {
    up: 'text-semantic-success',
    down: 'text-semantic-error',
    neutral: 'text-text-tertiary'
  }

  return (
    <GlassCard variant="default" className="p-6">
      <p className="text-sm text-text-tertiary mb-2">{label}</p>
      <p className="text-3xl font-bold text-text-primary mb-2">{value}</p>
      {change && (
        <p className={`text-sm font-medium ${trendColors[trend]}`}>
          {trend === 'up' && '↑'} 
          {trend === 'down' && '↓'} 
          {change}
        </p>
      )}
    </GlassCard>
  )
}
