import { Router } from 'express';
import { verifyUser } from '../middlewares/verifyuser.middleware.js';
import { getUserProgress } from '../controllers/progress.controller.js';
const progressRouter = Router();

progressRouter.route('/user').get(verifyUser, getUserProgress);

export { progressRouter };