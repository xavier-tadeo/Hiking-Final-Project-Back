import express from "express";

import HikingModel from "../../database/models/hiking";

class ErrorCode extends Error {
  code: number | undefined;
}

export const hikeCreate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { title, description, map, stadistics, images } = req.body;
  try {
    const newHike = await HikingModel.create({
      title,
      description,
      map,
      images,
      stadistics,
    });
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
    const hikingAll = await HikingModel.find().populate({
      path: "user",
      select: "name",
    });
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
