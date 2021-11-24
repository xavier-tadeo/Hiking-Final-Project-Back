import express from "express";

import HikingModel from "../../database/models/hiking";

const hikeCreate = async (
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

export default hikeCreate;
