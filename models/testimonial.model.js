import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const testimonialSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'user' },
    feedback: { type : String, required : true, trim : true },
    rate : {type : Number, required : true, min : 1, max : 5},
    likes : [{type: Schema.Types.ObjectId, ref: 'user', default: []}]
  },
  { timestamps: true, versionKey : false },
);

const TestimonialModel = mongoose.model('testimonial', testimonialSchema);
export { TestimonialModel };
