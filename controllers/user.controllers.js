import { UserModel } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AsyncHandler } from '../utils/asyncHandler.js';

const generateAccessAndRefreshToken = async (user) => {
  const accessToken = await user.createAccessToken();
  return {
    accessToken,
  };
};

/// register controller path:- "http://localhost:8000/api/v1/user/register"
const register = AsyncHandler(async (req, res, next) => {
  const { firstname, email, password, age, country, lastname } = req.body;
  /// check if the email exists or not
  const userExists = await UserModel.findOne({
    email,
  });

  if (userExists) {
    return next(new ApiError('User already exists', 401, null));
  }

  // if user not exists  then create a new user and save it to database
  const user = await UserModel.create({
    firstname,
    email,
    age,
    country,
    password,
    lastname,
  });

  // send response
  const response = new ApiResponse(201, 'Successfully register!', user);
  return res.status(201).json({ ...response });
});

/// login controller path:- "http://localhost:8000/api/v1/user/login"
const login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // find user by email or username
  const user = await UserModel.findOne({
    email,
  });
  if (!user) {
    return next(new ApiError('You have to login first!', 401));
  }

  // if user exists check password
  const isPasswordCurrect = await user.checkPassword(password);
  if (!isPasswordCurrect) {
    return next(new ApiError('Invalid credentials', 401));
  }

  // if password currect generate token and send in the response

  const tokens = await generateAccessAndRefreshToken(user);

  const userData = await UserModel.findOne({ _id: user?._id }).select(
    '-password -createdAt -updatedAt -_id',
  );
  // send response and mail

  const response_data = {
    email: userData?.email,
    sGoalId : userData?.sGoalId,
    ...tokens,
  };
  const response = new ApiResponse(201, 'Successfully login!', response_data);
  return res.status(201).json({ ...response });
});

// login with google
const GoogleLogin = AsyncHandler(async (req, res, next) => {
  const { firstname, email, googleId, lastname } = req.body;
  // find user by the google id
  const user = await UserModel.findOne({ googleId });

  if (!user) {
    //if user not exists create a user and send token
    const createUser = await UserModel.create({
      firstname,
      email,
      googleId,

      lastname,
    });
    const tokens = await generateAccessAndRefreshToken(createUser);
    const userData = await UserModel.findOne({ _id: createUser?._id }).select(
      '-password -createdAt -updatedAt -_id',
    );
    // send response and mail
    const response_data = {
      email: userData?.email,
      sGoalId : userData?.sGoalId,
      ...tokens,
    };
    const response = new ApiResponse(201, 'Successfully login!', response_data);
    return res.status(201).json({ ...response });
  } else {
    if (user.email == email) {
      const tokens = await generateAccessAndRefreshToken(user);

      const userData = await UserModel.findOne({ _id: user?._id }).select(
        '-password -createdAt -updatedAt -_id',
      );
      // send response and mail

      const response_data = {
        email: userData?.email,
        sGoalId : userData?.sGoalId,
        ...tokens,
      };
      const response = new ApiResponse(
        201,
        'Successfully login!',
        response_data,
      );
      return res.status(201).json({ ...response });
    } else {
      return next(new ApiError('Invalid credentials', 401));
    }
  }
});

export { login, register, GoogleLogin };
