import mongoose from 'mongoose';

const userScoreSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  topicScore: [Number],
  question: [{ type: mongoose.Schema.Types.ObjectId, ref: 'question' }],
  email: { type: String, required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'topic' },
  __v: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});

const UserScore = mongoose.model('userscore', userScoreSchema);
export { UserScore };
