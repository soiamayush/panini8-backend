import dotenv from 'dotenv';
import { connection } from './db/config.js';
import { app } from './app.js';
dotenv.config();

connection()
  .then(() => {
    console.log({
      message: 'connection successfully!',
      status: true,
    });
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log({ message: `connection failed`, error: error });
  });
