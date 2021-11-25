import dotenv from "dotenv";
import express from "express";

dotenv.config();

import jwt from "jsonwebtoken";

interface RequestAuth extends express.Request {
  userId?: string;
}
class ErrorCode extends Error {
  code: number | undefined;
}

const auth = (
  req: RequestAuth,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new ErrorCode("Error!Stop!");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new ErrorCode("Wrong broken!");
      error.code = 401;
      next(error);
    } else {
      try {
        const user = jwt.verify(token, process.env.SECRET);
        req.userId = user.id;
        next();
      } catch {
        const error = new ErrorCode("Wrong!!!Stop");
        error.code = 401;
        next(error);
      }
    }
  }
};
export default auth;
