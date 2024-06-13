import { Router } from 'express';
import { verifyUser } from '../middlewares/verifyuser.middleware.js';
import {
  createUserGoal,
  selectedGoalData,
} from '../controllers/goal.controller.js';
const goalRouter = Router();

goalRouter.route('/create/usergoal/:goalId').post(verifyUser, createUserGoal);
goalRouter.route('/getgoaldata').get(verifyUser, selectedGoalData);

export { goalRouter };
