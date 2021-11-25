import jwt from "jsonwebtoken";
import { Request } from "express";
import auth from "./auth";

jest.mock("jsonwebtoken");

const mockRequest = () => {
  const req = {} as Request;
  return req;
};

class ErrorCode extends Error {
  code: number | undefined;
}

describe("Given the auth function", () => {
  describe("When it receives a req without autorization", () => {
    test("Then it should invoke a next function with error", () => {
      const req = mockRequest();
      req.header = jest.fn();
      const next = jest.fn();
      const error = new ErrorCode("Error!Stop!");
      error.code = 401;

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a authorization but wrong token", () => {
    test("Then it should invoke a next function with error", () => {
      const req = mockRequest();
      req.header = jest.fn().mockReturnValue("arlet");
      const next = jest.fn();
      const error = new ErrorCode("Wrong broken!");
      error.code = 401;

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When receives a authorization and token ok", () => {
    test("Then it should invoke next function without error", () => {
      const req = mockRequest();
      req.header = jest.fn().mockReturnValue("de arlet");
      const next = jest.fn();
      jwt.verify = jest.fn().mockReturnValue({});
      const error = new ErrorCode("Wrong!!!Stop");
      error.code = 401;

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a authorization and wrong token", () => {
    test("Then it should invoke the next function with error", () => {
      const req = mockRequest();
      req.header = jest.fn().mockReturnValue("de arlet");
      const next = jest.fn();
      jwt.verify = jest.fn().mockReturnValue(null);
      const error = new ErrorCode("Wrong!!!Stop");
      error.code = 401;

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
});
