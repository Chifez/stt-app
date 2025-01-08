import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
}

const validator = {
  isEmail: (value: string): boolean => {
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailregex.test(value);
  },
  isPasswordValid: (password: string): boolean => {
    // Example criteria: at least 6 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  },
};

const userSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return validator.isEmail(value);
        },
        message: 'Please use a valid email',
      },
    },
    password: {
      type: String,
      required: true,
      // validate: {
      //   validator: (value: string) => {
      //     return validator.isPasswordValid(value);
      //   },
      //   message: 'Please use a valid password',
      // },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models.users || mongoose.model<IUser>('users', userSchema);

export default User;
