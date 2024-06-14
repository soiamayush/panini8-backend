import { Router } from 'express';
import { body } from 'express-validator';
import {
  GoogleLogin,
  getusers,
  login,
  register,
} from '../controllers/user.controllers.js';
import { validationError } from '../middlewares/validationError.middleware.js';
const userRouter = Router();

userRouter
  .route('/login')
  .post(
    [
      body('email')
        .optional()
        .notEmpty()
        .withMessage('Username or Email is required'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    validationError,
    login,
  );

userRouter.route('/register').post(
  [
    body('firstname').notEmpty().withMessage('firstname is required'),
    body('lastname').notEmpty().withMessage('lastname is required'),
    body('age').notEmpty().withMessage('age is required'),
    body('country').notEmpty().withMessage('country is required'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({
        min: 4,
      })
      .withMessage('Password length must be atleast 4'),
  ],
  validationError,
  register,
);

userRouter
  .route('/google-login')
  .post(
    [
      body('firstname').notEmpty().withMessage('firstname is required'),
      body('lastname').notEmpty().withMessage('lastname is required'),
      body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email'),
      body('googleId').notEmpty().withMessage('googleId is required'),
    ],
    validationError,
    GoogleLogin,
  );

userRouter.get('/getuser', getusers);

export { userRouter };
