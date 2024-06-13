import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  source: { type: Schema.Types.ObjectId, ref: 'topic' },
  target: { type: Schema.Types.ObjectId, ref: 'topic' },
});

const GraphSchema = new Schema({
  links: [
    {
      source: String,
      target: String,
    },
  ],
  email: { type: String, required: true },
  course: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  __v: { type: Number, default: 0 },
  creator: { type: Schema.Types.ObjectId, ref: 'user' },
  courseID: { type: Schema.Types.ObjectId, ref: 'course' },
  linksID: [
    {
      source: { type: Schema.Types.ObjectId, ref: 'topic' },
      target: { type: Schema.Types.ObjectId, ref: 'topic' },
    },
  ],
  treeLinksID: [linkSchema],
  paths: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'topic' }]],
});

const Graph = mongoose.model('graph', GraphSchema);
export { Graph };
