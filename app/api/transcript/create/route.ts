import Transcript from '@/lib/models/transcript';
import { verifyToken } from '@/lib/utils/controllers/authMiddleware';
import dbConnect from '@/lib/utils/controllers/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

dbConnect();

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const user = await verifyToken(token!);

  if (!user) {
    return (
      NextResponse.json({ error: 'Invalid token' }),
      {
        status: 401,
      }
    );
  }
  const { text } = await req.json();

  if (!text) {
    return (
      NextResponse.json({ error: 'Text is required' }),
      {
        status: 400,
      }
    );
  }

  const newTranscript = await Transcript.create({ userId: user.id, text });
  return NextResponse.json(
    { message: 'History saved successfully', newTranscript },
    { status: 201 }
  );
}
