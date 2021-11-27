import { Request } from "express";
import checkUser from "./checkUser";

export interface RequestWithAuth extends Request {
  email?: string;
  userId?: string;
  name?: string;
}

class ErrorCode extends Error {
  code: number | undefined;
}

const mockRequest = () => {
  const req = {} as RequestWithAuth;

  return req;
};

describe("Given a checkUser function", () => {
  describe("When receives a request with a request params and userID to be equals", () => {
    test("Then should invoke the next function", async () => {
      const req = mockRequest();
      req.params = { userId: "12345567" };
      req.userId = "12345567";
      const user = req.params.userId;
      const userLogin = req.userId;
      const next = jest.fn();

      await checkUser(req, null, next);

      expect(user).toBe(userLogin);
      expect(next).toHaveBeenCalled();
    });
  });
  describe("When receives a request with a request params not match with userId", () => {
    test("Then it should invoke next function with error", async () => {
      const req = mockRequest();
      req.params = { userId: "12345567" };
      req.userId = "no";

      const next = jest.fn();
      const error = new ErrorCode();
      error.message = "You I can't";
      error.code = 401;

      await checkUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
