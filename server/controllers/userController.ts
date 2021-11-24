import dotenv from "dotenv";

dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import UserModel from "../../database/models/user";

class ErrorCode extends Error {
  code: number | undefined;
}

export const userCreate = async (req, res, next) => {
  const { name, password, email } = req.body;
  try {
    const newUser = await UserModel.create({
      name,
      password: await bcrypt.hash(password, 10),
      email,
    });
    res.json(newUser);
  } catch (error) {
    error.code = 400;
    error.message = "Not good something error";
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  const { name, password } = req.body;
  const user = await UserModel.findOne({ name });
  if (!user) {
    const error = new ErrorCode("Wrong no found!");
    error.code = 401;
    next(error);
  } else {
    const goodpassword = await bcrypt.compare(password, user.password);
    if (!goodpassword) {
      const error = new ErrorCode("Something wrong!!");
      error.code = 401;
      next(error);
    } else {
      const token = jwt.sign(
        {
          name: user.name,
          id: user.id,
        },
        process.env.SECRET
      );

      res.json({ token });
    }
  }
};

export const userDelete = async (req, res, next) => {
  const { idUser } = req.params;
  try {
    const searchUser = await UserModel.findByIdAndDelete(idUser);
    if (searchUser) {
      res.json({ id: searchUser.id });
    } else {
      const error = new ErrorCode("User not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Bad request";
    next(error);
  }
};

export const userUpdate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { idUser } = req.params;
  try {
    const updateUser = await UserModel.findByIdAndUpdate(idUser, req.body, {
      new: true,
    });
    res.json(updateUser);
  } catch (error) {
    error.code = 404;
    error.message = "Don't change user";
    next(error);
  }
};
