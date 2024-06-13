import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AskQuestionSchema = new Schema(
  {
    questionID: { type: Schema.Types.ObjectId, ref: 'question' },
    creator: { type: Schema.Types.ObjectId, ref: 'user' },
    title : {type : String, required : true, trim : true},
    description : {type : String, required : true, trim : true},
    tags : [{type : String}],
    askquestionstatus : {type : Boolean, default : false}
  },
  { timestamps: true, versionKey: false },
);

const AskQuestionModel = mongoose.model('askquestion', AskQuestionSchema);
export { AskQuestionModel };
