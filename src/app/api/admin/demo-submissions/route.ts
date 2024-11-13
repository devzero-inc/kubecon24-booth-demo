import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('kubecon-booth')
    
    const submissions = await db.collection('demo-submissions').find({}).toArray()

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching demo submissions:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}