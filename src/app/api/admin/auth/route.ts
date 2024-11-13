import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === 'devzero-admin' && password === 'devzero-kubecon-password-123!@') {
    const token = sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}