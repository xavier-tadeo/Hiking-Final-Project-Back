import express from "express";

import HikingModel from "../../database/models/hiking";
import UserModel from "../../database/models/user";

class ErrorCode extends Error {
  code: number | undefined;
}
interface RequestAuth extends express.Request {
  userId?: string;
  name?: string;
  file?: any;
}

export const hikeCreate = async (
  req: RequestAuth,
  res: express.Response,
  next: express.NextFunction
) => {
  const hikeBody = req.body;
  try {
    const newHike = await HikingModel.create({
      ...hikeBody,
      user: req.userId,
    });
    const user = await UserModel.findById(req.userId);
    // eslint-disable-next-line no-underscore-dangle
    user.yourRoutes.push(newHike._id);
    await user.save();
    res.status(201).json(newHike);
  } catch (error) {
    error.code = 400;
    error.message = "Bad create routes";
    next(error);
  }
};

export const hikeGet = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const hikingAll = await HikingModel.find().populate("user", "name");
    res.status(200).json(hikingAll);
  } catch (error) {
    error.code = 404;
    error.message = "Not found anything!";
    next(error);
  }
};

export const hikeDelete = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { hikeId } = req.params;
  try {
    const searchHike = await HikingModel.findByIdAndDelete(hikeId);
    if (searchHike) {
      res.json({ id: searchHike.id });
    } else {
      const error = new ErrorCode("Hike not Found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Faild Request :(";
    next(error);
  }
};

export const hikeUpdate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { hikeId } = req.params;
  try {
    const updateHike = await HikingModel.findByIdAndUpdate(hikeId, req.body, {
      new: true,
    });
    res.json(updateHike);
  } catch (error) {
    error.code = 404;
    error.message = "Not found hike???";
    next(error);
  }
};

export const hikeGetOne = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { hikeId } = req.params;
  try {
    const searchHike = await HikingModel.findById(hikeId);
    res.json(searchHike);
  } catch (error) {
    error.code = 404;
    error.message = "Not found anything!";
    next(error);
  }
};
