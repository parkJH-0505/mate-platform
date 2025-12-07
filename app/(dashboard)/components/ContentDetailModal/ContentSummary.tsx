'use client'

import React from 'react'

interface Props {
    summary: string
    outcomes: string[]
}

export function ContentSummary({ summary, outcomes }: Props) {
    return (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-accent-purple/10 to-primary/5 border border-accent-purple/20">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📌</span>
                <h3 className="font-semibold text-accent-purple">3줄 요약</h3>
            </div>

            <p className="text-white/80 leading-relaxed mb-4">
                {summary}
            </p>

            {outcomes && outcomes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.1]">
                    <p className="text-xs font-medium text-white/60 mb-2">이걸 보고 나면</p>
                    <ul className="space-y-1.5">
                        {outcomes.map((outcome, idx) => (
                            <li key={idx} className="text-sm text-white/70 flex items-start gap-2">
                                <span className="text-accent-purple mt-0.5">•</span>
                                <span>{outcome}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
