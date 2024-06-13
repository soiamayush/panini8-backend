import { AsyncHandler } from '../utils/asyncHandler.js';
import CSV from 'csv-parser';
import path from 'path';
import fs from 'fs';
import { QuestionModel } from '../models/question.model.js';
import { ApiError } from '../utils/apiError.js';
import { Course } from '../models/course.model.js';
import { Graph } from '../models/graph.model.js';
import { UserScore } from '../models/userscore.model.js';
import { UserModel } from '../models/user.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Goal } from '../models/goal.model.js';
import { Topic } from '../models/topic.model.js';
import { Userhistory } from '../models/history.model.js';
const __dirname = path.dirname(import.meta.url);

// const getQuestionData = AsyncHandler(async (req, res) => {
//   const { id } = req.query;
//   if (!id) return res.status(401).send({ message: 'Id is not available !!' });

//   try {
//     const question = await QuestionModel.findById(id);
//     if (!question) {
//       return res.status(404).send({ message: 'Question not found' });
//     }
//     res.status(200).send({ question });
//   } catch (error) {
//     res
//       .status(500)
//       .send({ message: 'Internal server error', error: error.message });
//   }
// });

// const getQuestionData = AsyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const userId = req.userID;

//   const user = await UserModel.findById(userId);
//   const currentGoalId = user.sGoalId;
//   const goal = await Goal.findOne({ creator: userId, sGoalId: currentGoalId });
//   const pathOfTopic = goal.pathoftopic || [];
//   const prevCompletedtopic = new Set(user.completedtopic || []);

//   const getCourse = pathOfTopic.filter((course) => course?.coursesID == id);
//   const getTopic = getCourse.length > 0 ? getCourse[0].topics : [];

//   const getAllTheTopicLess100 = getTopic.filter(
//     (topic) =>
//       topic?.topicScore < 100 && !prevCompletedtopic.has(topic.topicID),
//   );

//   if (getAllTheTopicLess100.length <= 0) {
//     console.log('Courses completed and store course id in the user db');
//     return res.status(200).json({ message: 'All topics completed' });
//   }

//   let maxAttempts = getAllTheTopicLess100.length;
//   let question = null;
//   let maxTopicScoreObject = null;

//   while (!question && maxAttempts > 0) {
//     let maxTopicScore = -1;

//     for (const topic of getAllTheTopicLess100) {
//       if (topic.topicScore > maxTopicScore) {
//         maxTopicScore = topic.topicScore;
//         maxTopicScoreObject = topic;
//       }
//     }

//     const completedQuestionIds = user.attemptedQuestions || [];
//     const query = {
//       topicID: maxTopicScoreObject.topicID,
//       _id: { $nin: completedQuestionIds },
//     };

//     question = await QuestionModel.findOne(query);

//     if (!question) {
//       if (!prevCompletedtopic.has(maxTopicScoreObject.topicID)) {
//         await UserModel.findByIdAndUpdate(userId, {
//           $addToSet: { completedtopic: maxTopicScoreObject.topicID },
//         });
//         prevCompletedtopic.add(maxTopicScoreObject.topicID);
//       }

//       const remainingTopics = getAllTheTopicLess100.filter(
//         (topic) => !prevCompletedtopic.has(topic.topicID),
//       );

//       if (remainingTopics.length === 0) {
//         return res.status(200).json({ message: 'All topics completed' });
//       }

//       maxTopicScoreObject = null;
//       maxAttempts--;
//     }
//   }

//   if (!question) {
//     return res.status(200).json({ message: 'No questions available' });
//   }

//   res.status(200).json({ question });
// });
const getQuestionData = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userID;

  const user = await UserModel.findById(userId);
  const prevcompletedtopic = user.completedtopic || [];

  const completedQuestionIds = user.attemptedQuestions || [];
  const query = {
    topicID: id,
    _id: { $nin: completedQuestionIds },
  };

  const question = await QuestionModel.findOne(query);
  if (!question) {
    await UserModel.findByIdAndUpdate(
      { _id: userId },
      { completedtopic: [...prevcompletedtopic, id] },
    );
    return next(new ApiError('not found', 404));
  }

  const response = new ApiResponse(201, 'success', { question });
  return res.status(201).json({ ...response });
});

/// get topic
const getTopicData = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userID;
  const user = await UserModel.findById(userId);
  const currentGoalId = user.sGoalId;
  const goal = await Goal.findOne({ creator: userId, sGoalId: currentGoalId });
  const pathOfTopic = goal.pathoftopic || [];
  const prevCompletedtopic = user.completedtopic || [];

  const getCourse = pathOfTopic.filter((course) => course?.coursesID == id);

  const getTopic = getCourse.length > 0 ? getCourse[0].topics : [];

  const getAllTheTopicLess100 = getTopic.filter(
    (topic) =>
      topic?.topicScore < 100 && !prevCompletedtopic.includes(topic.topicID),
  );

  if (getAllTheTopicLess100?.length <= 0) {
    const prevCompletedCourses = user.completedCourses || [];
    if (!prevCompletedCourses.includes(id)) {
      await UserModel.findByIdAndUpdate(
        { _id: userId },
        { completedCourses: [...prevCompletedCourses, id] },
      );
    }
    const response = new ApiResponse(201, 'courses completed');
    return res.status(201).json({ ...response });
  }

  let question = null;
  let maxTopicScoreObject = null;
  let maxTopicScore = -Infinity;
  console.log('getAllTheTopicLess100', getAllTheTopicLess100);
  for (const topic of getAllTheTopicLess100) {
    if (topic.topicScore > maxTopicScore) {
      maxTopicScore = topic.topicScore;
      maxTopicScoreObject = topic;
    }
  }

  console.log(maxTopicScoreObject.topicID);

  const topicIdWithMaxScore = maxTopicScoreObject.topicID;
  const response = new ApiResponse(201, 'success', {
    topicID: topicIdWithMaxScore,
  });
  return res.status(201).json({ ...response });
});

const UploadQuestionInCSV = AsyncHandler(async (req, res, next) => {
  const result = [];
  const pathname = `./public/tmp/${req.file.filename}`;
  fs.createReadStream(pathname)
    .pipe(CSV())
    .on('data', (data) => {
      // console.log("data", data);
      const modifyData = {
        email: 'arjunsen717@gmail.com',
        type: data?.Type ? data?.Type?.trim() : null,
        question: data?.Question ? [data?.Question?.trim()] : [],
        options: data?.Options
          ? data?.Options?.split(',').map((item) => item.trim())
          : [],
        answer: data?.Answer ? [data?.Answer?.trim()] : [],
        hint: data?.Hint ? [data?.Hint?.trim()] : [],
        solution: data?.Solution ? [data?.Solution?.trim()] : [],
        topic: data?.Topic
          ? data?.Topic?.split(',').map((item) => item.trim())
          : [],
        course: data?.Course
          ? data?.Course?.split(',').map((item) => item.trim())
          : [],
        goal: data?.Goals
          ? data?.Goals?.split(',').map((item) => item.trim())
          : [],
        weightage: data?.Weightage
          ? data?.Weightage?.split(',').map((item) => item.trim())
          : [],
        difficultyLevel: data[`Difficulty level`]
          ? +data[`Difficulty level`]
          : 0,
        geniusScore: data[`Genius Score`] ? [+data[`Genius Score`]] : [],
      };
      result.push(modifyData);
      // console.log("modifyData", modifyData);
    })
    .on('end', () => {
      console.log('uploaded', result);
      QuestionModel.insertMany(result)
        .then(() => {
          res.json({
            message:
              'CSV data successfully uploaded, processed, and stored in MongoDB',
          });
        })
        .catch((err) => {
          console.log('error', err);
          return next(new ApiError('Error storing data', 500));
        });
    });
});

//////////////////////////////////////////////////

const sumArray = (arr) => arr.reduce((sum, num) => sum + num, 0);
const findScore = async (topicId, email) => {
  const topicScore = await UserScore.findOne({ email, topicId });
  return topicScore?.topicScore || [];
};

const findTheTopic = async (pathScores, userEmail) => {
  for (let i = 0; i < pathScores.length; i++) {
    const topicIds = pathScores[i].path;
    for (let j = 0; j < topicIds.length; j++) {
      const id = topicIds[j]?.toString() || '';
      const score = await findScore(id, userEmail);
      const sum = sumArray(score);
      if (score < 100) {
        return id;
      }
    }
  }
  return -1;
};

const GetNextQuestion = AsyncHandler(async (req, res, next) => {
  const userID = req.userID;
  const user = await UserModel.findById(userID);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const currentGoal = user.sGoal;
  const courses = await Course.find({ contest: currentGoal });

  // Fetch graphs and paths for courses
  let graphs = [];
  for (const course of courses) {
    const graph = await Graph.findOne({ courseID: course._id });
    if (graph) {
      graphs.push(graph);
    }
  }

  // after getting data i need to filter out if any ourses completed user
  // choses random courses
  const randomCourses = graphs[Math.floor(Math.random() * graphs.length)];
  const topicPathOfTheCourses = randomCourses?.paths || []; // get paths of the courses
  const userEmail = user.email;

  // find that user path topic score
  const userTopicScore = await UserScore.find({ email: userEmail });
  const scoreMap = new Map(
    userTopicScore?.map((item) => [item._id?.toString(), item.topicScore]),
  );

  const pathScores = topicPathOfTheCourses?.map((path, index) => {
    const totalScore = path.reduce((sum, id) => {
      const makeString = id?.toString() || '';
      if (scoreMap.has(makeString)) {
        return sum + sumArray(scoreMap.get(makeString));
      }
      return sum;
    }, 0);
    return { index, path, totalScore };
  });

  pathScores?.sort((a, b) => b.totalScore - a.totalScore);

  pathScores?.forEach((pathScore) => {
    pathScore?.path?.sort((a, b) => {
      const stringA = a?.toString();
      const stringB = b?.toString();
      const topicScoreA = scoreMap.get(stringA) || [];
      const topicScoreB = scoreMap.get(stringB) || [];
      return sumArray(topicScoreB) - sumArray(topicScoreA);
    });
  });

  const topicId = await findTheTopic(pathScores, userEmail);

  if (topicId == -1) {
    return res.status(400).json({ message: 'No topic found' });
  }

  // get the question
  const question = await Question.find({ topicID: topicId?.toString() || '' });
  const randomQuestion = question[Math.floor(Math.random() * question.length)];

  return res.send({ randomQuestion });
});

// submit question

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year

  return `${day}/${month}/${year}`;
}

const SubmitQuestion = AsyncHandler(async (req, res, next) => {
  const userID = req.userID;
  const { questionStatus, questionID, time } = req.body;

  const user = await UserModel.findById(userID);
  const correntGoal = user.sGoalId;
  const question = await QuestionModel.findById(questionID);

  if (!user || !question) {
    return next(new ApiError('User or Question not found', 404));
  }

  const isCompleted = user.attemptedQuestions.includes(questionID);

  if (isCompleted) {
    return next(new ApiError('You already completed', 401));
  }

  const userAttempted = user.attemptedQuestions || [];
  const userCorrect = user.currectQuestions || [];
  const userWrong = user.wrongQuestions || [];
  const userSkip = user.skipQuestions || [];

  const today = new Date();
  const formattedDate = formatDate(today);

  const userHistory = await Userhistory.findOne({
    creator: userID,
    goalID: correntGoal,
    date: formattedDate,
  });

  if (questionStatus == 'correct') {
    userCorrect.push(questionID);
    console.log(questionID, time, userID, formattedDate);
  } else if (questionStatus == 'incorrect') {
    userWrong.push(questionID);
  } else if (questionStatus == 'skip') {
    userSkip.push(questionID);
  }

  if (!userHistory) {
    const correct = [];
    const wrong = [];
    const skip = [];
    if (questionStatus == 'correct') {
      correct.push(questionID);
    } else if (questionStatus == 'incorrect') {
      wrong.push(questionID);
    } else if (questionStatus == 'skip') {
      skip.push(questionID);
    }
    await Userhistory.create({
      creator: userID,
      goalID: correntGoal,
      date: formattedDate,
      attemptedQuestions: [questionID],
      attemptedQuestionTimeInSec: [time],
      currectQuestions : correct,
      wrongQuestions : wrong,
      skipQuestions : skip,
    });
  }else{
    const prevcorrect =userHistory.currectQuestions || [];
    const prevwrong =userHistory.wrongQuestions || [];
    const prevskip =userHistory.skipQuestions || [];
    const prevAttQuestion = userHistory.attemptedQuestions || [];
    const prevAttQuestionInSec =userHistory.attemptedQuestionTimeInSec || []
    if (questionStatus == 'correct') {
      prevcorrect.push(questionID);
    } else if (questionStatus == 'incorrect') {
      prevwrong.push(questionID);
    } else if (questionStatus == 'skip') {
      prevskip.push(questionID);
    }
    prevAttQuestion.push(questionID);
    prevAttQuestionInSec.push(time)
    await Userhistory.findByIdAndUpdate({_id : userHistory._id}, {
      attemptedQuestions: prevAttQuestion,
      attemptedQuestionTimeInSec: prevAttQuestionInSec,
      currectQuestions : prevcorrect,
      wrongQuestions : prevwrong,
      skipQuestions : prevskip,
    })
  }

  userAttempted.push(questionID);

  const userGoal = await Goal.find({ creator: userID });

  userGoal?.forEach((goal) => {
    goal?.pathoftopic?.forEach((course) => {
      course?.topics?.forEach((topic) => {
        // console.log(topic?.topicID, question.topicID.includes(topic?.topicID));
        if (question?.topicID.includes(topic?.topicID)) {
          const d = question?.difficultyLevel || 0;
          const w = Number(question?.weightage[0]) || 0;
          if (questionStatus == 'correct') {
            topic.topicScore = (topic.topicScore || 0) + (d * w) / 100;
          } else {
            topic.topicScore = (topic.topicScore || 0) - (d * w) / 100;
          }
        }
      });
    });
  });

  await Promise.all(userGoal.map((goal) => goal.save()));

  const updateUser = await UserModel.findByIdAndUpdate(userID, {
    attemptedQuestions: userAttempted,
    currectQuestions: userCorrect,
    wrongQuestions: userWrong,
    skipQuestions: userSkip,
  });

  // when every thing done update the user collection
  await UserModel.findByIdAndUpdate(
    { _id: userID },
    {
      attemptedQuestions: user.attemptedQuestions,
      wrongQuestions: user.wrongQuestions,
      currectQuestions: user.currectQuestions,
    },
  );

  const response_data = {
    ans: questionStatus,
    userGoal,
  };
  const response = new ApiResponse(201, 'Success', response_data);
  return res.status(201).json({ ...response });
});

export {
  UploadQuestionInCSV,
  GetNextQuestion,
  SubmitQuestion,
  getQuestionData,
  getTopicData,
};
