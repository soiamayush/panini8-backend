import { Goal } from '../models/goal.model.js';
import { Userhistory } from '../models/history.model.js';
import { UserModel } from '../models/user.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AsyncHandler } from '../utils/asyncHandler.js';

const getUserProgress = AsyncHandler(async (req, res, next) => {
  const userID = req.userID;
  const user = await UserModel.findOne({ _id: userID });
  const userCorrentGoal = await Goal.findOne({
    creator: userID,
    sGoal: user?.sGoal,
  }).populate('pathoftopic.coursesID pathoftopic.topics.topicID');
  /// progress of corrent goal start
  const pathoftopic = userCorrentGoal?.pathoftopic || [];
  const pathoftopic_progress_data = pathoftopic?.map((ele) => {
    return {
      course_id: ele?.coursesID?._id,
      course_name: ele?.coursesID?.course,
      total_topic_score: ele?.topics?.length * 100,
      user_score: ele?.topics.reduce((sum, topic) => sum + topic.topicScore, 0),
    };
  });

  const totalTopicScore = pathoftopic_progress_data.reduce(
    (sum, course) => sum + course.total_topic_score,
    0,
  );
  const totalUserScore = pathoftopic_progress_data.reduce(
    (sum, course) => sum + course.user_score,
    0,
  );
  const percentage = (totalUserScore / totalTopicScore) * 100;

  /// progress of corrent goal end
  const modules = pathoftopic_progress_data?.map((ele) => {
    const userScore = ele?.user_score || 0;
    const totalTopic = ele?.total_topic_score || 0;
    if (userScore !== 0 && totalTopic !== 0) {
      return {
        course_name: ele.course_name,
        course_id: ele?.course_id,
        percentage: ((userScore / totalTopic) * 100).toFixed(2),
      };
    }
  });

  // strength
  const strength = [];
  const weekness = [];
  const topics_data = [];

  pathoftopic?.forEach((course) => {
    course?.topics?.forEach((topic) => {
      topics_data.push(topic);
    });
  });

  const sortedData = topics_data?.sort((a, b) => b.topicScore - a.topicScore);

  // Get the top 5 topics with the highest topicScore
  const top5HighestScores = sortedData.slice(0, 5);
  top5HighestScores?.forEach((ele) => {
    strength.push(ele.topicID.topic);
  });

  // Get the top 5 topics with the lowest topicScore
  const top5LowestScores = sortedData.slice(-5).reverse();
  top5LowestScores?.forEach((ele) => {
    weekness.push(ele.topicID.topic);
  });

  // history

  const userHistory = await Userhistory.find({
    creator: userID,
    goalID: user.sGoalId,
  });

  const response_data = {
    corrent_goal: { name: user?.sGoal, progress: percentage.toFixed(2) },
    firstname: user?.firstname,
    lastname: user?.lastname,
    strength,
    weekness,
    history: userHistory,
    modules,
    // pathoftopic_progress_data
    // pathoftopic
    // user,
  };
  const response = new ApiResponse(201, 'Success', response_data);
  return res.status(201).json({ ...response });
});

export { getUserProgress };
