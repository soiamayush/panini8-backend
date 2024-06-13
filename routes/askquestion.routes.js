import { Router } from 'express';
import { verifyUser } from '../middlewares/verifyuser.middleware.js';
import {
  AddAskQuestion,
  GetAskQuestion,
  GetSingleAskQuestion,
} from '../controllers/askquestion.controller.js';
import { validationError } from '../middlewares/validationError.middleware.js';
import { body } from 'express-validator';
const askQuestionRouter = Router();

askQuestionRouter
  .route('/question')
  .post(
    [
      body('title').notEmpty().withMessage('title is required'),
      body('description').notEmpty().withMessage('description is required'),
      body('questionID').notEmpty().withMessage('question id is required'),
    ],
    validationError,
    verifyUser,
    AddAskQuestion,
  )
  .get(GetAskQuestion);


askQuestionRouter
  .route('/question/:id')
  .patch(
    [
      body('title').notEmpty().withMessage('title is required'),
      body('description').notEmpty().withMessage('description is required'),
      body('questionID').notEmpty().withMessage('question id is required'),
    ],
    validationError,
    verifyUser,
    AddAskQuestion,
  )
  .get(GetSingleAskQuestion);

export { askQuestionRouter };
