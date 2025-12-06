import OpenAI from 'openai'

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}
