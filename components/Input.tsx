'use client'

import React, { forwardRef } from 'react'
import { theme, commonStyles } from '@/lib/theme'

// Input 컴포넌트의 속성 타입 정의
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    // 전체 너비 스타일
    const widthStyles = fullWidth ? 'w-full' : ''
    
    // 에러 상태 스타일
    const errorStyles = error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : ''
    
    // 아이콘 위치에 따른 패딩 스타일
    const paddingStyles = icon 
      ? iconPosition === 'left' 
        ? 'pl-10' 
        : 'pr-10'
      : ''
    
    // 모든 input 스타일을 조합
    const inputStyles = `
      ${commonStyles.input}
      ${paddingStyles}
      ${errorStyles}
      ${widthStyles}
      ${className}
    `
    
    return (
      <div className={`${widthStyles}`}>
        {label && (
          <label className="block text-xs font-medium uppercase tracking-wider text-white/50 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={inputStyles}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-white/30">
              {icon}
            </div>
          )}
        </div>

        {(hint || error) && (
          <p className={`mt-2 text-xs ${error ? 'text-red-400' : 'text-white/40'}`}>
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea 컴포넌트
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  fullWidth?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = false,
      resize = 'vertical',
      className = '',
      ...props
    },
    ref
  ) => {
    // 전체 너비 스타일
    const widthStyles = fullWidth ? 'w-full' : ''
    
    // 에러 상태 스타일
    const errorStyles = error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : ''
    
    // 모든 textarea 스타일을 조합
    const textareaStyles = `
      ${commonStyles.input}
      ${resizeClasses[resize]}
      ${errorStyles}
      ${widthStyles}
      min-h-[100px]
      ${className}
    `
    
    return (
      <div className={`${widthStyles}`}>
        {label && (
          <label className="block text-xs font-medium uppercase tracking-wider text-white/50 mb-2">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={textareaStyles}
          {...props}
        />

        {(hint || error) && (
          <p className={`mt-2 text-xs ${error ? 'text-red-400' : 'text-white/40'}`}>
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// Select 컴포넌트
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  fullWidth?: boolean
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = false,
      placeholder,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // 전체 너비 스타일
    const widthStyles = fullWidth ? 'w-full' : ''
    
    // 에러 상태 스타일
    const errorStyles = error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : ''
    
    // 모든 select 스타일을 조합
    const selectStyles = `
      ${commonStyles.input}
      ${errorStyles}
      ${widthStyles}
      appearance-none
      bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2714%27%20height%3D%278%27%20viewBox%3D%270%200%2014%208%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M1%201l6%206%206-6%27%20stroke%3D%27%23525259%27%20stroke-width%3D%272%27%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27/%3E%3C/svg%3E')] 
      bg-[length:14px_8px] 
      bg-[right_1rem_center] 
      bg-no-repeat
      pr-10
      ${className}
    `
    
    return (
      <div className={`${widthStyles}`}>
        {label && (
          <label className="block text-xs font-medium uppercase tracking-wider text-white/50 mb-2">
            {label}
          </label>
        )}

        <select
          ref={ref}
          className={selectStyles}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        {(hint || error) && (
          <p className={`mt-2 text-xs ${error ? 'text-red-400' : 'text-white/40'}`}>
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

// Checkbox 컴포넌트
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <label className="flex items-start cursor-pointer group">
        <input
          ref={ref}
          type="checkbox"
          className={`
            mt-0.5 h-4 w-4
            text-primary
            bg-white/[0.05]
            border-white/[0.15]
            rounded
            focus:ring-primary/50
            focus:ring-offset-0
            focus:ring-1
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {label && (
          <span className="ml-2.5 text-sm text-white/70 group-hover:text-white/90 transition-colors">
            {label}
          </span>
        )}
        {error && (
          <p className="ml-2.5 text-xs text-red-400">
            {error}
          </p>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

// Radio 컴포넌트
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      error,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <label className="flex items-start cursor-pointer group">
        <input
          ref={ref}
          type="radio"
          className={`
            mt-0.5 h-4 w-4
            text-primary
            bg-white/[0.05]
            border-white/[0.15]
            focus:ring-primary/50
            focus:ring-offset-0
            focus:ring-1
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {label && (
          <span className="ml-2.5 text-sm text-white/70 group-hover:text-white/90 transition-colors">
            {label}
          </span>
        )}
        {error && (
          <p className="ml-2.5 text-xs text-red-400">
            {error}
          </p>
        )}
      </label>
    )
  }
)

Radio.displayName = 'Radio'
