import mongoose from 'mongoose';

const predefineGoalsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    goalCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    eligibility: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['private', 'public'],
      default: 'public',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const PredefineGoalModel = mongoose.model(
  'PredefineGoals',
  predefineGoalsSchema,
);

export { PredefineGoalModel };
