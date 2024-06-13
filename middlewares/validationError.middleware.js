import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';
import { AsyncHandler } from '../utils/asyncHandler.js';

const validationError = AsyncHandler(async (req, res, next) => {
  // If any error exists then throw Error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array()?.map((ele) => {
      return {
        field: ele.path,
        message: ele?.msg,
      };
    });
    return next(new ApiError(errors.array()[0].msg, 400, err));
  }
  next();
});

export { validationError };
