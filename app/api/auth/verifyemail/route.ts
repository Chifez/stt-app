import User from '@/lib/models/user';
import dbConnect from '@/lib/utils/controllers/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, email } = reqBody;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    user.isVerified = true;
    // user.verifyToken = undefined;
    // user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: 'Email verified successfully',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
