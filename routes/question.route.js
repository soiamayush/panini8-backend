import { Router } from 'express';
import {
  UploadQuestionInCSV,
  GetNextQuestion,
  SubmitQuestion,
  getQuestionData,
  getTopicData,
} from '../controllers/question.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyUser } from '../middlewares/verifyuser.middleware.js';
const questionRouter = Router();

// upload.single("questioncsv"),
questionRouter
  .route('/upload')
  .post(upload.single('questioncsv'), UploadQuestionInCSV);
questionRouter.route('/get').get(verifyUser, GetNextQuestion);
questionRouter.route('/submit').post(verifyUser, SubmitQuestion);
questionRouter.route('/questiondata/:id').get(verifyUser, getQuestionData);
questionRouter.route("/topicid/:id").get(verifyUser, getTopicData)

// questionRouter.route("/skip").post(SkipQuestion);

export { questionRouter };
