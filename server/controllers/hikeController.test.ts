import { Response } from "express";
import HikingModel from "../../database/models/hiking";
import { hikeGet } from "./hikeController";

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

class CodeError extends Error {
  code: number | undefined;
}

describe("Given hikeGet function", () => {
  describe("When it receives a request with method get and status 200", () => {
    test("It should invoke a method json with array of hike", async () => {
      const hiking = [{}, {}];
      const res = mockResponse();
      const next = jest.fn();

      HikingModel.find = jest.fn().mockResolvedValue([{}, {}]);

      await hikeGet(null, res, next);

      expect(res.json).toBeCalledWith(hiking);
    });
  });
  describe("When don t receives a array", () => {
    test("It should invoke the next function with a error", async () => {
      const res = mockResponse();
      const next = jest.fn();
      const error = new CodeError();

      HikingModel.find = jest.fn().mockRejectedValue(error);

      await hikeGet(null, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Not found anything!"
      );
    });
  });
});
