import { Router } from 'express';
import { verifyUser } from '../middlewares/verifyuser.middleware.js';
import { AddTestimonial, GetTestimonial } from '../controllers/testimonial.controller.js';
import { body } from 'express-validator';
import { validationError } from '../middlewares/validationError.middleware.js';
const testimonialRouter = Router();

testimonialRouter
  .route('/feedback')
  .post(
    [
      body('feedback').notEmpty().withMessage('feedback is required'),
      body('rate').notEmpty().withMessage('rate is required'),
    ],
    validationError,
    verifyUser,
    AddTestimonial,
  ).get(GetTestimonial);



export { testimonialRouter };
