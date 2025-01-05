import Transcript from '@/lib/models/transcript';
import { verifyToken } from '@/lib/utils/controllers/authMiddleware';
import dbConnect from '@/lib/utils/controllers/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

dbConnect();

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const { id: userId } = verifyToken(token!);

  const transcript = await Transcript.find({ userId }).sort({ createdAt: -1 });
  return new Response(JSON.stringify({ transcript }), { status: 200 });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const { id: userId } = verifyToken(token!);
  const { text } = await req.json();

  if (!text) {
    return new Response(JSON.stringify({ error: 'Text is required' }), {
      status: 400,
    });
  }

  const newTranscript = await Transcript.create({ userId, text });
  return NextResponse.json(
    { message: 'History saved successfully', newTranscript },
    { status: 201 }
  );
}
