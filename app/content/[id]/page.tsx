'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Mock 콘텐츠 데이터
const mockContent = {
  id: 'c1',
  title: 'MVP 출시 전 체크리스트 10가지',
  description: 'MVP를 출시하기 전에 반드시 확인해야 할 10가지 핵심 사항들을 알려드립니다. 실제 창업 현장에서 자주 놓치는 부분들을 짚어드려요.',
  creator: {
    name: '김창업',
    title: 'Series A 스타트업 대표',
    avatar: '👨‍💼',
    bio: '3번의 창업 경험, 2번의 엑싯. 현재는 Series A 스타트업 대표로 100명 규모의 팀을 이끌고 있습니다.'
  },
  duration: '12:34',
  type: 'video',
  publishedAt: '2024년 12월 1일',
  views: 1234,
  tags: ['MVP', '출시', '체크리스트', 'IT/소프트웨어'],
  relatedContents: [
    { id: 'c2', title: '첫 100명 유저 확보하는 법', creator: '박그로스', duration: '15:20', thumbnail: '🎬' },
    { id: 'c3', title: 'IT 서비스 론칭 D-day 플레이북', creator: '이스타트', duration: '8:45', thumbnail: '📄' },
    { id: 'c4', title: '유저 인터뷰 질문 템플릿', creator: '최PM', duration: '10:12', thumbnail: '🎬' }
  ],
  keyPoints: [
    '기능보다 핵심 가치에 집중하기',
    '출시 전 내부 테스트 최소 3회',
    '피드백 수집 채널 미리 세팅',
    '첫 1주일 모니터링 계획 수립',
    '출시 후 빠른 이터레이션 준비'
  ]
}

export default function ContentPage() {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('overview')

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-white/40">커리큘럼으로 돌아가기</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'text-accent-purple bg-accent-purple/10' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg text-white/60 hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-6xl mx-auto">
          {/* Video Player Area */}
          <div className="aspect-video bg-[#121212] flex items-center justify-center relative">
            {/* Mock Video Player */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-primary/5" />
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white/40 text-sm">영상 플레이어 (프로토타입)</p>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div className="h-full w-1/3 bg-accent-purple" />
            </div>
          </div>

          {/* Content Info */}
          <div className="px-4 py-8 lg:flex lg:gap-8">
            {/* Main Column */}
            <div className="lg:flex-1">
              {/* Title & Meta */}
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {mockContent.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white/50">
                <span>{mockContent.publishedAt}</span>
                <span>•</span>
                <span>{mockContent.views.toLocaleString()}회 시청</span>
                <span>•</span>
                <span>{mockContent.duration}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {mockContent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Creator Info */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl">
                    {mockContent.creator.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-0.5">{mockContent.creator.name}</h3>
                    <p className="text-sm text-accent-purple mb-2">{mockContent.creator.title}</p>
                    <p className="text-sm text-white/50">{mockContent.creator.bio}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-white/10 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-white border-b-2 border-accent-purple'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  개요
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 text-sm font-medium transition-colors ${
                    activeTab === 'notes'
                      ? 'text-white border-b-2 border-accent-purple'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  노트
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' ? (
                <div>
                  <h4 className="font-semibold text-white mb-3">콘텐츠 소개</h4>
                  <p className="text-white/60 leading-relaxed mb-6">
                    {mockContent.description}
                  </p>

                  <h4 className="font-semibold text-white mb-3">핵심 포인트</h4>
                  <ul className="space-y-2">
                    {mockContent.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-white/60">
                        <span className="w-6 h-6 rounded-full bg-accent-purple/10 flex items-center justify-center text-xs text-accent-purple flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] border-dashed">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-white/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <p className="text-white/40 mb-4">아직 작성한 노트가 없습니다</p>
                      <button className="px-4 py-2 rounded-lg bg-white/5 text-sm text-white/60 hover:bg-white/10 transition-colors">
                        노트 작성하기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 mt-10 lg:mt-0">
              {/* Next in Curriculum */}
              <div className="p-4 rounded-2xl bg-accent-purple/5 border border-accent-purple/20 mb-6">
                <div className="flex items-center gap-2 text-accent-purple text-sm font-medium mb-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  <span>다음 콘텐츠</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                    🎬
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">첫 100명 유저 확보하는 법</p>
                    <p className="text-xs text-white/40">박그로스 · 15:20</p>
                  </div>
                </div>
              </div>

              {/* Related Contents */}
              <h4 className="font-semibold text-white mb-4">관련 콘텐츠</h4>
              <div className="space-y-3">
                {mockContent.relatedContents.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                      {content.thumbnail}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{content.title}</p>
                      <p className="text-xs text-white/40">{content.creator} · {content.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/[0.06] lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-white/40">다음 콘텐츠</p>
            <p className="text-sm text-white truncate">첫 100명 유저 확보하는 법</p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-medium">
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
