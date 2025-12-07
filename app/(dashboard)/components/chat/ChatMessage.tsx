'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  isStreaming?: boolean
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
  isStreaming = false,
}) => {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm
          ${isUser
            ? 'bg-accent-purple/20 text-accent-purple'
            : 'bg-primary/20 text-primary'
          }
        `}
      >
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Message Content */}
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3
          ${isUser
            ? 'bg-accent-purple/20 border border-accent-purple/30'
            : 'bg-white/[0.05] border border-white/[0.08]'
          }
        `}
      >
        {isUser ? (
          <p className="text-sm text-white whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-sm text-white/90 mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="text-sm text-white/90 list-disc list-inside mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-sm text-white/90 list-decimal list-inside mb-2 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm text-white/90">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">{children}</strong>
                ),
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-accent-purple">{children}</code>
                ),
                h1: ({ children }) => (
                  <h1 className="text-base font-bold text-white mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm font-bold text-white mb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold text-white mb-1">{children}</h3>
                ),
                a: ({ children, href }) => (
                  <a href={href} className="text-accent-purple hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-accent-purple/50 pl-3 italic text-white/70">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        {/* Streaming indicator */}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-accent-purple/70 animate-pulse ml-1" />
        )}

        {/* Timestamp */}
        {timestamp && !isStreaming && (
          <p className="text-[10px] text-white/30 mt-2">
            {new Date(timestamp).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </motion.div>
  )
}
