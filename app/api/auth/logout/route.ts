import dbConnect from '@/lib/utils/controllers/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(): Promise<any> {
  await dbConnect();
  try {
    const request = await NextResponse.json({
      message: 'logout succesfully',
      success: true,
    });

    request.cookies.set('session', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return request;
  } catch (error) {
    return NextResponse.json({ message: 'your request is not complete' });
  }
}
