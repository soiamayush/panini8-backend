import { AskQuestionModel } from '../models/askquestion.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AsyncHandler } from '../utils/asyncHandler.js';

const AddAskQuestion = AsyncHandler(async (req, res, next) => {
  const userID = req.userID;
  const { questionID, title, description, tags = [] } = req.body;
  const create = await AskQuestionModel.create({
    creator: userID,
    questionID,
    title,
    description,
    tags,
  });
  const response_data = {
    askquestion: create,
  };
  const response = new ApiResponse(201, 'Successfully added!', response_data);
  return res.status(201).json({ ...response });
});

const GetAskQuestion = AsyncHandler(async (req, res, next) => {
  const { page, limit, fields, select } = req.query;
  let askquestion = AskQuestionModel.find();

  if (fields) {
    askquestion = askquestion.populate(fields.split(',').join(' '));
  }

  if (select) {
    askquestion = askquestion.select(select.split(',').join(' '));
  }

  if (page || limit) {
    askquestion = askquestion.skip((page - 1) * limit).limit(limit);
  }

  const total = await AskQuestionModel.countDocuments();

  askquestion = await askquestion;
  const response_data = {
    askquestion,
    meta: {
      total_count: total,
    },
  };
  const response = new ApiResponse(201, 'success', response_data);
  return res.status(201).json({ ...response });
});

const GetSingleAskQuestion = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { fields, select } = req.query;
  let askquestion = AskQuestionModel.findOne({ _id: id });
  if (fields) {
    askquestion = askquestion.populate(fields.split(',').join(' '));
  }

  if (select) {
    askquestion = askquestion.select(select.split(',').join(' '));
  }
  askquestion = await askquestion;
  const response_data = {
    askquestion,
  };
  const response = new ApiResponse(201, 'success', response_data);
  return res.status(201).json({ ...response });
});

export { AddAskQuestion, GetAskQuestion, GetSingleAskQuestion };
