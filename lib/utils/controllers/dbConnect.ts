import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URL;

const connection: { isConnected?: number } = {};

export default async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(MONGO_URI!);

  connection.isConnected = db.connections[0].readyState;
}
