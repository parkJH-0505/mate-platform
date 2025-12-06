'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

// Navigation Bar Component
export interface NavItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  badge?: string | number
  children?: NavItem[]
}

export interface NavigationBarProps {
  logo?: React.ReactNode
  items: NavItem[]
  actions?: React.ReactNode
  sticky?: boolean
  transparent?: boolean
  className?: string
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  logo,
  items,
  actions,
  sticky = true,
  transparent = false,
  className = ''
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className={`
      ${sticky ? 'sticky top-0' : ''}
      ${transparent ? 'bg-transparent' : 'bg-background-primary/80 backdrop-blur-xl'}
      border-b border-glass-border z-40
      ${className}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {logo && <div className="flex-shrink-0">{logo}</div>}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {items.map((item, index) => (
                <NavItemComponent key={index} item={item} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {actions}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background-secondary border-t border-glass-border"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {items.map((item, index) => (
              <MobileNavItem key={index} item={item} />
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

const NavItemComponent: React.FC<{ item: NavItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (item.children) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary
                   hover:text-text-primary hover:bg-glass-light transition-all
                   flex items-center gap-2"
        >
          {item.icon}
          <span>{item.label}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {item.badge && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-main/20 text-primary-bright">
              {item.badge}
            </span>
          )}
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 rounded-lg
                        bg-background-secondary border border-glass-border
                        shadow-xl backdrop-blur-xl">
            {item.children.map((child, index) => (
              <a
                key={index}
                href={child.href}
                onClick={child.onClick}
                className="block px-4 py-2 text-sm text-text-secondary
                         hover:text-text-primary hover:bg-glass-light
                         transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="flex items-center gap-2">
                  {child.icon}
                  {child.label}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <a
      href={item.href}
      onClick={item.onClick}
      className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary
               hover:text-text-primary hover:bg-glass-light transition-all
               flex items-center gap-2"
    >
      {item.icon}
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-main/20 text-primary-bright">
          {item.badge}
        </span>
      )}
    </a>
  )
}

const MobileNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-3 py-2 rounded-lg text-base font-medium
                   text-text-secondary hover:text-text-primary hover:bg-glass-light
                   transition-all flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="pl-6 mt-2 space-y-1">
            {item.children.map((child, index) => (
              <a
                key={index}
                href={child.href}
                onClick={child.onClick}
                className="block px-3 py-2 rounded-lg text-sm text-text-secondary
                         hover:text-text-primary hover:bg-glass-light transition-all"
              >
                <span className="flex items-center gap-2">
                  {child.icon}
                  {child.label}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <a
      href={item.href}
      onClick={item.onClick}
      className="block px-3 py-2 rounded-lg text-base font-medium
               text-text-secondary hover:text-text-primary hover:bg-glass-light
               transition-all"
    >
      <span className="flex items-center gap-2">
        {item.icon}
        {item.label}
        {item.badge && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-main/20 text-primary-bright">
            {item.badge}
          </span>
        )}
      </span>
    </a>
  )
}

// Sidebar Component
export interface SidebarProps {
  items: NavItem[]
  collapsed?: boolean
  onToggle?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  collapsed = false,
  onToggle,
  header,
  footer,
  className = ''
}) => {
  return (
    <aside className={`
      flex flex-col h-full
      ${collapsed ? 'w-20' : 'w-64'}
      bg-background-secondary border-r border-glass-border
      transition-all duration-300 ease-out
      ${className}
    `}>
      {/* Header */}
      {header && (
        <div className="p-4 border-b border-glass-border">
          {header}
        </div>
      )}

      {/* Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="p-4 text-text-tertiary hover:text-text-primary
                   hover:bg-glass-light transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <SidebarItem key={index} item={item} collapsed={collapsed} />
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-glass-border">
          {footer}
        </div>
      )}
    </aside>
  )
}

const SidebarItem: React.FC<{ item: NavItem; collapsed: boolean }> = ({ item, collapsed }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (item.children && !collapsed) {
    return (
      <li>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-4 py-3 rounded-lg
                   text-text-secondary hover:text-text-primary
                   hover:bg-glass-light transition-all
                   flex items-center justify-between group"
        >
          <span className="flex items-center gap-3">
            {item.icon}
            <span>{item.label}</span>
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <ul className="mt-2 ml-4 pl-4 border-l border-glass-border space-y-2">
            {item.children.map((child, index) => (
              <li key={index}>
                <a
                  href={child.href}
                  onClick={child.onClick}
                  className="block px-4 py-2 rounded-lg text-sm
                           text-text-secondary hover:text-text-primary
                           hover:bg-glass-light transition-all"
                >
                  <span className="flex items-center gap-3">
                    {child.icon}
                    {child.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li>
      <a
        href={item.href}
        onClick={item.onClick}
        className="block px-4 py-3 rounded-lg
                 text-text-secondary hover:text-text-primary
                 hover:bg-glass-light transition-all
                 flex items-center gap-3 group relative"
      >
        {item.icon}
        {!collapsed && <span>{item.label}</span>}
        {item.badge && !collapsed && (
          <span className="ml-auto px-2 py-0.5 text-xs rounded-full 
                         bg-primary-main/20 text-primary-bright">
            {item.badge}
          </span>
        )}
        
        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-background-tertiary
                        border border-glass-border rounded-lg shadow-xl
                        text-sm text-text-primary whitespace-nowrap
                        opacity-0 group-hover:opacity-100 pointer-events-none
                        transition-opacity">
            {item.label}
          </div>
        )}
      </a>
    </li>
  )
}

// Pagination Component
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  maxVisible?: number
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisible = 5,
  className = ''
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const halfVisible = Math.floor(maxVisible / 2)
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`}>
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary
                   hover:bg-glass-light transition-all disabled:opacity-50
                   disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-text-secondary hover:text-text-primary
                 hover:bg-glass-light transition-all disabled:opacity-50
                 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${page === currentPage
              ? 'bg-primary-main text-white'
              : page === '...'
              ? 'text-text-tertiary cursor-default'
              : 'text-text-secondary hover:text-text-primary hover:bg-glass-light'
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-text-secondary hover:text-text-primary
                 hover:bg-glass-light transition-all disabled:opacity-50
                 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary
                   hover:bg-glass-light transition-all disabled:opacity-50
                   disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  )
}

// Steps/Stepper Component
export interface Step {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
}

export interface StepsProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const Steps: React.FC<StepsProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className = ''
}) => {
  return (
    <div className={`
      flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}
      ${className}
    `}>
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const isClickable = onStepClick && (isCompleted || index === currentStep + 1)

        return (
          <div
            key={step.id}
            className={`
              flex ${orientation === 'vertical' ? 'flex-row' : 'flex-col'}
              ${orientation === 'vertical' ? 'mb-8' : 'flex-1'}
              relative
            `}
          >
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                absolute ${orientation === 'vertical' 
                  ? 'left-5 top-10 bottom-0 w-0.5' 
                  : 'top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5'
                }
                ${isCompleted ? 'bg-primary-main' : 'bg-glass-border'}
              `} />
            )}

            {/* Step */}
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`
                flex ${orientation === 'vertical' ? 'flex-row' : 'flex-col'}
                items-center gap-3 relative z-10
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              {/* Circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-200
                ${isActive
                  ? 'bg-primary-main text-white shadow-lg shadow-primary-main/30'
                  : isCompleted
                  ? 'bg-primary-main/20 text-primary-bright'
                  : 'bg-glass-light text-text-tertiary'
                }
              `}>
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Content */}
              <div className={`
                ${orientation === 'vertical' ? 'text-left' : 'text-center mt-2'}
              `}>
                <h3 className={`
                  font-medium
                  ${isActive ? 'text-text-primary' : 'text-text-secondary'}
                `}>
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-sm text-text-tertiary mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}
