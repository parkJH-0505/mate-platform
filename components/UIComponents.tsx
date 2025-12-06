'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Dropdown/Select Component
export interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  searchable?: boolean
  multiple?: boolean
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  searchable = false,
  multiple = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple && value ? value.split(',') : []
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = searchable
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue]
      setSelectedValues(newValues)
      onChange?.(newValues.join(','))
    } else {
      onChange?.(optionValue)
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-lg text-left
          bg-background-secondary border border-glass-border
          text-text-primary
          hover:border-primary-main/50 focus:border-primary-main
          focus:outline-none focus:ring-2 focus:ring-primary-main/20
          transition-all duration-200
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className={selectedOption ? '' : 'text-text-tertiary'}>
            {multiple 
              ? selectedValues.length > 0 
                ? `${selectedValues.length} selected` 
                : placeholder
              : selectedOption?.label || placeholder
            }
          </span>
        </span>
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 rounded-lg overflow-hidden
                     bg-background-secondary border border-glass-border
                     shadow-2xl backdrop-blur-xl"
          >
            {searchable && (
              <div className="p-3 border-b border-glass-border">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 bg-background-tertiary rounded-md
                           text-text-primary placeholder-text-tertiary
                           focus:outline-none focus:ring-2 focus:ring-primary-main/20"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => {
                const isSelected = multiple 
                  ? selectedValues.includes(option.value)
                  : option.value === value
                  
                return (
                  <button
                    key={option.value}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={`
                      w-full px-4 py-3 text-left flex items-center gap-2
                      hover:bg-glass-light transition-colors
                      ${isSelected ? 'bg-primary-main/20 text-primary-bright' : 'text-text-primary'}
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {multiple && (
                      <div className={`
                        w-4 h-4 rounded border-2 mr-2
                        ${isSelected 
                          ? 'bg-primary-main border-primary-main' 
                          : 'border-glass-border'
                        }
                      `}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Tab Component
export interface TabItem {
  key: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
}

export interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeKey,
  onChange,
  variant = 'default',
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-6 py-3 text-lg'
  }

  const variantClasses = {
    default: `
      border-b-2 transition-all duration-200
      hover:text-primary-bright hover:border-primary-main/50
    `,
    pills: `
      rounded-lg transition-all duration-200
      hover:bg-glass-light hover:text-primary-bright
    `,
    underline: `
      relative pb-4 transition-all duration-200
      hover:text-primary-bright
    `
  }

  const activeClasses = {
    default: 'border-primary-main text-primary-bright',
    pills: 'bg-primary-main/20 text-primary-bright',
    underline: 'text-primary-bright'
  }

  return (
    <div className={`flex items-center ${variant === 'default' ? 'border-b border-glass-border' : ''} ${className}`}>
      {items.map((item, index) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`
            flex items-center gap-2 font-medium
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${activeKey === item.key 
              ? activeClasses[variant] 
              : 'text-text-secondary border-transparent'
            }
            ${variant === 'pills' && index > 0 ? 'ml-2' : ''}
          `}
        >
          {item.icon}
          <span>{item.label}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-main/20 text-primary-bright">
              {item.badge}
            </span>
          )}
          
          {variant === 'underline' && activeKey === item.key && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-main"
            />
          )}
        </button>
      ))}
    </div>
  )
}

// Toggle/Switch Component
export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'green' | 'purple'
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  color = 'primary'
}) => {
  const sizeClasses = {
    small: { switch: 'w-8 h-4', dot: 'w-3 h-3' },
    medium: { switch: 'w-11 h-6', dot: 'w-4 h-4' },
    large: { switch: 'w-14 h-8', dot: 'w-6 h-6' }
  }

  const colorClasses = {
    primary: 'bg-primary-main',
    green: 'bg-green-500',
    purple: 'bg-accent-purple'
  }

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          ${sizeClasses[size].switch}
          relative rounded-full transition-all duration-200
          ${checked ? colorClasses[color] : 'bg-glass-border'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <motion.div
          className={`
            ${sizeClasses[size].dot}
            absolute top-1 bg-white rounded-full shadow-lg
          `}
          animate={{
            left: checked ? `calc(100% - ${parseInt(sizeClasses[size].dot.split(' ')[0].slice(2)) + 8}px)` : '4px'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </button>
      {label && (
        <span className="text-text-secondary select-none">{label}</span>
      )}
    </label>
  )
}

// Chip/Tag Component
export interface ChipProps {
  label: string
  onRemove?: () => void
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  icon?: React.ReactNode
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onRemove,
  variant = 'default',
  size = 'medium',
  icon
}) => {
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base'
  }

  const variantClasses = {
    default: 'bg-glass-light text-text-secondary border-glass-border',
    primary: 'bg-primary-main/20 text-primary-bright border-primary-main/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full border
      ${sizeClasses[size]}
      ${variantClasses[variant]}
    `}>
      {icon}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

// Tooltip Component
export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const targetRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const updatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return

    const targetRect = targetRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    let x = 0
    let y = 0

    switch (placement) {
      case 'top':
        x = targetRect.left + (targetRect.width - tooltipRect.width) / 2
        y = targetRect.top - tooltipRect.height - 8
        break
      case 'bottom':
        x = targetRect.left + (targetRect.width - tooltipRect.width) / 2
        y = targetRect.bottom + 8
        break
      case 'left':
        x = targetRect.left - tooltipRect.width - 8
        y = targetRect.top + (targetRect.height - tooltipRect.height) / 2
        break
      case 'right':
        x = targetRect.right + 8
        y = targetRect.top + (targetRect.height - tooltipRect.height) / 2
        break
    }

    setPosition({ x, y })
  }

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
    }
  }, [isVisible])

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 9999
            }}
            className="px-3 py-2 bg-background-tertiary border border-glass-border 
                     rounded-lg text-sm text-text-primary shadow-xl backdrop-blur-xl"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Breadcrumb Component
export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className = ''
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="mx-2 text-text-tertiary">{separator}</span>
          )}
          
          {item.href ? (
            <a
              href={item.href}
              className="flex items-center gap-1.5 text-text-secondary 
                       hover:text-primary-bright transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ) : (
            <span className="flex items-center gap-1.5 text-text-primary font-medium">
              {item.icon}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Avatar Component
export interface AvatarProps {
  src?: string
  name?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  status?: 'online' | 'offline' | 'busy' | 'away'
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'medium',
  status,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
    xlarge: 'w-16 h-16 text-lg'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-glass-border`}
        />
      ) : (
        <div className={`
          ${sizeClasses[size]} 
          rounded-full flex items-center justify-center font-medium
          bg-gradient-to-br from-accent-purple to-primary-main text-white
        `}>
          {initials}
        </div>
      )}
      
      {status && (
        <span className={`
          absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background-primary
          ${statusColors[status]}
        `} />
      )}
    </div>
  )
}

// Skeleton Loader Component
export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  className?: string
  animation?: 'pulse' | 'wave'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  className = '',
  animation = 'pulse'
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  const defaultHeight = {
    text: '1em',
    circular: width,
    rectangular: '100px'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'bg-gradient-to-r from-transparent via-glass-heavy to-transparent bg-size-200 animate-gradient-x'
  }

  return (
    <div
      className={`
        bg-glass-light
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : (height || defaultHeight[variant])
      }}
    />
  )
}
