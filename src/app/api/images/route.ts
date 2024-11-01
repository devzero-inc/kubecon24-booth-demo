import { NextResponse } from 'next/server'
import { getImageData } from '@/lib/data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '5', 10)
  const lastKey = searchParams.get('lastKey') || undefined

  try {
    const result = await getImageData(page, limit, lastKey)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to fetch images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}