import Transcript from '@/lib/models/transcript';
import { verifyToken } from '@/lib/utils/controllers/authMiddleware';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const token = req.headers.get('authorization')?.split(' ')[1];
  const user = await verifyToken(token!);

  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }), { status: 401 };
  }
  if (!id) {
    return NextResponse.json({ error: 'Invalid id' }), { status: 401 };
  }
  await Transcript.findByIdAndDelete({ id });
  return NextResponse.json(
    { message: 'Transcript deleted successfully' },
    { status: 200 }
  );
}
