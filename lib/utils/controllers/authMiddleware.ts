import jwt from 'jsonwebtoken';

interface TokenData {
  id: any;
  name: string;
  email: string;
}

export function signToken(user: TokenData) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
}

export function verifyToken(token: string): TokenData {
  try {
    console.log(jwt.verify(token, process.env.JWT_SECRET!));
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenData;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
