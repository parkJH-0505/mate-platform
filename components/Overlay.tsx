'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from './Button'

// Dropdown 컴포넌트의 속성 타입 정의
export interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  position?: 'bottom' | 'top'
  closeOnClick?: boolean
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'left',
  position = 'bottom',
  closeOnClick = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const alignClass = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0'
  }[align]
  
  const positionClass = {
    bottom: 'top-full mt-2',
    top: 'bottom-full mb-2'
  }[position]
  
  const handleItemClick = () => {
    if (closeOnClick) {
      setIsOpen(false)
    }
  }
  
  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={`
            absolute
            ${positionClass}
            ${alignClass}
            z-50
            min-w-[200px]
            bg-neutral-white
            rounded-lg
            shadow-lg
            border border-neutral-border
            py-2
            animate-[fadeIn_0.2s_ease-out]
            ${className}
          `}
          onClick={handleItemClick}
        >
          {children}
        </div>
      )}
    </div>
  )
}

// DropdownItem 컴포넌트
export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  disabled?: boolean
  danger?: boolean
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  icon,
  disabled = false,
  danger = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        px-4 py-2
        text-sm
        cursor-pointer
        transition-colors
        flex items-center gap-3
        ${disabled 
          ? 'text-neutral-lighter cursor-not-allowed' 
          : danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-neutral-dark hover:bg-neutral-light'
        }
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  )
}

// DropdownDivider 컴포넌트
export const DropdownDivider: React.FC = () => {
  return <hr className="my-2 border-neutral-border" />
}

// Tooltip 컴포넌트
export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const timeoutRef = useRef<NodeJS.Timeout>()
  const triggerRef = useRef<HTMLDivElement>(null)
  
  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      updatePosition()
    }, delay)
  }
  
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }
  
  const updatePosition = () => {
    if (!triggerRef.current) return
    
    const rect = triggerRef.current.getBoundingClientRect()
    const tooltipOffset = 8
    
    const positions = {
      top: {
        top: rect.top - tooltipOffset,
        left: rect.left + rect.width / 2
      },
      bottom: {
        top: rect.bottom + tooltipOffset,
        left: rect.left + rect.width / 2
      },
      left: {
        top: rect.top + rect.height / 2,
        left: rect.left - tooltipOffset
      },
      right: {
        top: rect.top + rect.height / 2,
        left: rect.right + tooltipOffset
      }
    }
    
    setCoords(positions[position])
  }
  
  const positionClasses = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2'
  }
  
  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`
            fixed
            z-50
            px-3 py-2
            text-sm
            text-neutral-white
            bg-neutral-dark-gray
            rounded-md
            shadow-lg
            pointer-events-none
            animate-[fadeIn_0.2s_ease-out]
            ${positionClasses[position]}
            ${className}
          `}
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`
          }}
        >
          {content}
          <div
            className={`
              absolute
              w-2 h-2
              bg-neutral-dark-gray
              rotate-45
              ${position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2'}
              ${position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2'}
              ${position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2'}
              ${position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'}
            `}
          />
        </div>
      )}
    </>
  )
}

// Popover 컴포넌트
export interface PopoverProps {
  trigger: React.ReactNode
  title?: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  width?: string | number
  showArrow?: boolean
  className?: string
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  title,
  children,
  position = 'bottom',
  width = 300,
  showArrow = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const positionClasses = {
    top: 'bottom-full mb-3 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-3 left-1/2 -translate-x-1/2',
    left: 'right-full mr-3 top-1/2 -translate-y-1/2',
    right: 'left-full ml-3 top-1/2 -translate-y-1/2'
  }
  
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
  }
  
  return (
    <div ref={popoverRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={`
            absolute
            ${positionClasses[position]}
            z-50
            bg-neutral-white
            rounded-lg
            shadow-xl
            border border-neutral-border
            animate-[scaleIn_0.2s_ease-out]
            ${className}
          `}
          style={{ width: typeof width === 'number' ? `${width}px` : width }}
        >
          {title && (
            <div className="px-4 py-3 border-b border-neutral-border">
              <h4 className="text-sm font-semibold text-neutral-dark">{title}</h4>
            </div>
          )}
          <div className="p-4">
            {children}
          </div>
          {showArrow && (
            <div
              className={`
                absolute
                w-3 h-3
                bg-neutral-white
                border border-neutral-border
                rotate-45
                ${arrowClasses[position]}
                ${position === 'top' || position === 'bottom' ? 'border-t-0 border-l-0' : ''}
                ${position === 'left' ? 'border-t-0 border-r-0' : ''}
                ${position === 'right' ? 'border-b-0 border-l-0' : ''}
              `}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ContextMenu 컴포넌트
export interface ContextMenuProps {
  children: React.ReactNode
  menu: React.ReactNode
  className?: string
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  menu,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }
  
  return (
    <>
      <div onContextMenu={handleContextMenu}>
        {children}
      </div>
      
      {isOpen && (
        <div
          ref={menuRef}
          className={`
            fixed
            z-50
            min-w-[200px]
            bg-neutral-white
            rounded-lg
            shadow-lg
            border border-neutral-border
            py-2
            animate-[fadeIn_0.2s_ease-out]
            ${className}
          `}
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`
          }}
          onClick={() => setIsOpen(false)}
        >
          {menu}
        </div>
      )}
    </>
  )
}
