import Transcript from '@/lib/models/transcript';
import { verifyToken } from '@/lib/utils/controllers/authMiddleware';
import dbConnect from '@/lib/utils/controllers/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

dbConnect();

export async function PUT(req: NextRequest): Promise<any> {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const user = await verifyToken(token!);
  const id = req.nextUrl.searchParams.get('id');
  const { text } = await req.json();

  if (!user) {
    return (
      NextResponse.json({ error: 'Invalid token' }),
      {
        status: 401,
      }
    );
  }

  if (!text) {
    return NextResponse.json(
      { error: 'Text cannot be empty' },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json({ error: 'ID is invalid' }, { status: 400 });
  }

  const transcript = await Transcript.findByIdAndUpdate(
    id,
    {
      $set: { text },
    },
    {
      new: true,
    }
  );
  return NextResponse.json({ transcript }, { status: 200 });
}
