import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const GoalSchema = new Schema(
  {
    corrAns: { type: Number, default: 0 },
    skipAns: { type: Number, default: 0 },
    qNo: { type: Number, default: 0 },
    maxQ: { type: Number, default: 0 },
    tryLaterProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    peerNo: { type: Number, default: 0 },
    currPeer: { type: Number, default: 0 },
    gScore: { type: Number, default: 0 },
    workHistory: [
      {
        type: Array,
        default: [],
      },
    ],
    monthlySubscription: { type: Boolean, default: false },
    monthlySubscriptionPeriod: { type: Number, default: 0 },
    email: { type: String, required: true },
    sGoal: { type: String, default: '' },
    monthlySubscriptionTime: { type: Date, default: Date.now },
    creator: { type: Schema.Types.ObjectId, ref: 'user' },
    sGoalId : { type: Schema.Types.ObjectId, ref: 'PredefineGoals' },
    courseDetails : [{
      _id : {
        type: Schema.Types.ObjectId,
        ref: 'course'
      },
      topicId : [{type: Schema.Types.ObjectId, ref: 'topic'}]
    }],
    pathoftopic: [
      {
        coursesID: {
          type: Schema.Types.ObjectId,
          ref: 'course',
        },
        topics: [
          {
            topicID: {
              type: Schema.Types.ObjectId,
              ref: 'topic',
            },
            topicScore: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

const Goal = mongoose.model('goal', GoalSchema);
export { Goal };
