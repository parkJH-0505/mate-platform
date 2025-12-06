'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearAllData } from '@/app/data/settingsData'

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

export const AccountSection: React.FC = () => {
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleLogout = () => {
    // 로그아웃 처리 (현재는 목업 - 메인 페이지로 이동)
    setShowLogoutModal(false)
    router.push('/')
  }

  const handleDeleteAccount = () => {
    // 계정 삭제 처리 (현재는 목업 - 모든 데이터 삭제 후 메인 페이지로 이동)
    clearAllData()
    setShowDeleteModal(false)
    router.push('/')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/60 px-1">계정</h3>

      <div className="
        rounded-2xl
        bg-white/[0.03] border border-white/[0.06]
        divide-y divide-white/[0.06]
      ">
        {/* 로그아웃 */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="
            w-full px-4 py-4 text-left
            flex items-center justify-between
            hover:bg-white/[0.02] transition-colors
          "
        >
          <span className="text-sm font-medium text-white">로그아웃</span>
          <span className="text-white/30">→</span>
        </button>

        {/* 계정 탈퇴 */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="
            w-full px-4 py-4 text-left
            flex items-center justify-between
            hover:bg-white/[0.02] transition-colors
          "
        >
          <span className="text-sm font-medium text-red-400">계정 탈퇴</span>
          <span className="text-red-400/50">→</span>
        </button>
      </div>

      <p className="text-xs text-white/30 px-1">
        * 계정 기능은 현재 목업 상태입니다
      </p>

      {/* 로그아웃 확인 모달 */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="로그아웃 하시겠어요?"
        description="로그아웃해도 학습 기록은 유지됩니다."
        confirmText="로그아웃"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      {/* 계정 탈퇴 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="정말 탈퇴하시겠어요?"
        description="탈퇴하면 모든 학습 기록, 채팅 기록, 설정이 삭제되며 복구할 수 없습니다."
        confirmText="탈퇴하기"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        danger
      />
    </div>
  )
}
