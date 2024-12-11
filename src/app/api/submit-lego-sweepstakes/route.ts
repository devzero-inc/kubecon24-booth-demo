import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import LegoSubmitEmail from '@/emails/LegoSubmitEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    const { formData, originalImageB64, generatedImageId } = await request.json()

    if (!originalImageB64 || !generatedImageId) {
      throw new Error('Missing required image metadata')
    }

    // Generate unique IDs for the images
    const originalImageId = uuidv4()

    // base64 decode the string to get the image buffer
    const originalImageBuffer = Buffer.from(originalImageB64, 'base64')

    // Upload both images to S3
    await Promise.all([
      s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `original/${originalImageId}.jpg`,
        Body: originalImageBuffer,
        ContentType: 'image/jpeg',
      })),
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

    const name = formData.firstName
    // Render email template
    console.log('Rendering email template fro lego')
    const emailHtml = await render(LegoSubmitEmail({ 
      name, 
    }))

    console.log('Email HTML for lego rendered successfully')

    // Send email with the rendered HTML
    console.log('Attempting to send email')
    const emailResult = await resend.emails.send({
      from: 'DevZero <no-reply@kubecon.devzero.io>',
      to: formData.email,
      subject: 'Your LEGO Minifigure from DevZero!',
      replyTo: 'debo@devzero.io',
      bcc: '21418179@bcc.hubspot.com',
      html: emailHtml,
    })

    console.log('Email sent successfully:', emailResult)

    return NextResponse.json({ 
      success: true,
      message: 'Submission successful' 
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process submission'
      },
      { status: 500 }
    )
  }
}
