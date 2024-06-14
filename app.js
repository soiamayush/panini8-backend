import express from 'express';
import cors from 'cors';
import { ApiError } from './utils/apiError.js';
import bodyParser from 'body-parser';
import { ErrorHandler } from './middlewares/errorHandling.middleware.js';
import { userRouter } from './routes/user.routes.js';
import { questionRouter } from './routes/question.route.js';
import { preDefineGoalRouter } from './routes/preDefineGoal.route.js';
import { goalRouter } from './routes/goal.routes.js';
import { progressRouter } from './routes/progress.route.js';
import { testimonialRouter } from './routes/testimonial.routes.js';
import { askQuestionRouter } from './routes/askquestion.routes.js';
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/question', questionRouter);
app.use('/api/v1/predefinegoal', preDefineGoalRouter);
app.use('/api/v1/goal', goalRouter);
app.use('/api/v1/progress', progressRouter);
app.use('/api/v1/testimonial', testimonialRouter);
app.use('/api/v1/ask', askQuestionRouter);

app.get('/hello', (req, res) => {
  return res.send('hello');
});

app.get('/', (req, res) => {
  return res.status(201).render('welcome-email');
});

// if Routes are not exists
app.all('*', (req, res, next) => {
  next(new ApiError(`${req.originalUrl} <- this Route not found!`, 404));
});

app.use(ErrorHandler);

export { app };
