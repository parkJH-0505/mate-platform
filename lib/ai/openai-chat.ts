import { getOpenAI } from '@/lib/openai'

// 채팅 메시지 타입
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// 스트리밍 응답 생성
export async function* streamChatResponse(
  systemPrompt: string,
  messages: ChatMessage[],
  options?: {
    maxTokens?: number
    temperature?: number
  }
): AsyncGenerator<string, void, unknown> {
  const openai = getOpenAI()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: options?.maxTokens || 1024,
    temperature: options?.temperature || 0.7,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
    ],
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      yield content
    }
  }
}

// 일반 응답 생성 (비스트리밍)
export async function generateChatResponse(
  systemPrompt: string,
  messages: ChatMessage[],
  options?: {
    maxTokens?: number
    temperature?: number
  }
): Promise<string> {
  const openai = getOpenAI()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: options?.maxTokens || 1024,
    temperature: options?.temperature || 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
    ],
  })

  return response.choices[0]?.message?.content || ''
}

// 짧은 응답 생성 (제목 등)
export async function generateShortResponse(
  prompt: string,
  options?: {
    maxTokens?: number
  }
): Promise<string> {
  const openai = getOpenAI()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: options?.maxTokens || 50,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.choices[0]?.message?.content?.trim() || ''
}
