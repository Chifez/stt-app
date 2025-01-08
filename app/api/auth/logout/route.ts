import { NextResponse } from 'next/server';

export async function GET(): Promise<any> {
  try {
    const request = await NextResponse.json({
      message: 'logout succsefully',
      success: true,
    });

    request.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });

    return request;
  } catch (error) {
    return NextResponse.json({ massage: 'your request is not complete' });
  }
}
