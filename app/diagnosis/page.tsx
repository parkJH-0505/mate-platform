'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DiagnosisHeader, ChatArea, ChoiceArea, type ChatMessage, type Choice } from './components'
import { getDiagnosisFlow, getQuestion, type DiagnosisFlow, type DiagnosisChoice } from './data/diagnosisFlow'
import { Dialog } from '@/components/Modal'

function DiagnosisContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [flow, setFlow] = useState<DiagnosisFlow | null>(null)
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('q1')
  const [currentStep, setCurrentStep] = useState(1)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [answers, setAnswers] = useState<Array<{ questionId: string; answer: DiagnosisChoice }>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  // Get category from URL
  const category = searchParams.get('category')
  const query = searchParams.get('q')

  // Initialize diagnosis flow
  useEffect(() => {
    const diagnosisFlow = getDiagnosisFlow(category || undefined)
    setFlow(diagnosisFlow)

    // Add intro message
    const introMessage: ChatMessage = {
      id: 'intro',
      type: 'ai',
      message: diagnosisFlow.introMessage,
      timestamp: new Date()
    }

    // If user typed a custom query, add it as user message first
    if (query) {
      const userQueryMessage: ChatMessage = {
        id: 'user-query',
        type: 'user',
        message: query,
        timestamp: new Date()
      }
      setMessages([userQueryMessage, introMessage])
    } else {
      setMessages([introMessage])
    }

    // Show first question after intro
    setTimeout(() => {
      const firstQuestion = getQuestion(diagnosisFlow, 'q1')
      if (firstQuestion) {
        addAIMessage(firstQuestion.message)
      }
    }, 1000)
  }, [category, query])

  // Add AI message with typing effect
  const addAIMessage = useCallback((message: string) => {
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        type: 'ai',
        message,
        timestamp: new Date()
      }])
    }, 800)
  }, [])

  // Handle choice selection
  const handleSelect = useCallback((choice: Choice) => {
    if (!flow) return

    // Add user message
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: 'user',
      message: choice.label,
      timestamp: new Date()
    }])

    // Save answer
    const currentQuestion = getQuestion(flow, currentQuestionId)
    if (currentQuestion) {
      const selectedChoice = currentQuestion.choices.find(c => c.id === choice.id)
      if (selectedChoice) {
        setAnswers(prev => [...prev, { questionId: currentQuestionId, answer: selectedChoice }])

        // Check if going to result
        if (selectedChoice.nextQuestionId === 'result') {
          // Navigate to result page
          setTimeout(() => {
            const answersData = [...answers, { questionId: currentQuestionId, answer: selectedChoice }]
            localStorage.setItem('diagnosisAnswers', JSON.stringify(answersData))
            localStorage.setItem('diagnosisCategory', flow.categoryId)
            router.push('/diagnosis/result')
          }, 500)
          return
        }

        // Check if redirecting to another category
        if (selectedChoice.nextQuestionId === 'redirect') {
          router.push(`/diagnosis?category=${selectedChoice.value}`)
          return
        }

        // Move to next question
        const nextQuestion = getQuestion(flow, selectedChoice.nextQuestionId)
        if (nextQuestion) {
          setCurrentQuestionId(selectedChoice.nextQuestionId)
          setCurrentStep(prev => prev + 1)
          setTimeout(() => {
            addAIMessage(nextQuestion.message)
          }, 300)
        }
      }
    }
  }, [flow, currentQuestionId, answers, router, addAIMessage])

  // Handle back
  const handleBack = useCallback(() => {
    if (answers.length === 0) return

    // Remove last answer
    const newAnswers = [...answers]
    newAnswers.pop()
    setAnswers(newAnswers)

    // Remove last two messages (user answer + AI question)
    setMessages(prev => prev.slice(0, -2))

    // Go back to previous question
    if (newAnswers.length > 0) {
      const lastAnswer = newAnswers[newAnswers.length - 1]
      setCurrentQuestionId(lastAnswer.answer.nextQuestionId)
    } else {
      setCurrentQuestionId('q1')
    }
    setCurrentStep(prev => Math.max(1, prev - 1))
  }, [answers])

  // Handle close
  const handleClose = useCallback(() => {
    if (answers.length > 0) {
      setShowExitDialog(true)
    } else {
      router.push('/')
    }
  }, [answers.length, router])

  // Get current choices
  const currentQuestion = flow ? getQuestion(flow, currentQuestionId) : null
  const currentChoices: Choice[] = currentQuestion?.choices.map(c => ({
    id: c.id,
    label: c.label,
    value: c.value
  })) || []

  // Calculate total steps
  const totalSteps = flow?.questions.length || 5

  if (!flow) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <DiagnosisHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onClose={handleClose}
      />

      {/* Chat Area */}
      <div className="flex-1 pt-24 pb-48">
        <div className="max-w-2xl mx-auto">
          <ChatArea
            messages={messages}
            isTyping={isTyping}
          />
        </div>
      </div>

      {/* Choice Area */}
      {!isTyping && currentChoices.length > 0 && (
        <ChoiceArea
          choices={currentChoices}
          onSelect={handleSelect}
          onBack={handleBack}
          showBack={answers.length > 0}
        />
      )}

      {/* Exit Confirmation Dialog */}
      <Dialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirm={() => router.push('/')}
        title="진단을 그만두시겠어요?"
        description="지금까지의 진행 상황이 저장되지 않습니다."
        confirmText="나가기"
        cancelText="계속하기"
        type="warning"
      />
    </div>
  )
}

export default function DiagnosisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    }>
      <DiagnosisContent />
    </Suspense>
  )
}
