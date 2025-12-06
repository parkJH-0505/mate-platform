'use client'

import React, { useState } from 'react'
import { resetLearningData, clearChatHistory } from '@/app/data/settingsData'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmText: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText,
  onConfirm,
  onCancel,
  danger = false
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="
        relative w-full max-w-sm
        bg-[#1a1a1a] border border-white/[0.1]
        rounded-2xl p-6
        space-y-4
      ">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="
              flex-1 py-3 rounded-xl
              bg-white/[0.05] border border-white/[0.08]
              text-white/70 font-medium
              hover:bg-white/[0.1] transition-colors
            "
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className={`
              flex-1 py-3 rounded-xl font-medium
              transition-colors
              ${danger
                ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                : 'bg-primary text-black hover:bg-primary/90'
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

interface DataManagementProps {
  onDataReset: () => void
}

export const DataManagement: React.FC<DataManagementProps> = ({
  onDataReset
}) => {
  const [showResetModal, setShowResetModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)
  const [chatClearComplete, setChatClearComplete] = useState(false)

  const handleResetLearning = () => {
    resetLearningData()
    setShowResetModal(false)
    setResetComplete(true)
    onDataReset()
    setTimeout(() => setResetComplete(false), 2000)
  }

  const handleClearChat = () => {
    clearChatHistory()
    setShowChatModal(false)
    setChatClearComplete(true)
    setTimeout(() => setChatClearComplete(false), 2000)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/60 px-1">데이터 관리</h3>

      <div className="
        rounded-2xl
        bg-white/[0.03] border border-white/[0.06]
        divide-y divide-white/[0.06]
      ">
        {/* 학습 기록 초기화 */}
        <button
          onClick={() => setShowResetModal(true)}
          className="
            w-full px-4 py-4 text-left
            flex items-center justify-between
            hover:bg-white/[0.02] transition-colors
          "
        >
          <div>
            <p className="text-sm font-medium text-white">학습 기록 초기화</p>
            <p className="text-xs text-white/40 mt-0.5">
              모든 진행 상황과 활동 기록을 삭제합니다
            </p>
          </div>
          {resetComplete ? (
            <span className="text-green-400 text-sm">완료!</span>
          ) : (
            <span className="text-white/30">→</span>
          )}
        </button>

        {/* AI 채팅 기록 삭제 */}
        <button
          onClick={() => setShowChatModal(true)}
          className="
            w-full px-4 py-4 text-left
            flex items-center justify-between
            hover:bg-white/[0.02] transition-colors
          "
        >
          <div>
            <p className="text-sm font-medium text-white">AI 채팅 기록 삭제</p>
            <p className="text-xs text-white/40 mt-0.5">
              모든 AI 대화 기록을 삭제합니다
            </p>
          </div>
          {chatClearComplete ? (
            <span className="text-green-400 text-sm">완료!</span>
          ) : (
            <span className="text-white/30">→</span>
          )}
        </button>
      </div>

      {/* 학습 기록 초기화 확인 모달 */}
      <ConfirmModal
        isOpen={showResetModal}
        title="학습 기록을 초기화할까요?"
        description="모든 문제 진행 상황, 체크리스트 완료 기록, 활동 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        confirmText="초기화"
        onConfirm={handleResetLearning}
        onCancel={() => setShowResetModal(false)}
        danger
      />

      {/* 채팅 기록 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showChatModal}
        title="채팅 기록을 삭제할까요?"
        description="모든 AI 대화 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        onConfirm={handleClearChat}
        onCancel={() => setShowChatModal(false)}
        danger
      />
    </div>
  )
}
