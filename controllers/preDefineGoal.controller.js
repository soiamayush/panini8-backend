import { Course } from '../models/course.model.js';
import { PredefineGoalModel } from '../models/preDefineGoal.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AsyncHandler } from '../utils/asyncHandler.js';


const getGoalsByEligibility = AsyncHandler(async (req, res, next) => {
  let firsttosixquery = {
    type: { $ne: 'private' },
    eligibility: {
      $in: [
        'For Math Kangaroo (Grade 3  - 6)',
        'For grades 5-8',
        'For Math Kangaroo (Grade 1, 2)',
      ],
    },
  };
  const firsttosixgoals = await PredefineGoalModel.find(firsttosixquery);

  ////////
  let seventotenquery = {
    type: { $ne: 'private' },
    eligibility: {
      $in: [
        'For grades 5-8',
        'For IOQM, RMO, INMO, AMC 10, 12',
        'For NSEP, F = Ma (Grades 8-10)',
      ],
    },
  };
  const seventotengoals = await PredefineGoalModel.find(seventotenquery);

  //////////////////////
  let eltotwquery = {
    type: { $ne: 'private' },
    eligibility: {
      $in: [
        'For IOQM, RMO, INMO, AMC 10, 12',
        'For Grade 12 and High School Graduates',
      ],
    },
  };
  const eltotwgoals = await PredefineGoalModel.find(eltotwquery);

  const response_data = {
    goalData: [
      {
        title: 'For Students from 1st to 6th',
        goals: firsttosixgoals,
      },
      {
        title: 'For Students from 7th to 10th',
        goals: seventotengoals,
      },
      {
        title: 'For Students from 11th to 12th',
        goals: eltotwgoals,
      },
    ],
  };
  const response = new ApiResponse(201, 'Success', response_data);
  return res.status(201).json({ ...response });
});

const getAllTheGoalRelatedCourses = AsyncHandler(async (req, res, next) => {
  const { goalId } = req.params;
  const courses = await Course.find({ goalIds: goalId });
  const response_data = {
    courses: courses || [],
  };
  const response = new ApiResponse(201, 'Success', response_data);
  return res.status(201).json({ ...response });
});




export { getGoalsByEligibility, getAllTheGoalRelatedCourses };
