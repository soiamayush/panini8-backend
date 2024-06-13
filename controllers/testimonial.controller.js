import { TestimonialModel } from '../models/testimonial.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AsyncHandler } from '../utils/asyncHandler.js';

const AddTestimonial = AsyncHandler(async (req, res, next) => {
  const userID = req.userID;
  const { rate, feedback } = req.body;
  const create = await TestimonialModel.create({
    creator: userID,
    feedback,
    rate,
  });
  const response_data = {
    testimonial: create,
  };
  const response = new ApiResponse(201, 'Successfully added!', response_data);
  return res.status(201).json({ ...response });
});

const GetTestimonial = AsyncHandler(async (req, res, next) => {
  const { page, limit, fields, select } = req.query;
  let testimonial = TestimonialModel.find();


  if (fields) {
    testimonial = testimonial.populate(fields.split(',').join(' '));
  }

  if (select) {
    testimonial = testimonial.select(select.split(',').join(' '));
  }


  if (page || limit) {
    testimonial = testimonial.skip((page - 1) * limit).limit(limit);
  }

  const total = await TestimonialModel.countDocuments();

  testimonial = await testimonial;
  const response_data = {
    testimonial,
    meta: {
      total_count: total,
    },
  };
  const response = new ApiResponse(201, 'success', response_data);
  return res.status(201).json({ ...response });
});

export { AddTestimonial, GetTestimonial };
