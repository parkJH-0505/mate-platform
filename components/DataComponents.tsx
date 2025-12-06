'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'

// Data Visualization Card - 대시보드 느낌의 카드
export interface DataCardProps {
  title: string
  value: string | number
  change?: number
  chart?: React.ReactNode
  color?: 'green' | 'blue' | 'purple' | 'yellow' | 'red'
  icon?: React.ReactNode
  floating?: boolean
}

const colorMap = {
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]'
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_30px_rgba(147,51,234,0.3)]'
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_30px_rgba(250,204,21,0.3)]'
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]'
  }
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  change,
  chart,
  color = 'blue',
  icon,
  floating = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true })
  const colorScheme = colorMap[color]
  
  const floatingAnimation = floating ? {
    y: [0, -10, 0],
    transition: {
      y: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  } : {}

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0, ...floatingAnimation } : {}}
      transition={{ duration: 0.6 }}
      className={`
        relative p-6 rounded-2xl
        ${colorScheme.bg} ${colorScheme.border} border
        backdrop-blur-md
        hover:${colorScheme.glow} 
        transition-all duration-500
        group
      `}
    >
      {/* 배경 그라데이션 효과 */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        bg-gradient-to-br from-${color}-500/5 to-transparent
        transition-opacity duration-500
      `} />
      
      <div className="relative z-10">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-text-tertiary text-sm mb-1">{title}</p>
            <p className={`text-3xl font-bold ${colorScheme.text}`}>{value}</p>
          </div>
          {icon && (
            <div className={`${colorScheme.text} opacity-50`}>
              {icon}
            </div>
          )}
        </div>
        
        {/* 변화율 */}
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
        
        {/* 차트 영역 */}
        {chart && (
          <div className="mt-4 h-20">
            {chart}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Dashboard Grid - 대시보드 그리드 레이아웃
export interface DashboardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 'auto'
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  columns = 'auto'
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    'auto': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {children}
    </div>
  )
}

// Terminal/Code Display Component
export interface CodeDisplayProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  animate?: boolean
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  language = 'javascript',
  title,
  showLineNumbers = true,
  highlightLines = [],
  animate = false
}) => {
  const [displayedCode, setDisplayedCode] = useState(animate ? '' : code)
  const codeRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(codeRef, { once: true })

  useEffect(() => {
    if (animate && isInView) {
      let index = 0
      const interval = setInterval(() => {
        setDisplayedCode(code.slice(0, index))
        index += 10
        if (index > code.length) {
          clearInterval(interval)
          setDisplayedCode(code)
        }
      }, 10)
      return () => clearInterval(interval)
    }
  }, [animate, code, isInView])

  const lines = displayedCode.split('\n')

  return (
    <motion.div
      ref={codeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="relative rounded-xl overflow-hidden bg-background-secondary border border-glass-border"
    >
      {/* 터미널 헤더 */}
      {title && (
        <div className="flex items-center justify-between px-4 py-3 bg-background-tertiary border-b border-glass-border">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-text-tertiary text-sm ml-2">{title}</span>
          </div>
          <span className="text-text-muted text-xs">{language}</span>
        </div>
      )}

      {/* 코드 영역 */}
      <div className="p-4 overflow-x-auto code-scrollbar">
        <pre className="text-sm">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`
                flex
                ${highlightLines.includes(index + 1) ? 'bg-accent-blue/10 -mx-4 px-4' : ''}
              `}
            >
              {showLineNumbers && (
                <span className="text-text-muted select-none mr-4 min-w-[2rem] text-right">
                  {index + 1}
                </span>
              )}
              <code className="text-text-secondary">{line || ' '}</code>
            </div>
          ))}
        </pre>
      </div>
    </motion.div>
  )
}

// Interactive Feature Card with 3D Effect
export interface Feature3DCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color?: 'green' | 'blue' | 'purple' | 'yellow' | 'red'
  delay?: number
}

export const Feature3DCard: React.FC<Feature3DCardProps> = ({
  icon,
  title,
  description,
  color = 'blue',
  delay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const isInView = useInView(cardRef, { once: true })
  const colorScheme = colorMap[color]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateXValue = ((e.clientY - centerY) / rect.height) * -10
    const rotateYValue = ((e.clientX - centerX) / rect.width) * 10
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }}
      className="relative group preserve-3d transition-transform duration-300 ease-out"
    >
      <div className={`
        relative p-8 rounded-2xl
        bg-background-secondary/80 backdrop-blur-xl
        border ${colorScheme.border}
        ${colorScheme.glow}
        transition-all duration-500
        group-hover:border-opacity-50
      `}>
        {/* 아이콘 */}
        <div className={`
          w-16 h-16 rounded-xl mb-6
          ${colorScheme.bg} ${colorScheme.text}
          flex items-center justify-center
          text-2xl
          group-hover:scale-110 transition-transform duration-300
        `}>
          {icon}
        </div>
        
        {/* 컨텐츠 */}
        <h3 className="text-2xl font-semibold text-text-primary mb-3">
          {title}
        </h3>
        <p className="text-text-secondary leading-relaxed">
          {description}
        </p>
        
        {/* Hover 효과 */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          bg-gradient-to-br from-${color}-500/10 to-transparent
          transition-opacity duration-500
          pointer-events-none
        `} />
      </div>
    </motion.div>
  )
}

// Animated Counter Component
export interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  decimals?: number
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 2,
  delay = 0,
  decimals = 0
}) => {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(countRef, { once: true })

  useEffect(() => {
    if (!isInView) return
    
    const startTime = Date.now()
    const endValue = value
    const durationMs = duration * 1000
    
    const updateCount = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(endValue * easeOutQuart * Math.pow(10, decimals)) / Math.pow(10, decimals)
      
      setCount(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }
    
    setTimeout(() => {
      updateCount()
    }, delay * 1000)
  }, [value, duration, delay, decimals, isInView])

  return (
    <span ref={countRef} className="font-mono">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  )
}

// Parallax Section Wrapper
export interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y: smoothY }}>
        {children}
      </motion.div>
    </div>
  )
}

// Data Table Component
export interface DataTableProps {
  columns: Array<{
    key: string
    label: string
    align?: 'left' | 'center' | 'right'
    colored?: boolean
  }>
  data: Array<Record<string, any>>
  highlightRow?: number
  animate?: boolean
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  highlightRow,
  animate = true
}) => {
  const tableRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(tableRef, { once: true })

  return (
    <motion.div
      ref={tableRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className="relative rounded-xl overflow-hidden bg-background-secondary/50 backdrop-blur-sm border border-glass-border"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-text-tertiary font-medium text-sm text-${col.align || 'left'}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={animate ? { opacity: 0, x: -20 } : {}}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: rowIndex * 0.05 }}
                className={`
                  border-b border-glass-border/50
                  hover:bg-glass-light transition-colors
                  ${highlightRow === rowIndex ? 'bg-accent-blue/10' : ''}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 text-sm text-${col.align || 'left'}`}
                  >
                    <span className={col.colored ? 'text-accent-blue' : 'text-text-secondary'}>
                      {row[col.key]}
                    </span>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
