import express from "express";

export interface RequestWithAuth extends express.Request {
  email?: string;
  idUser?: string;
  name?: string;
}

class ErrorCode extends Error {
  code: number | undefined;
}

const checkUser = async (req: RequestWithAuth, res: express.Response, next) => {
  const { idUser } = req.params;
  if (req.idUser === idUser) {
    return next();
  }
  const error = new ErrorCode();
  error.code = 401;
  error.message = "You I can't";
  next(error);
};

export default checkUser;
