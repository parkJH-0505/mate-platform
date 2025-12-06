'use client'

import React from 'react'
import { theme } from '@/lib/theme'

// Avatar 컴포넌트의 속성 타입 정의
export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl'
  shape?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'away' | 'busy'
  statusPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
  bordered?: boolean
  onClick?: () => void
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  small: 'w-8 h-8 text-sm',
  medium: 'w-10 h-10 text-base',
  large: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl'
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-neutral-gray',
  away: 'bg-yellow-500',
  busy: 'bg-red-500'
}

const statusPositions = {
  'top-right': 'top-0 right-0',
  'bottom-right': 'bottom-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-left': 'bottom-0 left-0'
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'medium',
  shape = 'circle',
  status,
  statusPosition = 'bottom-right',
  bordered = false,
  onClick,
  className = ''
}) => {
  // 이름에서 이니셜 추출
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg'
  const borderClass = bordered ? 'ring-2 ring-neutral-border' : ''
  const clickableClass = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
  
  return (
    <div
      className={`relative inline-block ${className}`}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={`
            ${sizeClasses[size]}
            ${shapeClass}
            ${borderClass}
            ${clickableClass}
            object-cover
          `}
        />
      ) : (
        <div
          className={`
            ${sizeClasses[size]}
            ${shapeClass}
            ${borderClass}
            ${clickableClass}
            bg-primary text-neutral-white
            flex items-center justify-center
            font-medium
          `}
        >
          {name ? getInitials(name) : '?'}
        </div>
      )}
      {status && (
        <span
          className={`
            absolute ${statusPositions[statusPosition]}
            w-3 h-3 ${statusColors[status]}
            border-2 border-neutral-white
            rounded-full
          `}
        />
      )}
    </div>
  )
}

// AvatarGroup 컴포넌트
export interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: AvatarProps['size']
  spacing?: 'tight' | 'normal'
  className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 3,
  size = 'medium',
  spacing = 'tight',
  className = ''
}) => {
  const avatars = React.Children.toArray(children)
  const visibleAvatars = avatars.slice(0, max)
  const remainingCount = avatars.length - max
  
  const spacingClass = spacing === 'tight' ? '-space-x-2' : '-space-x-1'
  
  return (
    <div className={`flex items-center ${spacingClass} ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="relative" style={{ zIndex: visibleAvatars.length - index }}>
          {React.cloneElement(avatar as React.ReactElement, { size, bordered: true })}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            relative
            ${sizeClasses[size]}
            rounded-full
            bg-neutral-gray text-neutral-white
            flex items-center justify-center
            font-medium
            ring-2 ring-neutral-border
          `}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}

// Switch/Toggle 컴포넌트
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'primary' | 'secondary'
}

const switchSizeClasses = {
  small: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4'
  },
  medium: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5'
  },
  large: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7'
  }
}

const switchVariantClasses = {
  default: 'peer-checked:bg-neutral-gray',
  primary: 'peer-checked:bg-primary',
  secondary: 'peer-checked:bg-secondary'
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  size = 'medium',
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => {
  const sizeConfig = switchSizeClasses[size]
  
  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          disabled={disabled}
          {...props}
        />
        <div className={`
          ${sizeConfig.track}
          bg-neutral-border
          rounded-full
          peer
          ${switchVariantClasses[variant]}
          transition-colors duration-200
        `} />
        <div className={`
          absolute
          ${sizeConfig.thumb}
          bg-neutral-white
          rounded-full
          top-0.5
          left-0.5
          transition-transform duration-200
          peer-checked:${sizeConfig.translate}
          shadow-sm
        `} />
      </div>
      {label && (
        <span className="ml-3 text-sm text-neutral-dark">
          {label}
        </span>
      )}
    </label>
  )
}

// Divider 컴포넌트
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  spacing?: 'small' | 'medium' | 'large'
  label?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

const dividerSpacingClasses = {
  small: {
    horizontal: 'my-2',
    vertical: 'mx-2'
  },
  medium: {
    horizontal: 'my-4',
    vertical: 'mx-4'
  },
  large: {
    horizontal: 'my-6',
    vertical: 'mx-6'
  }
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  spacing = 'medium',
  label,
  align = 'center',
  className = ''
}) => {
  const spacingClass = dividerSpacingClasses[spacing][orientation]
  
  const borderStyle = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  }[variant]
  
  if (orientation === 'vertical') {
    return (
      <div
        className={`
          inline-block
          self-stretch
          w-px
          ${spacingClass}
          border-l
          border-neutral-border
          ${borderStyle}
          ${className}
        `}
      />
    )
  }
  
  if (label) {
    const alignClass = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    }[align]
    
    return (
      <div className={`flex items-center ${spacingClass} ${className}`}>
        <div className={`flex-1 border-t border-neutral-border ${borderStyle}`} />
        <span className="px-3 text-sm text-neutral-gray">{label}</span>
        <div className={`flex-1 border-t border-neutral-border ${borderStyle}`} />
      </div>
    )
  }
  
  return (
    <hr
      className={`
        ${spacingClass}
        border-t
        border-neutral-border
        ${borderStyle}
        ${className}
      `}
    />
  )
}

// Chip 컴포넌트 (Tag과 유사하지만 상호작용 가능)
export interface ChipProps {
  label: string
  onDelete?: () => void
  onClick?: () => void
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'small' | 'medium'
  icon?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  className?: string
}

const chipVariantClasses = {
  default: {
    base: 'bg-neutral-light text-neutral-dark border-neutral-border',
    hover: 'hover:bg-neutral-border',
    selected: 'bg-neutral-gray text-neutral-white'
  },
  primary: {
    base: 'bg-primary-light text-primary border-primary',
    hover: 'hover:bg-primary hover:text-neutral-white',
    selected: 'bg-primary text-neutral-white'
  },
  secondary: {
    base: 'bg-secondary-light text-secondary-dark border-secondary',
    hover: 'hover:bg-secondary hover:text-neutral-white',
    selected: 'bg-secondary text-neutral-white'
  }
}

const chipSizeClasses = {
  small: 'px-2 py-0.5 text-xs gap-1',
  medium: 'px-3 py-1 text-sm gap-1.5'
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onDelete,
  onClick,
  variant = 'default',
  size = 'medium',
  icon,
  selected = false,
  disabled = false,
  className = ''
}) => {
  const variantStyles = chipVariantClasses[variant]
  const sizeStyles = chipSizeClasses[size]
  const clickable = onClick || onDelete
  
  return (
    <span
      className={`
        inline-flex items-center
        rounded-full
        border
        font-medium
        transition-all duration-150
        ${sizeStyles}
        ${selected ? variantStyles.selected : variantStyles.base}
        ${clickable && !disabled ? `cursor-pointer ${variantStyles.hover}` : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      {icon && <span>{icon}</span>}
      {label}
      {onDelete && !disabled && (
        <button
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-neutral-black/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}
