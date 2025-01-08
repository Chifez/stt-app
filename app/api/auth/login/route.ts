import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/utils/controllers/dbConnect';
import User from '@/lib/models/user';
import { signToken } from '@/lib/utils/controllers/authMiddleware';

// dbConnect();

export async function POST(request: NextRequest): Promise<any> {
  await dbConnect();
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 400 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = await signToken(tokenData);

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      token: token,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
