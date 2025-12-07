'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentHeader } from './ContentHeader'
import { ContentSummary } from './ContentSummary'
import { ContentViewer } from './ContentViewer'
import { ChecklistSection } from './ChecklistSection'
import { ContentActions } from './ContentActions'

interface Props {
    isOpen: boolean
    onClose: () => void
    contentId: string
}

export interface ContentDetail {
    id: string
    title: string
    content_type: string
    duration_minutes: number
    level: number
    category: string
    summary: string
    learning_outcomes: string[]
    content_body: string
    video_url?: string
    video_chapters?: Array<{
        time: string
        title: string
    }>
    action_items: Array<{
        text: string
        description: string
    }>
    templates?: Array<{
        title: string
        content: string
    }>
    next_content_id?: string
}

export function ContentDetailModal({ isOpen, onClose, contentId }: Props) {
    const [content, setContent] = useState<ContentDetail | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [viewMode, setViewMode] = useState<'text' | 'video'>('text')
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

    useEffect(() => {
        if (isOpen && contentId) {
            fetchContent()
        }
    }, [isOpen, contentId])

    useEffect(() => {
        // ESC 키로 닫기
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    const fetchContent = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/contents/${contentId}`)
            const data = await response.json()

            if (data.success) {
                setContent(data.content)
                // 영상이 있으면 기본을 영상으로
                if (data.content.video_url) {
                    setViewMode('video')
                }
            }
        } catch (error) {
            console.error('Failed to fetch content:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleComplete = async () => {
        try {
            const response = await fetch(`/api/contents/${contentId}/complete`, {
                method: 'POST',
            })

            const data = await response.json()
            if (data.success) {
                // XP 획득 알림
                alert(`✨ +${data.xp}XP 획득!`)
                onClose()
            }
        } catch (error) {
            console.error('Failed to complete content:', error)
        }
    }

    const toggleCheckItem = (index: number) => {
        const newChecked = new Set(checkedItems)
        if (newChecked.has(index)) {
            newChecked.delete(index)
        } else {
            newChecked.add(index)
        }
        setCheckedItems(newChecked)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="
            relative w-full max-w-4xl max-h-[90vh]
            bg-[#0a0a0a] rounded-3xl
            border-2 border-white/[0.15]
            shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]
            overflow-hidden flex flex-col
            backdrop-blur-md
          "
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : content ? (
                        <>
                            {/* Header */}
                            <ContentHeader
                                title={content.title}
                                category={content.category}
                                level={content.level}
                                duration={content.duration_minutes}
                                type={content.content_type}
                                onClose={onClose}
                            />

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-6 space-y-6">
                                    {/* Summary */}
                                    <ContentSummary
                                        summary={content.summary}
                                        outcomes={content.learning_outcomes}
                                    />

                                    {/* Format Toggle */}
                                    {content.video_url && (
                                        <div className="flex gap-2 p-1 bg-white/[0.05] rounded-xl">
                                            <button
                                                onClick={() => setViewMode('text')}
                                                className={`
                          flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all
                          ${viewMode === 'text'
                                                        ? 'bg-white/[0.1] text-white'
                                                        : 'text-white/50 hover:text-white/70'
                                                    }
                        `}
                                            >
                                                📄 텍스트
                                            </button>
                                            <button
                                                onClick={() => setViewMode('video')}
                                                className={`
                          flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all
                          ${viewMode === 'video'
                                                        ? 'bg-white/[0.1] text-white'
                                                        : 'text-white/50 hover:text-white/70'
                                                    }
                        `}
                                            >
                                                🎬 영상
                                            </button>
                                        </div>
                                    )}

                                    {/* Content Viewer */}
                                    <ContentViewer
                                        mode={viewMode}
                                        textContent={content.content_body}
                                        videoUrl={content.video_url}
                                        chapters={content.video_chapters}
                                    />

                                    {/* Checklist */}
                                    {content.action_items && content.action_items.length > 0 && (
                                        <ChecklistSection
                                            items={content.action_items}
                                            checkedItems={checkedItems}
                                            onToggle={toggleCheckItem}
                                        />
                                    )}

                                    {/* Templates */}
                                    {content.templates && content.templates.length > 0 && (
                                        <div className="space-y-4">
                                            {content.templates.map((template, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.1]"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold text-white">
                                                            📝 {template.title}
                                                        </h4>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(template.content)
                                                                alert('템플릿이 복사되었습니다!')
                                                            }}
                                                            className="text-xs text-accent-purple hover:text-accent-purple/80"
                                                        >
                                                            복사
                                                        </button>
                                                    </div>
                                                    <pre className="text-sm text-white/70 whitespace-pre-wrap font-sans">
                                                        {template.content}
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            <ContentActions
                                onClose={onClose}
                                onComplete={handleComplete}
                                nextContentId={content.next_content_id}
                                completedItems={checkedItems.size}
                                totalItems={content.action_items?.length || 0}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-96 text-white/50">
                            콘텐츠를 불러올 수 없습니다
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
