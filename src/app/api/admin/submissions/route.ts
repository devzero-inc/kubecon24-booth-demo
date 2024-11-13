import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'kubecon-booth-1080b684c6ad44c9b835761fa92dece8'

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

async function getImageFromS3(key: string): Promise<string> {
  try {
    console.log(`Fetching image from S3: ${key}`)
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const response = await s3Client.send(command)
    if (!response.Body) {
      throw new Error('No image data received from S3')
    }

    const stream = response.Body as Readable
    const buffer = await streamToBuffer(stream)
    console.log(`Successfully fetched and processed image: ${key}`)
    return buffer.toString('base64')
  } catch (error) {
    console.error(`Error fetching image from S3: ${key}`, error)
    throw error
  }
}

export async function GET() {
  try {
    console.log('Connecting to MongoDB...')
    const client = await MongoClient.connect(process.env.MONGODB_URI || '')
    const db = client.db('kubecon-booth')
    console.log('Connected to MongoDB, fetching submissions...')
    const submissions = await db.collection('submissions').find({}).toArray()
    console.log(`Found ${submissions.length} submissions`)

    const processedSubmissions = await Promise.all(submissions.map(async (submission) => {
      try {
        const originalImage = await getImageFromS3(submission.originalImagePath)
        const generatedImage = await getImageFromS3(submission.generatedImagePath)

        return {
          ...submission,
          originalImage,
          generatedImage,
        }
      } catch (error) {
        console.error(`Error processing submission ${submission._id}:`, error)
        return {
          ...submission,
          originalImage: null,
          generatedImage: null,
          error: 'Failed to fetch images',
        }
      }
    }))

    await client.close()
    console.log('Successfully processed all submissions')

    return NextResponse.json(processedSubmissions)
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 })
  }
}