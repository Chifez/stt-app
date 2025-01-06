import Transcript from '@/lib/models/transcript';
import { verifyToken } from '@/lib/utils/controllers/authMiddleware';
import dbConnect from '@/lib/utils/controllers/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

dbConnect();

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const session = await verifyToken(token!);

  const { id: userId } = session;

  const transcript = await Transcript.find({ userId }).sort({ createdAt: -1 });
  return new Response(JSON.stringify({ transcript }), { status: 200 });
}
