import { ApiError } from '../utils/apiError.js';
import { AsyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

const verifyUser = AsyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new ApiError('You have to login first', 401));
  }

  const token = authorization.split(' ')[1];
  const { _id } = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!_id) {
    return next(new ApiError('You have to login first', 401));
  }
  req.userID = _id;
  next();
});

export { verifyUser };
