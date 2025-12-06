'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

// Modal Component
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  footer?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    fullscreen: 'max-w-full h-full m-0'
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeOnOverlayClick ? onClose : undefined}
              className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`
                relative bg-background-secondary border border-glass-border
                rounded-2xl shadow-2xl
                ${sizeClasses[size]}
                ${size === 'fullscreen' ? '' : 'w-full'}
              `}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-glass-border">
                  {title && (
                    <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              {/* Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {children}
              </div>
              
              {/* Footer */}
              {footer && (
                <div className="p-6 border-t border-glass-border">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!isMounted) return null
  return createPortal(modalContent, document.body)
}

// Alert/Notification Component
export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  action,
  icon
}) => {
  const typeStyles = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const styles = typeStyles[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        p-4 rounded-lg border
        ${styles.bg} ${styles.border}
      `}
    >
      <div className="flex gap-3">
        <div className={`flex-shrink-0 ${styles.text}`}>
          {icon || styles.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h3 className="font-medium text-text-primary mb-1">{title}</h3>
          )}
          <p className="text-text-secondary text-sm">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-2 text-sm font-medium ${styles.text} hover:underline`}
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Toast Notification System
export interface ToastProps {
  id: string
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
}

let toastContainer: HTMLDivElement | null = null

export const toast = {
  show: (props: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toastProps = { ...props, id }
    
    if (!toastContainer) {
      toastContainer = document.createElement('div')
      toastContainer.id = 'toast-container'
      document.body.appendChild(toastContainer)
    }
    
    const event = new CustomEvent('show-toast', { detail: toastProps })
    window.dispatchEvent(event)
    
    return id
  },
  
  dismiss: (id: string) => {
    const event = new CustomEvent('dismiss-toast', { detail: id })
    window.dispatchEvent(event)
  }
}

export const ToastContainer: React.FC<{ position?: string }> = ({ 
  position = 'top-right' 
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])
  
  useEffect(() => {
    const handleShowToast = (e: CustomEvent<ToastProps>) => {
      setToasts(prev => [...prev, e.detail])
      
      if (e.detail.duration !== 0) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== e.detail.id))
        }, e.detail.duration || 5000)
      }
    }
    
    const handleDismissToast = (e: CustomEvent<string>) => {
      setToasts(prev => prev.filter(t => t.id !== e.detail))
    }
    
    window.addEventListener('show-toast' as any, handleShowToast)
    window.addEventListener('dismiss-toast' as any, handleDismissToast)
    
    return () => {
      window.removeEventListener('show-toast' as any, handleShowToast)
      window.removeEventListener('dismiss-toast' as any, handleDismissToast)
    }
  }, [])
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }
  
  return (
    <div className={`fixed z-50 ${positionClasses[position as keyof typeof positionClasses]}`}>
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="mb-3"
          >
            <Alert
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Accordion Component
export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id])
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)
        
        return (
          <motion.div
            key={item.id}
            initial={false}
            className="bg-background-secondary border border-glass-border rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-4 flex items-center justify-between
                       text-left hover:bg-glass-light transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="text-text-tertiary">{item.icon}</span>
                )}
                <span className="font-medium text-text-primary">{item.title}</span>
              </div>
              <motion.svg
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5 text-text-tertiary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-glass-border"
                >
                  <div className="p-6 text-text-secondary">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

// Popover Component
export interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current && 
        popoverRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      updatePosition()
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const updatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const popoverRect = popoverRef.current.getBoundingClientRect()

    let x = 0
    let y = 0

    switch (placement) {
      case 'top':
        x = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
        y = triggerRect.top - popoverRect.height - 8
        break
      case 'bottom':
        x = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
        y = triggerRect.bottom + 8
        break
      case 'left':
        x = triggerRect.left - popoverRect.width - 8
        y = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
        break
      case 'right':
        x = triggerRect.right + 8
        y = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
        break
    }

    setPosition({ x, y })
  }

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-block"
      >
        {trigger}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 50
            }}
            className={`
              bg-background-secondary border border-glass-border
              rounded-xl shadow-2xl backdrop-blur-xl
              p-4 ${className}
            `}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Drawer/Sidebar Component
export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'left' | 'right'
  size?: 'small' | 'medium' | 'large'
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'w-80',
    medium: 'w-96',
    large: 'w-[480px]'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: position === 'left' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: position === 'left' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`
              fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'}
              h-full ${sizeClasses[size]}
              bg-background-secondary border-${position === 'left' ? 'r' : 'l'} border-glass-border
              shadow-2xl z-50
              flex flex-col
            `}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-glass-border">
                <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Progress Steps Component
export interface Step {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

export interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
  onChange?: (step: number) => void
  variant?: 'linear' | 'circular'
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  onChange,
  variant = 'linear'
}) => {
  if (variant === 'circular') {
    return (
      <div className="flex justify-center items-center gap-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          
          return (
            <div
              key={step.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onChange?.(index)}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                border-2 transition-all duration-200
                ${isActive 
                  ? 'border-primary-main bg-primary-main text-white' 
                  : isCompleted
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-glass-border text-text-tertiary'
                }
              `}>
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.icon || (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span className={`
                mt-2 text-sm font-medium
                ${isActive ? 'text-primary-bright' : 'text-text-secondary'}
              `}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isLast = index === steps.length - 1
          
          return (
            <React.Fragment key={step.id}>
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => onChange?.(index)}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  border-2 transition-all duration-200
                  ${isActive 
                    ? 'border-primary-main bg-primary-main text-white' 
                    : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-glass-border text-text-tertiary'
                  }
                `}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-primary-bright' : 'text-text-secondary'
                  }`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              
              {!isLast && (
                <div className={`
                  flex-1 h-0.5 mx-4
                  ${isCompleted ? 'bg-green-500' : 'bg-glass-border'}
                `} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// Empty State Component
export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="text-text-tertiary mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-text-primary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-text-secondary text-center max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-primary-main text-white rounded-lg
                   hover:bg-primary-bright transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
