import dotenv from "dotenv";

dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../../database/models/user";

class ErrorCode extends Error {
  code: number | undefined;
}

const userCreate = async (req, res, next) => {
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

const userLogin = async (req, res, next) => {
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
        process.env.JWT_SECRET
      );

      res.json({ token });
    }
  }
};

export default { userCreate, userLogin };
