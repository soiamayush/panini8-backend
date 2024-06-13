import mongoose from 'mongoose';
import { MONGODB_NAME } from '../constents.js';

const connection = async () => {
  return mongoose.connect(`${process.env.MOGOURL}/${MONGODB_NAME}`);
};

export { connection };
