import dotenv from "dotenv";

dotenv.config();

import jwt from "jsonwebtoken";

class ErrorCode extends Error {
  code: number | undefined;
}

const auth = (req, res, next) => {
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
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = { id };
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
