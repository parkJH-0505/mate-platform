'use client'

import React, { useState } from 'react'
import { UserProfile, AVATAR_OPTIONS, updateProfile } from '@/app/data/settingsData'

interface ProfileSectionProps {
  profile: UserProfile
  onUpdate: (profile: UserProfile) => void
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onUpdate
}) => {
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nickname, setNickname] = useState(profile.nickname)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      const updated = updateProfile({ nickname: nickname.trim() })
      onUpdate(updated.profile)
    }
    setIsEditingNickname(false)
  }

  const handleAvatarSelect = (emoji: string) => {
    const updated = updateProfile({ avatarEmoji: emoji })
    onUpdate(updated.profile)
    setShowAvatarPicker(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/60 px-1">프로필</h3>

      <div className="
        p-4 rounded-2xl
        bg-white/[0.03] border border-white/[0.06]
      ">
        <div className="flex items-center gap-4">
          {/* 아바타 */}
          <button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="
              relative w-16 h-16 rounded-2xl
              bg-gradient-to-br from-primary/20 to-yellow-500/10
              border border-primary/30
              flex items-center justify-center
              text-3xl
              hover:scale-105 transition-transform
              group
            "
          >
            {profile.avatarEmoji}
            <div className="
              absolute -bottom-1 -right-1
              w-6 h-6 rounded-full
              bg-white/10 border border-white/20
              flex items-center justify-center
              text-xs
              opacity-0 group-hover:opacity-100
              transition-opacity
            ">
              ✏️
            </div>
          </button>

          {/* 닉네임 */}
          <div className="flex-1">
            {isEditingNickname ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNicknameSubmit()}
                  className="
                    flex-1 px-3 py-2 rounded-lg
                    bg-white/[0.05] border border-white/[0.1]
                    text-white text-lg font-semibold
                    focus:outline-none focus:border-primary/50
                  "
                  autoFocus
                  maxLength={20}
                />
                <button
                  onClick={handleNicknameSubmit}
                  className="
                    px-3 py-2 rounded-lg
                    bg-primary text-black text-sm font-medium
                    hover:bg-primary/90 transition-colors
                  "
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setNickname(profile.nickname)
                    setIsEditingNickname(false)
                  }}
                  className="
                    px-3 py-2 rounded-lg
                    bg-white/[0.05] text-white/60 text-sm
                    hover:bg-white/[0.1] transition-colors
                  "
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingNickname(true)}
                className="text-left group"
              >
                <p className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                  {profile.nickname}
                </p>
                <p className="text-xs text-white/40">
                  탭하여 닉네임 수정
                </p>
              </button>
            )}
          </div>
        </div>

        {/* 아바타 선택기 */}
        {showAvatarPicker && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-white/40 mb-3">아바타 선택</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAvatarSelect(emoji)}
                  className={`
                    w-full aspect-square rounded-xl
                    flex items-center justify-center text-2xl
                    transition-all
                    ${profile.avatarEmoji === emoji
                      ? 'bg-primary/20 border-2 border-primary scale-110'
                      : 'bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1]'
                    }
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
