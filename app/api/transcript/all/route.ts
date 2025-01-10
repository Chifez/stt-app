import Transcript from '@/lib/models/transcript';
import { verifyToken } from '@/lib/utils/controllers/authMiddleware';
import dbConnect from '@/lib/utils/controllers/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

dbConnect();

export async function GET(req: NextRequest): Promise<any> {
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

  const transcript = await Transcript.find({ userId: user.id }).sort({
    createdAt: 1,
  });
  return NextResponse.json({ transcript }, { status: 200 });
}
