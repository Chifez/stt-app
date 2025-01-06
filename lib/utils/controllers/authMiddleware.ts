import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

interface TokenData {
  id: any;
  name: string;
  email: string;
}

const secret = process.env.JWT_SECRET;

export async function createSession(token: string) {
  (await cookies()).set('session', token, { httpOnly: true });
}

export async function signToken(user: TokenData) {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(new TextEncoder().encode(secret));
}

export async function verifyToken(
  token: string
): Promise<TokenData | undefined> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    // if its all good, return it, or perhaps just return a boolean
    return payload as unknown as TokenData;
  } catch (error) {
    console.log('failed to verify the token or invalid token');
  }
}
