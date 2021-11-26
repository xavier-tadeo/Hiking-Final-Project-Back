import { Response, Request } from "express";
import HikingModel from "../../database/models/hiking";
import {
  hikeCreate,
  hikeDelete,
  hikeGet,
  hikeGetOne,
  hikeUpdate,
} from "./hikeController";

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
        images: "url",
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
        hikeTitle: "Guinardo",
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

describe("Given a hikeDelete function", () => {
  describe("When it receives a req with params and this hike existing", () => {
    test("Then should invoke res.json with id hike and delete it", async () => {
      const req = {} as Request;
      req.params = { hikeId: "10" };
      const res = mockResponse();

      HikingModel.findByIdAndDelete = jest.fn().mockResolvedValue({});

      await hikeDelete(req, res, null);

      expect(HikingModel.findByIdAndDelete).toHaveBeenCalledWith(
        req.params.hikeId
      );
    });
  });

  describe("When it receives a req with params but this don t exist", () => {
    test("Then should invoke next with error", async () => {
      const req = {} as Request;
      req.params = { hikeId: "10" };
      const next = jest.fn();
      const error = new CodeError("Hike not Found");
      error.code = 404;

      HikingModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await hikeDelete(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When request it s fail", () => {
    test("Then should invoke next function with message Faild Request and code 400", async () => {
      const req = {} as Request;
      req.params = { hikeId: "10" };
      const next = jest.fn();
      const error = new CodeError("Faild Request :(");
      error.code = 400;

      HikingModel.findByIdAndDelete = jest.fn().mockRejectedValue(new Error());

      await hikeDelete(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
});

describe("Given a hikeUpdate function", () => {
  describe("When it receives a req with params id", () => {
    test("Then it should invoke res.json with a hike change", async () => {
      const hike = { id: "10", name: "Guinardo new excursion" };
      const res = mockResponse();
      const req = {} as Request;
      req.body = { name: "new name" };
      req.params = { hikeId: "10" };
      HikingModel.findByIdAndUpdate = jest.fn().mockResolvedValue(hike);

      await hikeUpdate(req, res, null);

      expect(HikingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.hikeId,
        req.body,
        {
          new: true,
        }
      );
      expect(res.json).toHaveBeenCalledWith(hike);
    });
  });

  describe("When it receives a request without hikeId", () => {
    test("Then it should invoke the next function with a error", async () => {
      const req = {} as Request;
      req.params = { hikeId: "666" };
      const error = new CodeError();
      error.code = 404;
      error.message = "Not found hike???";
      const next = jest.fn();
      HikingModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error());

      await hikeUpdate(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a hikeGetOne function", () => {
  describe("When it receives a req.params with id hike", () => {
    test("Then it should invoke res.json with hike id", async () => {
      const hike = { id: "10", name: "Guinardo new excursion" };
      const res = mockResponse();
      const req = {} as Request;
      req.params = { hikeId: "10" };
      HikingModel.findById = jest.fn().mockResolvedValue(hike);

      await hikeGetOne(req, res, null);

      expect(res.json).toHaveBeenCalledWith(hike);
    });
  });
});
