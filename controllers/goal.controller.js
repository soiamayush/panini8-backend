import { Course } from '../models/course.model.js';
import { Goal } from '../models/goal.model.js';
import { PredefineGoalModel } from '../models/preDefineGoal.model.js';
import { Topic } from '../models/topic.model.js';
import { UserModel } from '../models/user.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AsyncHandler } from '../utils/asyncHandler.js';

// const selectedGoalData = AsyncHandler(async (req, res) => {
//   const userId = req.userID;

//   try {
//     // Find the user by ID
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).send({ message: 'User not found' });
//     }

//     // Find goals with the current sGoal and userId
//     const goals = await Goal.find({ creator: userId, sGoal: user.sGoal });

//     // Function to get the course ID with the maximum score, the topic ID with the maximum score, and the total score
//     const getMaxScoreCourseAndTopic = (pathoftopic) => {
//       return pathoftopic.reduce(
//         (acc, course) => {
//           const totalCourseScore = course.topics.reduce(
//             (sum, topic) => sum + topic.topicScore,
//             0,
//           );

//           if (totalCourseScore > acc.maxCourseScore) {
//             const maxTopic = course.topics.reduce(
//               (max, topic) => (topic.topicScore > max.topicScore ? topic : max),
//               { topicScore: -1 },
//             );

//             return {
//               maxCourseScore: totalCourseScore,
//               maxScoreCourseID: course.coursesID,
//               maxScoreTopicID: maxTopic.topicID,
//               totalCourseScore,
//             };
//           }

//           return acc;
//         },
//         { maxCourseScore: -1 },
//       );
//     };

//     // Function to find courses where all topics have a score >= 100
//     const findCourseIdsWithAllTopicScoresAbove100 = (pathoftopic) => {
//       const result = pathoftopic.filter((course) => {
//         return (
//           course.topics &&
//           course.topics.every((topic) => topic.topicScore >= 100)
//         );
//       });

//       return result.map((course) => course.coursesID);
//     };

//     // Find the goal with the max score course ID, max score topic ID, and total score
//     let filterPathOfTopic = [];
//     const { maxScoreCourseID, maxScoreTopicID, totalCourseScore } =
//       goals.reduce(
//         (acc, goal) => {
//           const topicPath = goal.pathoftopic || [];
//           filterPathOfTopic = topicPath.filter((courses) => {
//             return !user?.completedCourses?.includes(courses?.coursesID);
//           });
//           const result = getMaxScoreCourseAndTopic(filterPathOfTopic);

//           return result.maxCourseScore > acc.maxCourseScore ? result : acc;
//         },
//         { maxCourseScore: -1 },
//       );

//     // Find and log courses with all topic scores >= 100
//     const courseIdsWithHighScores = goals.reduce((acc, goal) => {
//       const courseIds =
//         findCourseIdsWithAllTopicScoresAbove100(filterPathOfTopic);
//       return acc.concat(courseIds);
//     }, []);
//     console.log('hello', courseIdsWithHighScores);

//     if (courseIdsWithHighScores.length > 0) {
//       console.log(
//         'Courses with all topic scores >= 100:',
//         courseIdsWithHighScores,
//       );
//       await UserModel.findByIdAndUpdate(userId, {
//         completedCourses: [
//           ...courseIdsWithHighScores,
//           ...user.completedCourses,
//         ],
//       });
//     } else {
//       console.log('No courses found with all topic scores >= 100.');
//     }

//     // Retrieve the topic and course details
//     const [course, maxScoredTopic] = await Promise.all([
//       Course.findOne({ _id: maxScoreCourseID }),
//       Topic.findById(maxScoreTopicID),
//     ]);

//     // Return the course, topic ID with the maximum topic score, and total score
//     res.status(200).send({ course, totalCourseScore, maxScoredTopic });
//   } catch (error) {
//     res
//       .status(500)
//       .send({ message: 'Internal server error', error: error.message });
//   }
// });
const selectedGoalData = AsyncHandler(async (req, res, next) => {
  const userId = req.userID;
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  // Find goals with the current sGoal and userId
  const goals = await Goal.findOne({ creator: userId, sGoal: user.sGoal });
  // courses with score
  const coursesWithScore = goals?.pathoftopic?.map((course) => {
    return {
      coursesID: course.coursesID,
      score: course?.topics.reduce((accumulator, currentObject) => {
        return accumulator + currentObject.topicScore;
      }, 0),
    };
  });
  let mini = Number.MIN_SAFE_INTEGER;

  const desiredCourse = coursesWithScore
    .filter((elem) => {
      return (
        !user.completedCourses.includes(elem?.coursesID) && elem.score > mini
      );
    })
    .reduce(
      (maxElem, currentElem) => {
        return currentElem.score > maxElem.score ? currentElem : maxElem;
      },
      { score: mini },
    );

  // Extracting the course ID with the maximum score
  const courseid = desiredCourse.coursesID;
  const totalCourseScore = desiredCourse.score;
  const course = await Course.findById(courseid);

  return res.json({ course: course, totalCourseScore });
});

const createUserGoal = AsyncHandler(async (req, res, next) => {
  const { goalId } = req.params;
  const userID = req.userID;

  const isGoalExistsThatUser = await Goal.findOne({
    sGoalId: goalId,
    creator: userID,
  });

  const goal = await PredefineGoalModel.findById(goalId);
  const user = await UserModel.findById(userID);
  const course = await Course.find({ goalIds: goalId }).select(
    '-contest -course -createdAt -__v -goalIds -email',
  );

  if (isGoalExistsThatUser) {
    const data = {
      sGoal: goal.name,
      sGoalId: goalId,
    };
    const updateUser = await UserModel.findByIdAndUpdate({ _id: userID }, data);
    const response = new ApiResponse(201, 'Successfully change');
    return res.status(201).json({ ...response });
  }

  // data
  const data = {
    creator: userID,
    email: user.email,
    sGoalId: goalId,
    sGoal: goal.name,
    courseDetails: course,
    pathoftopic: course?.map((ele) => {
      return {
        coursesID: ele?._id,
        topics: ele?.topicId?.map((topic) => {
          return {
            topicID: topic,
            topicScore: 0,
          };
        }),
      };
    }),
  };

  const createGoal = await Goal.create(data);

  const updateUser = await UserModel.findByIdAndUpdate(
    { _id: userID },
    { sGoal: createGoal.sGoal, sGoalId: goalId },
  );

  const response_data = {
    goal: createGoal,
    user: updateUser,
  };
  const response = new ApiResponse(201, 'Success', response_data);
  return res.status(201).json({ ...response });
});

export { createUserGoal, selectedGoalData };
