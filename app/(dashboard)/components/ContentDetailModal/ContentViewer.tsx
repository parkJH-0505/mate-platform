'use client'

import React from 'react'

interface Props {
    mode: 'text' | 'video'
    textContent?: string
    videoUrl?: string
    chapters?: Array<{
        time: string
        title: string
    }>
}

export function ContentViewer({ mode, textContent, videoUrl, chapters }: Props) {
    if (mode === 'video' && videoUrl) {
        return (
            <div className="space-y-4">
                {/* Video Player */}
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                    {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                        <iframe
                            src={videoUrl.replace('watch?v=', 'embed/')}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                            <div className="text-center">
                                <span className="text-5xl mb-3 block">🎬</span>
                                <p className="text-sm text-white/50">영상 플레이어</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chapters */}
                {chapters && chapters.length > 0 && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                        <h4 className="text-sm font-semibold text-white mb-3">챕터</h4>
                        <div className="space-y-2">
                            {chapters.map((chapter, idx) => (
                                <button
                                    key={idx}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left"
                                >
                                    <span className="text-xs font-medium text-accent-purple min-w-[40px]">
                                        {chapter.time}
                                    </span>
                                    <span className="text-sm text-white/80">
                                        {chapter.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Text mode
    return (
        <article
            className="prose prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-white
        prose-h2:text-xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-accent-purple
        prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-6
        prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-4
        prose-ul:my-4 prose-li:text-white/70 prose-li:mb-2
        prose-strong:text-white prose-strong:font-semibold
        prose-code:text-accent-purple prose-code:bg-white/[0.05] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      "
            dangerouslySetInnerHTML={{ __html: textContent || '' }}
        />
    )
}
