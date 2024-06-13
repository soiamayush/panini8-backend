import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const historySchema = new Schema(
  {
    date: { type: String, required: true },
    goalID: { type: Schema.Types.ObjectId, ref: 'PredefineGoals' },
    creator: { type: Schema.Types.ObjectId, ref: 'user' },
    attemptedQuestions: [
      { type: Schema.Types.ObjectId, ref: 'question', default: [] },
    ],
    attemptedQuestionTimeInSec: [{ type: Number }],
    currectQuestions: [
      { type: Schema.Types.ObjectId, ref: 'question', default: [] },
    ],
    wrongQuestions: [
      { type: Schema.Types.ObjectId, ref: 'question', default: [] },
    ],
    skipQuestions: [
      { type: Schema.Types.ObjectId, ref: 'question', default: [] },
    ],
  },
  { timestamps: true },
);

const Userhistory = mongoose.model('userhistory', historySchema);
export { Userhistory };
