import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  //   forgotpasswordtoken: string;
  //   forgotpasswordtokenexpiry: Date;
  //   verifytoken: string;
  //   verifytokenexpiry: Date;
}

const userSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    length: 5,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  //   forgotpasswordtoken: {
  //     type: String,
  //   },

  //   forgotpasswordtokenexpiry: {
  //     type: Date,
  //   },
  //   verifytoken: {
  //     type: String,
  //   },
  //   verifytokenexpiry: {
  //     type: Date,
  //   },
});

export const User = mongoose.model<IUser>('User', userSchema);
