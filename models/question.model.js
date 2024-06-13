import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const questionSchema = new Schema({
  email: { type: String, required: true },
  type: { type: String, required: true },
  question: { type: Array, required: true },
  answer: { type: Array, required: true },
  options: { type: Array },
  hint: { type: Array },
  solution: { type: Array },
  topic: { type: Array, required: true },
  weightage: { type: Array, required: true },
  course: { type: Array, required: true },
  goal: { type: Array, required: true },
  isChallenge: { type: Boolean, default: false },
  difficultyLevel: { type: Number, required: true },
  geniusScore: { type: Array },
  draft: { type: Boolean, default: false, require: true },
  isRemoved: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  topicID: [{ type: Schema.Types.ObjectId, ref: 'topic' }],
});

const QuestionModel = mongoose.model('question', questionSchema);
export { QuestionModel };
