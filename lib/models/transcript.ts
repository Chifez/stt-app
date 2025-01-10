import mongoose, { Document, Schema } from 'mongoose';

export interface ITranscript extends Document {
  text: string;
  tags?: string[];
  userId: string;
}

const TranscriptSchema: Schema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Transcript =
  mongoose.models.transcript ||
  mongoose.model<ITranscript>('transcript', TranscriptSchema);

export default Transcript;
