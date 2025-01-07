import Transcript from '@/lib/models/transcript';
import { verifyToken } from '@/lib/utils/controllers/authMiddleware';
import dbConnect from '@/lib/utils/controllers/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

dbConnect();

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = await verifyToken(token!);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    console.log('user from backend', user);
    const newTranscript = await Transcript.create({ userId: user.id, text });
    console.log('newTranscript', newTranscript);
    return NextResponse.json({ data: newTranscript }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
