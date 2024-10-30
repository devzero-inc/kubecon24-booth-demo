import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export async function POST(request: Request) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const { base64Image, mimeType } = await request.json()
    
    if (!base64Image || !mimeType) {
      return NextResponse.json(
        { error: 'Missing required fields: base64Image and mimeType' },
        { status: 400 }
      )
    }

    // Get image description from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this person appearance in detail, focusing on hair, eyes, facial structure, and any distinctive characteristics. If you can't get to specifics, say general things. Only respond with information about proper features!" },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "auto"
              }
            }
          ],
        }
      ],
      max_tokens: 150,
    })

    return NextResponse.json({ 
      description: response.choices[0].message.content 
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}