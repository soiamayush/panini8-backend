import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TopicSchema = new Schema(
  {
    totalQuestion: { type: [Number], default: [] },
    totalMarks: { type: [Number], default: [] },
    email: { type: String, required: true },
    topic: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    __v: { type: Number, default: 0 },
    creator: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  { timestamps: true },
);

const Topic = mongoose.model('topic', TopicSchema);
export { Topic };
