'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ProgressBar } from '@/components/Progress'

interface DiagnosisHeaderProps {
  currentStep: number
  totalSteps: number
  onClose?: () => void
}

export const DiagnosisHeader: React.FC<DiagnosisHeaderProps> = ({
  currentStep,
  totalSteps,
  onClose
}) => {
  const router = useRouter()
  const progress = (currentStep / totalSteps) * 100

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      router.push('/')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-2xl mx-auto px-4">
        {/* Top Row */}
        <div className="flex items-center justify-between h-16">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="
              p-2 -ml-2 rounded-lg
              text-white/40 hover:text-white
              hover:bg-white/5
              transition-all duration-200
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Step Counter */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-white">
              {currentStep}
            </span>
            <span className="text-white/30">/</span>
            <span className="text-sm text-white/40">
              {totalSteps}
            </span>
          </div>

          {/* Spacer */}
          <div className="w-9" />
        </div>

        {/* Progress Bar */}
        <div className="pb-3 -mt-1">
          <ProgressBar
            value={progress}
            size="small"
            variant="default"
          />
        </div>
      </div>
    </header>
  )
}
