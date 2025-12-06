'use client'

import React from 'react'
import { StepContent } from '@/app/data/problemsData'
import { ContentTabType } from './ContentTabs'

interface ContentAreaProps {
  activeTab: ContentTabType
  content: StepContent
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  activeTab,
  content
}) => {
  // "왜?" 탭 - 동기부여
  const renderWhyContent = () => (
    <div className="space-y-6">
      <div className="prose prose-invert prose-sm max-w-none">
        <div className="whitespace-pre-wrap text-white/80 leading-relaxed">
          {content.why}
        </div>
      </div>
    </div>
  )

  // "어떻게?" 탭 - 핵심 개념 + 실수
  const renderHowContent = () => (
    <div className="space-y-6">
      {/* 핵심 개념 */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-primary">💡</span> 핵심 개념
        </h3>
        <div className="
          p-4 rounded-xl
          bg-white/[0.03] border border-white/[0.06]
        ">
          <div className="whitespace-pre-wrap text-white/80 text-sm leading-relaxed">
            {content.concept}
          </div>
        </div>
      </div>

      {/* 피해야 할 실수 */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-red-400">⚠️</span> 피해야 할 실수
        </h3>
        <div className="space-y-2">
          {content.mistakes.map((mistake, index) => (
            <div
              key={index}
              className="
                flex items-start gap-3 p-3 rounded-xl
                bg-red-500/5 border border-red-500/10
              "
            >
              <span className="text-red-400 text-sm mt-0.5">✕</span>
              <span className="text-white/70 text-sm">{mistake}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 추가 팁 */}
      {content.tips && content.tips.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-green-400">✓</span> 추가 팁
          </h3>
          <div className="space-y-2">
            {content.tips.map((tip, index) => (
              <div
                key={index}
                className="
                  flex items-start gap-3 p-3 rounded-xl
                  bg-green-500/5 border border-green-500/10
                "
              >
                <span className="text-green-400 text-sm mt-0.5">→</span>
                <span className="text-white/70 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // "사례" 탭 - 실제 예시들
  const renderExamplesContent = () => (
    <div className="space-y-4">
      {content.examples.map((example, index) => (
        <div
          key={index}
          className="
            p-4 rounded-xl
            bg-white/[0.03] border border-white/[0.06]
          "
        >
          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
            <span className="
              w-6 h-6 rounded-lg bg-primary/20
              flex items-center justify-center text-xs font-bold text-primary
            ">
              {index + 1}
            </span>
            {example.title}
          </h4>
          <p className="text-white/60 text-sm mb-3 pl-8">
            {example.description}
          </p>
          {example.result && (
            <div className="flex items-start gap-2 pl-8">
              <span className="text-primary text-sm">→</span>
              <span className="text-primary/80 text-sm">{example.result}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  // 탭별 렌더링
  switch (activeTab) {
    case 'why':
      return renderWhyContent()
    case 'how':
      return renderHowContent()
    case 'examples':
      return renderExamplesContent()
    case 'checklist':
      // 체크리스트는 별도 컴포넌트에서 처리
      return null
    default:
      return null
  }
}
