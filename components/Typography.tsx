'use client'

import React from 'react'
import { theme, commonStyles } from '@/lib/theme'

// Heading 컴포넌트의 속성 타입 정의
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body'
  color?: 'default' | 'primary' | 'secondary' | 'white' | 'gray'
  align?: 'left' | 'center' | 'right'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

// 색상별 클래스 매핑 - Premium Digital Style
const colorClasses = {
  default: 'text-white',
  primary: 'text-primary',
  secondary: 'text-secondary',
  white: 'text-white',
  gray: 'text-white/50'
}

// 정렬별 클래스 매핑
const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

// 폰트 굵기별 클래스 매핑
const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

export const Heading: React.FC<HeadingProps> = ({
  as = 'h1',
  variant,
  color = 'default',
  align = 'left',
  weight,
  className = '',
  children,
  ...props
}) => {
  const Component = as
  const variantToUse = variant || as
  
  // 기본 스타일 선택
  const baseStyles = commonStyles.heading[variantToUse] || commonStyles.heading.body
  
  // weight가 명시적으로 지정된 경우 해당 클래스 사용, 아니면 variant의 기본값 사용
  const weightStyles = weight ? weightClasses[weight] : ''
  
  // 모든 스타일을 조합
  const combinedStyles = `
    ${baseStyles}
    ${colorClasses[color]}
    ${alignClasses[align]}
    ${weightStyles}
    ${className}
  `
  
  return (
    <Component className={combinedStyles} {...props}>
      {children}
    </Component>
  )
}

// Text 컴포넌트의 속성 타입 정의
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  color?: 'default' | 'primary' | 'secondary' | 'white' | 'gray' | 'light-gray'
  align?: 'left' | 'center' | 'right' | 'justify'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  lineHeight?: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
  as?: 'p' | 'span' | 'div'
}

// 텍스트 크기별 클래스 매핑
const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

// 텍스트 색상별 클래스 매핑 - Premium Digital Style
const textColorClasses = {
  default: 'text-white/70',
  primary: 'text-primary',
  secondary: 'text-secondary',
  white: 'text-white',
  gray: 'text-white/40',
  'light-gray': 'text-white/50'
}

// 줄 간격별 클래스 매핑
const lineHeightClasses = {
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose'
}

export const Text: React.FC<TextProps> = ({
  size = 'base',
  color = 'default',
  align = 'left',
  weight = 'normal',
  lineHeight = 'normal',
  as = 'p',
  className = '',
  children,
  ...props
}) => {
  const Component = as
  
  // 모든 스타일을 조합
  const combinedStyles = `
    ${sizeClasses[size]}
    ${textColorClasses[color]}
    ${alignClasses[align]}
    ${weightClasses[weight]}
    ${lineHeightClasses[lineHeight]}
    ${className}
  `
  
  return (
    <Component className={combinedStyles} {...props}>
      {children}
    </Component>
  )
}

// Label 컴포넌트
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  size?: 'xs' | 'sm' | 'base'
}

export const Label: React.FC<LabelProps> = ({
  required = false,
  size = 'sm',
  className = '',
  children,
  ...props
}) => {
  const combinedStyles = `
    ${sizeClasses[size]}
    font-medium
    text-white/60
    uppercase tracking-wider
    ${className}
  `

  return (
    <label className={combinedStyles} {...props}>
      {children}
      {required && <span className="text-primary ml-1">*</span>}
    </label>
  )
}

// Link 컴포넌트
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'underline' | 'hover-underline'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  external?: boolean
}

// Link variant별 클래스 매핑
const linkVariantClasses = {
  default: 'no-underline',
  underline: 'underline',
  'hover-underline': 'no-underline hover:underline'
}

// Link 색상별 클래스 매핑 - Premium Digital Style
const linkColorClasses = {
  primary: 'text-primary hover:text-[#ff6b4a]',
  secondary: 'text-secondary hover:text-emerald-300',
  white: 'text-white hover:text-white/80',
  gray: 'text-white/50 hover:text-white'
}

export const Link: React.FC<LinkProps> = ({
  variant = 'hover-underline',
  color = 'primary',
  size = 'base',
  external = false,
  className = '',
  children,
  ...props
}) => {
  // 모든 스타일을 조합
  const combinedStyles = `
    ${linkVariantClasses[variant]}
    ${linkColorClasses[color]}
    ${sizeClasses[size]}
    transition-colors duration-150 ease-in-out
    cursor-pointer
    ${className}
  `
  
  const externalProps = external 
    ? { target: '_blank', rel: 'noopener noreferrer' } 
    : {}
  
  return (
    <a className={combinedStyles} {...externalProps} {...props}>
      {children}
    </a>
  )
}

// Badge 컴포넌트
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  rounded?: boolean
}

// Badge variant별 클래스 매핑 - Premium Digital Style
const badgeVariantClasses = {
  default: 'bg-white/[0.08] text-white/70 border border-white/[0.08]',
  primary: 'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  error: 'bg-red-500/10 text-red-400 border border-red-500/20'
}

// Badge 사이즈별 클래스 매핑
const badgeSizeClasses = {
  small: 'px-2 py-0.5 text-[10px] uppercase tracking-wider',
  medium: 'px-2.5 py-1 text-xs uppercase tracking-wider',
  large: 'px-3 py-1.5 text-sm'
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'medium',
  rounded = false,
  className = '',
  children,
  ...props
}) => {
  const combinedStyles = `
    inline-flex items-center font-medium
    ${badgeVariantClasses[variant]}
    ${badgeSizeClasses[size]}
    ${rounded ? 'rounded-full' : 'rounded'}
    ${className}
  `

  return (
    <span className={combinedStyles} {...props}>
      {children}
    </span>
  )
}
