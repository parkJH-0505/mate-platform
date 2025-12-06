'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Input Component with advanced features
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  clearable?: boolean
  onClear?: () => void
  variant?: 'default' | 'filled' | 'ghost'
  inputSize?: 'small' | 'medium' | 'large'
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  icon,
  iconPosition = 'left',
  clearable = false,
  onClear,
  variant = 'default',
  inputSize = 'medium',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-5 py-4 text-lg'
  }

  const variantClasses = {
    default: `
      bg-background-secondary border border-glass-border
      hover:border-primary-main/50 
      focus:border-primary-main focus:ring-2 focus:ring-primary-main/20
    `,
    filled: `
      bg-glass-light border-b-2 border-glass-border rounded-t-lg
      hover:bg-glass-medium hover:border-primary-main/50
      focus:border-primary-main focus:bg-glass-medium
    `,
    ghost: `
      bg-transparent border-b border-glass-border
      hover:border-primary-main/50
      focus:border-primary-main
    `
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {icon}
          </div>
        )}
        
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          className={`
            w-full rounded-lg text-text-primary
            placeholder-text-tertiary
            transition-all duration-200
            focus:outline-none
            ${sizeClasses[inputSize]}
            ${variantClasses[variant]}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${clearable && props.value ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500/20' : ''}
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        
        {icon && iconPosition === 'right' && !clearable && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {icon}
          </div>
        )}
        
        {clearable && props.value && (
          <button
            type="button"
            onClick={() => {
              onClear?.()
              props.onChange?.({ target: { value: '' } } as any)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary
                     hover:text-text-secondary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {(helper || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-text-tertiary'}`}>
          {error || helper}
        </p>
      )}
    </div>
  )
}

// TextArea Component
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  showCharCount?: boolean
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helper,
  resize = 'vertical',
  showCharCount = false,
  className = '',
  ...props
}) => {
  const currentLength = String(props.value || '').length
  const maxLength = props.maxLength

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      
      <textarea
        {...props}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-background-secondary border border-glass-border
          text-text-primary placeholder-text-tertiary
          hover:border-primary-main/50
          focus:border-primary-main focus:ring-2 focus:ring-primary-main/20
          focus:outline-none transition-all duration-200
          ${resizeClasses[resize]}
          ${error ? 'border-red-500 focus:ring-red-500/20' : ''}
          ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      
      <div className="flex justify-between items-center mt-1">
        {(helper || error) && (
          <p className={`text-sm ${error ? 'text-red-500' : 'text-text-tertiary'}`}>
            {error || helper}
          </p>
        )}
        
        {showCharCount && maxLength && (
          <span className={`text-sm ${
            currentLength > maxLength * 0.9 ? 'text-red-500' : 'text-text-tertiary'
          }`}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

// Checkbox Component
export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  error?: string
  disabled?: boolean
  indeterminate?: boolean
  size?: 'small' | 'medium' | 'large'
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  error,
  disabled = false,
  indeterminate = false,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        
        <div className={`
          ${sizeClasses[size]}
          rounded border-2 transition-all duration-200
          ${checked || indeterminate
            ? 'bg-primary-main border-primary-main' 
            : 'bg-transparent border-glass-border hover:border-primary-main/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-500' : ''}
        `}>
          <AnimatePresence>
            {(checked || indeterminate) && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-full h-full text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                {indeterminate ? (
                  <path d="M5 12h14" />
                ) : (
                  <path d="M5 13l4 4L19 7" />
                )}
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {label && (
        <div className="flex flex-col">
          <span className="text-text-secondary select-none">{label}</span>
          {error && (
            <span className="text-sm text-red-500 mt-1">{error}</span>
          )}
        </div>
      )}
    </label>
  )
}

// Radio Button Component
export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  label?: string
  error?: string
  direction?: 'horizontal' | 'vertical'
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  error,
  direction = 'vertical'
}) => {
  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-text-secondary mb-3">{label}</p>
      )}
      
      <div className={`
        flex gap-4
        ${direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
      `}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start gap-3 cursor-pointer
              ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="relative mt-0.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => !option.disabled && onChange(option.value)}
                disabled={option.disabled}
                className="sr-only"
              />
              
              <div className={`
                w-5 h-5 rounded-full border-2 transition-all duration-200
                ${value === option.value
                  ? 'border-primary-main' 
                  : 'border-glass-border hover:border-primary-main/50'
                }
              `}>
                <AnimatePresence>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-full h-full rounded-full p-1"
                    >
                      <div className="w-full h-full rounded-full bg-primary-main" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-text-secondary select-none">{option.label}</span>
              {option.description && (
                <span className="text-sm text-text-tertiary mt-0.5">{option.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}

// Slider/Range Component
export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  showTicks?: boolean
  disabled?: boolean
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  showTicks = false,
  disabled = false
}) => {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-text-secondary">{label}</span>
          {showValue && (
            <span className="text-sm font-mono text-primary-bright">{value}</span>
          )}
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            w-full h-2 bg-glass-border rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary-main
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-110
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            background: `linear-gradient(to right, rgb(94, 162, 255) 0%, rgb(94, 162, 255) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`
          }}
        />
        
        {showTicks && (
          <div className="flex justify-between px-2 mt-1">
            <span className="text-xs text-text-tertiary">{min}</span>
            <span className="text-xs text-text-tertiary">{max}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// File Upload Component
export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onUpload: (files: File[]) => void
  label?: string
  error?: string
  disabled?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10,
  onUpload,
  label,
  error,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const validFiles = Array.from(fileList).filter(file => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} exceeds maximum size of ${maxSize}MB`)
        return false
      }
      return true
    })

    setFiles(validFiles)
    onUpload(validFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-text-secondary mb-2">{label}</p>
      )}
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-primary-main bg-primary-main/10' 
            : 'border-glass-border hover:border-primary-main/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          className="sr-only"
        />
        
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-text-tertiary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-text-secondary">
            Drag & drop files here, or click to select
          </p>
          <p className="text-sm text-text-tertiary mt-1">
            Maximum file size: {maxSize}MB
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-glass-light"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-sm text-text-primary">{file.name}</p>
                  <p className="text-xs text-text-tertiary">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFiles(files.filter((_, i) => i !== index))
                }}
                className="text-text-tertiary hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}
