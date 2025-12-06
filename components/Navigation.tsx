'use client'

import React, { useState } from 'react'
import { theme } from '@/lib/theme'
import { Button } from './Button'
import { Link } from './Typography'

// Navigation 컴포넌트의 속성 타입 정의
export interface NavigationProps {
  logo?: React.ReactNode
  links?: NavLink[]
  actions?: React.ReactNode
  sticky?: boolean
  transparent?: boolean
  className?: string
}

export interface NavLink {
  label: string
  href: string
  active?: boolean
  external?: boolean
  onClick?: () => void
}

export const Navigation: React.FC<NavigationProps> = ({
  logo,
  links = [],
  actions,
  sticky = true,
  transparent = false,
  className = ''
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // 기본 네비게이션 스타일 - Premium Digital Style
  const baseStyles = `
    w-full h-[72px]
    ${sticky ? 'fixed top-0 z-50' : 'relative'}
    ${transparent ? 'bg-transparent' : 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.06]'}
    px-2 md:px-8
    transition-all duration-300 ease-out
    ${className}
  `
  
  return (
    <nav className={baseStyles}>
      <div className="h-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo}
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                color="white"
                variant="hover-underline"
                size="sm"
                external={link.external}
                onClick={link.onClick}
                className={`
                  font-medium
                  ${link.active ? 'text-primary' : ''}
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {actions}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-white p-2 rounded-md hover:bg-white/5 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">메뉴 열기</span>
              {mobileMenuOpen ? (
                // X 아이콘
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // 햄버거 아이콘
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/[0.06]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`
                  block px-4 py-3 rounded-md text-sm font-medium tracking-wide
                  ${link.active
                    ? 'text-primary bg-primary/10'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                  }
                  transition-all duration-200
                `}
                onClick={() => {
                  setMobileMenuOpen(false)
                  link.onClick && link.onClick()
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          {actions && (
            <div className="border-t border-white/[0.06] px-4 py-4">
              {actions}
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

// Breadcrumb 컴포넌트
export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
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
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-white/30 text-xs">
              {separator}
            </span>
          )}
          {item.href || item.onClick ? (
            <Link
              href={item.href}
              onClick={item.onClick}
              color={index === items.length - 1 ? 'gray' : 'primary'}
              size="sm"
              variant="hover-underline"
              className={index === items.length - 1 ? 'font-normal text-white/40' : 'text-xs uppercase tracking-wider'}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-xs text-white/40 uppercase tracking-wider">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Tab Navigation 컴포넌트
export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
}

export interface TabsProps {
  items: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'pills'
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onChange,
  variant = 'default',
  className = ''
}) => {
  const baseTabStyles = `
    flex items-center gap-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider
    transition-all duration-200 ease-out
    cursor-pointer
  `

  const variantStyles = {
    default: {
      container: 'border-b border-white/[0.08]',
      tab: `
        ${baseTabStyles}
        border-b-2 -mb-[2px]
        hover:text-white
      `,
      activeTab: 'border-primary text-white',
      inactiveTab: 'border-transparent text-white/40'
    },
    pills: {
      container: 'bg-white/[0.03] backdrop-blur-sm rounded-md p-1 border border-white/[0.06]',
      tab: `
        ${baseTabStyles}
        rounded
      `,
      activeTab: 'bg-white/[0.08] text-white',
      inactiveTab: 'text-white/50 hover:text-white/80'
    }
  }

  const styles = variantStyles[variant]

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="flex space-x-1">
        {items.map((item) => (
          <button
            key={item.id}
            className={`
              ${styles.tab}
              ${activeTab === item.id ? styles.activeTab : styles.inactiveTab}
            `}
            onClick={() => onChange(item.id)}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Sidebar Navigation 컴포넌트
export interface SidebarItem {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  active?: boolean
  children?: SidebarItem[]
  onClick?: () => void
}

export interface SidebarProps {
  items: SidebarItem[]
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }
  
  const renderItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)

    return (
      <div key={item.id}>
        <a
          href={item.href}
          className={`
            flex items-center justify-between
            px-3 py-2 text-sm font-medium rounded-md
            transition-all duration-200 ease-out
            cursor-pointer
            ${depth > 0 ? 'ml-4 text-xs' : ''}
            ${item.active
              ? 'bg-primary/10 text-primary border-l-2 border-primary'
              : 'text-white/60 hover:bg-white/5 hover:text-white'
            }
          `}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault()
              toggleExpanded(item.id)
            }
            item.onClick && item.onClick()
          }}
        >
          <div className="flex items-center gap-2.5">
            {item.icon && <span className="opacity-70">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
          {hasChildren && (
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </a>
        {hasChildren && isExpanded && (
          <div className="mt-0.5 border-l border-white/[0.06] ml-4">
            {item.children!.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map(item => renderItem(item))}
    </nav>
  )
}
