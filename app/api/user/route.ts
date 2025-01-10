import User from '@/lib/models/user';
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
  const profile = await User.findOne({ _id: user.id });
  return NextResponse.json({ profile }, { status: 200 });
}
