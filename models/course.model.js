import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    contest: { type: [String], required: true },
    topicId: [{ type: Schema.Types.ObjectId, ref: 'topic' }],
    email: { type: String, required: true },
    course: { type: String, required: true },
    goalIds: [{ type: Schema.Types.ObjectId, ref: 'PredefineGoals' }],
  },
  { timestamps: true, versionKey: false },
);

const Course = mongoose.model('course', CourseSchema);
export { Course };
