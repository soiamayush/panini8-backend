import { Router } from 'express';
import {
  getAllTheGoalRelatedCourses,
  getGoalsByEligibility,
} from '../controllers/preDefineGoal.controller.js';
import { verifyUser } from '../middlewares/verifyuser.middleware.js';
const preDefineGoalRouter = Router();

preDefineGoalRouter.route('/get').get(getGoalsByEligibility);
preDefineGoalRouter
  .route('/get/courses/by-goal/:goalId')
  .get(getAllTheGoalRelatedCourses);

export { preDefineGoalRouter };
