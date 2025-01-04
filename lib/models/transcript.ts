import mongoose, { Document, Schema } from 'mongoose';

export interface ITranscript extends Document {
  text: string;
  tags?: string[];
}

const TranscriptSchema: Schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: false,
  },
});

export const Transcript = mongoose.model<ITranscript>(
  'Transcript',
  TranscriptSchema
);
