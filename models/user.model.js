import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
  googleId: { type: String },
  photo: { type: String },
  email: { type: String },
  age: { type: Number },
  country: { type: String },
  state: { type: String },
  pin: { type: Number },
  firstname: { type: String },
  lastname: { type: String },
  bio: { type: String },
  sGoal: { type: String },
  sGoalId : { type: Schema.Types.ObjectId, ref: 'PredefineGoals' },
  currCourse: { type: String },
  currContest: { type: Array },
  isVerified: { type: Boolean, default: false },
  isStudent: { type: Boolean, default: true },
  isEducator: { type: Boolean, default: false },
  isOld: { type: Boolean, default: false },
  password: { type: String, require: true },
  workTime: { type: Number, default: 1 },
  creation_dt: { type: Date, require: true },
  corrAns: { type: Number, default: 1 },
  skipAns: { type: Number, default: 0 },
  qNo: { type: Number, default: 1 },
  maxQ: { type: Number, default: 2 },
  courseIndex: { type: Number },
  topicIndex: { type: String },
  tryLaterProblems: { type: Array },
  peerNo: { type: Number, default: 0 },
  currPeer: { type: Number, default: 0 },
  currTopic: { type: String },
  pathCourse: { type: String },
  pathTopic: { type: String },
  gScore: { type: Number, default: 500 },
  challengeRequest: { type: Array },
  challengeDone: { type: Array },
  trialAccept: { type: Boolean, default: false },
  zohoId: { type: String },
  phone: { type: Number },
  workHistory: { type: Array },
  uCode: { type: Array },
  currTest: { type: String },
  runningTest: { type: Array },
  skippedTests: { type: Array },
  attemptedTests: { type: Array },
  monthlySubscription: { type: Boolean, default: false },
  monthlySubscriptionTime: { type: Number },
  monthlySubscriptionPeriod: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  mockPackage: { type: Array, default: ['FREE', 'SUBSCRIBERS'] },
  mockSubscription: { type: Array, default: [true, true] },
  mockId: { type: Array, default: [0, 0] },
  classCode: { type: Array },
  learnCourse: { type: Array },
  learnTopic: { type: Array },
  currentQuestion: { type: String },
  correctAttemptedQuestions: { type: Array, default: [] },
  /////////
  attemptedQuestions : [{ type: Schema.Types.ObjectId, ref: 'question', default : [] }],
  currectQuestions: [{ type: Schema.Types.ObjectId, ref: 'question', default : [] }],
  wrongQuestions: [{ type: Schema.Types.ObjectId, ref: 'question', default : [] }],
  skipQuestions: [{ type: Schema.Types.ObjectId, ref: 'question', default : [] }],
  completedCourses :  [{ type: Schema.Types.ObjectId, ref: 'course', default : [] }],
  completedtopic :  [{ type: Schema.Types.ObjectId, ref: 'topic', default : [] }],
});

/// middleware for hashing passwords before saving them to the database
userSchema.pre('save', async function (next) {
  /// check is user modify password or not
  if (!this.isModified('password')) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

/// middleware to check password
userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

/// middlewware to create Access Token and Refresh token
userSchema.methods.createAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

const UserModel = mongoose.model('user', userSchema);
export { UserModel };
