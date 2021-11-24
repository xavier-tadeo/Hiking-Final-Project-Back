import dotenv from "dotenv";

dotenv.config();
import { Response, Request } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../../database/models/user";

import {
  userCreate,
  userDelete,
  userLogin,
  userUpdate,
} from "./userController";

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Given a userCreate function", () => {
  describe("When receives a request without something user required", () => {
    test("It should invoke the next function with error, code 400 and message 'Not good something error'", async () => {
      const req = {
        body: {
          name: "Arlet",
          password: "Arlet",
          email: "arlet@arlet.com",
        },
      };
      const next = jest.fn();
      UserModel.create = jest.fn().mockResolvedValue(req.body);
      const error = new Error("Not good something error");

      await userCreate(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
    });
  });
  describe("When it receives a good request", () => {
    test("It should response a status 201 and newUser in json", async () => {
      const req = {
        body: {
          name: "Arlet",
          password: await bcrypt.hash("Arlet", 10),
          email: "arlet@arlet.com",
        },
      };

      const res = {
        json: jest.fn().mockResolvedValue(req.body),
      };
      UserModel.create = jest.fn().mockResolvedValue(req.body);

      await userCreate(req, res, null);

      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });
});

describe("Given a userLogin function", () => {
  describe("When receives a request without name", () => {
    test("It should invoke next function with error, message 'Wrong no found!' and code 401", async () => {
      const req = {
        body: jest.fn(),
      };
      const next = jest.fn();
      UserModel.findOne = jest.fn().mockResolvedValue(false);
      const error = new Error("Wrong no found!");

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe("When receives a name but not good password", () => {
    test("It should invoke the next function with error, message 'Something wrong!!'", async () => {
      const req = {
        body: {
          name: "Yoooo",
        },
      };
      const next = jest.fn();
      UserModel.findOne = jest.fn().mockResolvedValue(req.body);
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const error = new Error("Something wrong!!");

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe("When receives a good name and password", () => {
    test("It should with invoke a res.json with token", async () => {
      UserModel.findOne = jest.fn().mockResolvedValue({
        name: "Arlet",
        password: "Arlet",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const expectedToken = "Tadeoo";
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      const res = {
        json: jest.fn(),
      };
      const req = {
        body: {
          username: "Arlet",
          password: "Arlet",
        },
      };
      const expectedResponse = {
        token: expectedToken,
      };

      await userLogin(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

describe("Given a deleteUser function", () => {
  describe("When it receives a request with an id 1, a response and a next function", () => {
    test("Then it should call the UserModel.findByIdAndDelete with a 1 and delete", async () => {
      const idUser = 1;
      const req = {
        params: {
          idUser,
        },
      };
      const res = {
        json: () => {},
      };
      const next = () => {};
      UserModel.findByIdAndDelete = jest.fn().mockResolvedValue({});

      await userDelete(req, res, next);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(idUser);
    });
  });

  describe("And UserModel.findByIdAndDelete rejects", () => {
    test("Then it should call next with an error", async () => {
      const error = {};
      UserModel.findByIdAndDelete = jest.fn().mockRejectedValue(error);
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {};
      const next = jest.fn();

      await userDelete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("code");
    });
  });

  describe("And UserModel.findByIdAndDelete returns undefined", () => {
    test("Then it should call next with an error", async () => {
      const error = new Error("User not found");
      UserModel.findByIdAndDelete = jest.fn().mockResolvedValue(undefined);
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {};
      const next = jest.fn();

      await userDelete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given userUpdate function", () => {
  describe("When it receives a req.params with a userId for change something", () => {
    test("It should invoke a res.json with change user", async () => {
      const existingUser = {
        id: "10",
        name: "Arlet",
        password: "Arlet",
        email: "arlet@arlet.com",
      };
      const res = {} as Response;
      const req = {} as Request;
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();
      req.body = { pasword: "tadeo", email: "arlet@tadeo.com" };
      req.params = { idUser: "10" };
      UserModel.findByIdAndUpdate = jest.fn().mockResolvedValue(existingUser);

      await userUpdate(req, res, null);

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.idUser,
        req.body,
        {
          new: true,
        }
      );
      expect(res.json).toHaveBeenCalledWith(existingUser);
    });
  });
  describe("When it'receives a wrong idUser", () => {
    test("Then it should invoke next with an error", async () => {
      const res = {} as Response;
      const req = {} as Request;
      req.body = { age: 10 };
      req.params = { idUser: "1234" };
      const error: {
        message: string;
        code?: number;
      } = new Error();
      error.code = 400;
      error.message = "Don't change user";
      const next = jest.fn();
      UserModel.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await userUpdate(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
