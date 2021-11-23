import dotenv from "dotenv";

dotenv.config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../../database/models/user";

import { userCreate, userLogin } from "./userController";

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
  describe("When receives a request without username", () => {
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
  describe("When receives a username but not good password", () => {
    test("It should invoke the next function with error, message 'Something wrong!!'", async () => {
      const req = {
        body: {
          username: "Yoooo",
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
  describe("When receives a good username and password", () => {
    test("It should with invoke a res.json with token", async () => {
      UserModel.findOne = jest.fn().mockResolvedValue({
        username: "Arlet",
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
