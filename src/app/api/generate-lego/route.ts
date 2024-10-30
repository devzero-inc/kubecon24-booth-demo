import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export async function POST(request: Request) {
  try {
    const { description } = await request.json()
    
    if (!description) {
      return NextResponse.json(
        { error: 'No description provided' },
        { status: 400 }
      )
    }

    const prompt = `You will create a LEGO minifigure. Style the minifigure as a superstar software developer with modern tech-inspired clothing. Ensure the background is clean and solid. Use these features: ${description}.`

    console.log("prompt: ", prompt)

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    })

    return NextResponse.json({ url: response.data[0].url })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}