import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true, // Required for custom endpoints
})

const BUCKET_NAME = 'kubecon-booth-1080b684c6ad44c9b835761fa92dece8'

export async function POST(request: Request) {
  try {
    const { description } = await request.json()
    
    if (!description) {
      return NextResponse.json(
        { error: 'No description provided' },
        { status: 400 }
      )
    }

    const prompt = `Create a LEGO minifigure with these features: ${description}. Style the minifigure as a superstar or "10x" or "100x" developer with modern tech-inspired clothing. Ensure the background is clean and solid.`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    })

    const imageUrl = response.data[0].url
    if (!imageUrl) {
      throw new Error('Failed to generate image')
    }

    // Download the generated image
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()

    // Generate a UUID for the image
    const imageId = uuidv4()

    // Upload the image to S3
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `generated/${imageId}.jpg`,
      Body: Buffer.from(imageBuffer),
      ContentType: 'image/jpeg',
    }))

    return NextResponse.json({ 
      url: imageUrl,
      imageId: imageId
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}