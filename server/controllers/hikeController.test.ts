import { Response, Request } from "express";
import HikingModel from "../../database/models/hiking";
import { hikeCreate, hikeGet } from "./hikeController";

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

      HikingModel.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(hiking) });

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

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Not found anything!"
      );
    });
  });
});

describe("Given hikeCreate function", () => {
  describe("When receives a request with new hike", () => {
    test("Then it should invoke the method json with a new hike", async () => {
      const reqBody = {
        title: "Guinardo",
        description: "Muy buena ruta",
        map: 543445,
        images: ["url"],
        stadistics: 5,
      };
      const body: any = reqBody;
      const req = {
        body,
      } as Request;
      const res = mockResponse();
      const status = 201;
      const next = jest.fn();

      HikingModel.create = jest.fn().mockResolvedValue(reqBody);

      await hikeCreate(req, res, next);

      expect(res.json).toHaveBeenCalledWith(reqBody);
      expect(res.status).toHaveBeenCalledWith(status);
    });
  });
  describe("When reject promese", () => {
    test("It should invoke the next function with error, code 400 and message 'Bad create routes'", async () => {
      const requestBody = {
        tattooStyles: "realista",
        image: "url",
      };

      const req = {
        body: requestBody,
      } as Request;

      const res = mockResponse();
      const error = new Error();
      const next = jest.fn();

      HikingModel.create = jest.fn().mockRejectedValue(error);

      await hikeCreate(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Bad create routes"
      );
    });
  });
});
