import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true, // Required for custom endpoints
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = 'kubecon-booth-1080b684c6ad44c9b835761fa92dece8'

export async function POST(request: Request) {
  try {
    const { formData, imageUrl, generatedImageUrl } = await request.json()

    // Download both images
    const [originalImage, generatedImage] = await Promise.all([
      fetch(imageUrl).then(res => res.arrayBuffer()),
      fetch(generatedImageUrl).then(res => res.arrayBuffer())
    ])

    // Generate unique IDs for the images
    const originalImageId = uuidv4()
    const generatedImageId = uuidv4()

    // Upload both images to S3
    await Promise.all([
      s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `original/${originalImageId}.jpg`,
        Body: Buffer.from(originalImage),
        ContentType: 'image/jpeg',
      })),
      s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `generated/${generatedImageId}.jpg`,
        Body: Buffer.from(generatedImage),
        ContentType: 'image/jpeg',
      }))
    ])

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI || '')
    const db = client.db('kubecon-booth')

    // Create submission record
    await db.collection('submissions').insertOne({
      ...formData,
      originalImagePath: `original/${originalImageId}.jpg`,
      generatedImagePath: `generated/${generatedImageId}.jpg`,
      createdAt: new Date(),
    })

    await client.close()

    return NextResponse.json({ 
      success: true,
      message: 'Submission successful' 
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process submission' 
      },
      { status: 500 }
    )
  }
}