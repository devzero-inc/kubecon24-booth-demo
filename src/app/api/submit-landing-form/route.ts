import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import WelcomeEmail from '@/emails/WelcomeEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

const optionDetails: { [key: string]: { label: string, url: string } } = {
  "option1": {
    label: "Dev Environments (with Docker)",
    url: "https://www.devzero.io/docs/getting-started/quickstart"
  },
  "option2": {
    label: "Dev Environments (with Kubernetes)",
    url: "https://www.devzero.io/docs/workspaces/kubernetes-cluster"
  },
  "option3": {
    label: "Developer Experience Index (DXI)",
    url: "https://www.devzero.io/blog/beyond-dora-metrics-uber-devzero-oda"
  },
  "option4": {
    label: "GitHub Actions (just faster and cheaper)",
    url: "https://www.devzero.io/docs/how-to-guides/ci/run-github-actions-in-a-devbox"
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, company, jobTitle, options } = await request.json()

    // Validate input
    if (!name || !email || !company || !options) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure options is an array
    const optionsArray = Array.isArray(options) ? options : []

    console.log('Received form submission:', { name, email, company, jobTitle, options: optionsArray })

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('kubecon-booth')

    // Insert data into demo-submissions collection
    await db.collection('demo-submissions').insertOne({
      name,
      email,
      company,
      jobTitle,
      options: optionsArray,
      createdAt: new Date()
    })

    console.log('Data inserted into MongoDB')

    // Convert option IDs to their details
    const selectedOptions = optionsArray.map(optionId => ({
      label: optionDetails[optionId]?.label || optionId,
      url: optionDetails[optionId]?.url || '#'
    }))

    // Render email template
    console.log('Rendering email template')
    const emailHtml = await render(WelcomeEmail({ 
      name, 
      options: selectedOptions 
    }))

    console.log('Email HTML rendered successfully')

    // Send email with the rendered HTML
    console.log('Attempting to send email')
    const emailResult = await resend.emails.send({
      from: 'DevZero <no-reply@kubecon.devzero.io>',
      to: email,
      subject: 'Welcome to DevZero @ KubeCon 2024!',
      replyTo: 'debo@devzero.io',
      html: emailHtml,
    })

    console.log('Email sent successfully:', emailResult)

    return NextResponse.json({ success: true, emailResult }, { status: 200 })
  } catch (error) {
    console.error('Error in submitForm:', error)
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 })
  }
}
