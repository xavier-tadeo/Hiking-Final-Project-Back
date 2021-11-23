const { ValidationError } = require("express-validation");
const { notFoundErrorHandler, generalErrorHandler } = require("./error");

interface IResponseTest {
  status: () => void;
  json: () => void;
}

const mockResponse = () => {
  const res: IResponseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given a notFoundErrorHandler middleware", () => {
  describe("When it receives an object res", () => {
    test("Then it should send a response with a 'Endpoint not found' error and status code of 404", async () => {
      const res = mockResponse();
      const req = {};
      const expectedError = { error: "Endpoint not found 404" };

      await notFoundErrorHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given an errorHandler middleware", () => {
  describe("When it gets a request and an error and no error code", () => {
    test("Then it should send a response with a 'General pete' error and a status code of 500", async () => {
      const res = mockResponse();
      const error = { error: "General pete" };
      const req = {};
      const next = () => {};

      await generalErrorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe("When it gets a request and a Validation error", () => {
    test("Then it should send a response with a 'Bad Validation ಥ,_｣ಥ' message and a status code of 400", async () => {
      const res = mockResponse();
      const error = new ValidationError("details", {
        error: new Error(),
        statusCode: 400,
      });

      const req = {};
      const next = () => {};

      await generalErrorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Bad Validation ಥ,_｣ಥ" });
    });
  });
});
