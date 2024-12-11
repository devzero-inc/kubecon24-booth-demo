'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import clientPromise from '../lib/mongodb'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  jobTitle: z.string().min(1),
})

export async function submitForm(formData: FormData) {
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    jobTitle: formData.get('jobTitle'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name, email, company, jobTitle } = validatedFields.data

  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('kubecon-booth')

    // Insert data into demo-submissions collection
    await db.collection('demo-submissions').insertOne({
      name,
      email,
      company,
      jobTitle,
      createdAt: new Date()
    })

    // Send email (existing functionality)
    await resend.emails.send({
      from: 'kubecon@kubecon.devzero.io',
      to: email,
      subject: 'Welcome to KubeCon!',
      html: `<p>Hello ${name},</p><p>Welcome to KubeCon! We're excited to have you join us.</p>`,
    })

    return { success: true }
  } catch (error) {
    console.error('Error in submitForm:', error)
    return { error: 'Failed to submit form' }
  }
}
