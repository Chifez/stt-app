import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/utils/controllers/dbConnect';
import User from '@/lib/models/user';
import { signToken } from '@/lib/utils/controllers/authMiddleware';

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, email, password } = reqBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const token = await signToken(newUser);

    const savedUser = await newUser.save();

    const verificationToken = await bcrypt.hash(savedUser._id.toString(), 10);

    // const templateName = “verification_template.html”;
    // const subject = “Email Verification”;
    // await sendEmail(email, subject, { verificationLink: `${process.env.DOMAIN}/verifyemail?token=${verificationToken}` }, templateName);

    const { password: _, ...others } = savedUser._doc;
    return NextResponse.json({
      message: 'User created successfully. Verification email sent.',
      success: true,
      user: { ...others, token },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
