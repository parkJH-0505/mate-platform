'use client'

import React from 'react'
import { motion } from 'framer-motion'

// Sparkline Chart Component
export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  showDots?: boolean
  animate?: boolean
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 40,
  color = '#5EA2FF',
  showDots = false,
  animate = true
}) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return { x, y, value }
  })
  
  const pathData = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    return `${acc} L ${point.x} ${point.y}`
  }, '')

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <motion.path
        d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: animate ? 1 : 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Line */}
      <motion.path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: animate ? 1 : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Dots */}
      {showDots && points.map((point, index) => (
        <motion.circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="3"
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: animate ? 1 : 1 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        />
      ))}
    </svg>
  )
}

// Progress Ring Component
export interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showValue?: boolean
  animate?: boolean
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 6,
  color = '#5EA2FF',
  backgroundColor = 'rgba(255,255,255,0.1)',
  showValue = true,
  animate = true
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: animate ? circumference : offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-text-primary">
            {progress}%
          </span>
        </div>
      )}
    </div>
  )
}

// Bar Chart Component
export interface BarChartProps {
  data: Array<{
    label: string
    value: number
    color?: string
  }>
  height?: number
  animate?: boolean
  showValues?: boolean
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  animate = true,
  showValues = false
}) => {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100
          const color = item.color || '#5EA2FF'
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center justify-end">
              {showValues && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-xs text-text-tertiary mb-1"
                >
                  {item.value}
                </motion.span>
              )}
              
              <motion.div
                className="w-full rounded-t-md relative overflow-hidden"
                style={{ backgroundColor: `${color}20` }}
                initial={{ height: 0 }}
                animate={{ height: animate ? `${barHeight}%` : `${barHeight}%` }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              >
                <div
                  className="absolute inset-0"
                  style={{ 
                    background: `linear-gradient(to top, ${color}40, ${color}80)`
                  }}
                />
              </motion.div>
              
              <span className="text-xs text-text-muted mt-2 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Activity Indicator Component
export interface ActivityIndicatorProps {
  data: Array<{
    date: string
    value: number
  }>
  color?: string
  cellSize?: number
  gap?: number
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  data,
  color = '#5EA2FF',
  cellSize = 12,
  gap = 3
}) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  const getOpacity = (value: number) => {
    if (value === 0) return 0.05
    return 0.2 + (value / maxValue) * 0.8
  }

  // Group data by weeks (7 items per row)
  const weeks: typeof data[] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div className="flex gap-1">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {week.map((day, dayIndex) => (
            <motion.div
              key={dayIndex}
              className="rounded-sm cursor-pointer hover:ring-2 hover:ring-white/20 transition-all"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: color,
                opacity: getOpacity(day.value)
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: (weekIndex * 7 + dayIndex) * 0.01,
                duration: 0.3
              }}
              whileHover={{ scale: 1.2 }}
              title={`${day.date}: ${day.value}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Metric Comparison Component
export interface MetricComparisonProps {
  current: number
  previous: number
  label: string
  format?: 'number' | 'currency' | 'percentage'
  currencySymbol?: string
  invertColors?: boolean
}

export const MetricComparison: React.FC<MetricComparisonProps> = ({
  current,
  previous,
  label,
  format = 'number',
  currencySymbol = '$',
  invertColors = false
}) => {
  const change = ((current - previous) / previous) * 100
  const isPositive = change >= 0
  const displayPositive = invertColors ? !isPositive : isPositive
  
  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return `${currencySymbol}${value.toLocaleString()}`
      case 'percentage':
        return `${value}%`
      default:
        return value.toLocaleString()
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-tertiary">{label}</p>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-text-primary">
          {formatValue(current)}
        </span>
        <div className={`flex items-center gap-1 text-sm ${
          displayPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      <p className="text-xs text-text-muted">
        vs. {formatValue(previous)} previous period
      </p>
    </div>
  )
}

// Live Data Indicator
export interface LiveIndicatorProps {
  isLive?: boolean
  label?: string
  pulseColor?: string
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  isLive = true,
  label = 'Live',
  pulseColor = '#22C55E'
}) => {
  if (!isLive) return null

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: pulseColor }}
        />
        <div 
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: pulseColor }}
        />
      </div>
      <span className="text-xs text-text-tertiary font-medium">{label}</span>
    </div>
  )
}
