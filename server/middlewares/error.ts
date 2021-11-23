import * as express from "express";

const debug = require("debug")("hiking:errors");
const chalk = require("chalk");
const { ValidationError } = require("express-validation");

const notFoundErrorHandler = (req, res) => {
  debug(chalk.red("Not found (404)"));
  res.status(404).json({ error: "Endpoint not found 404" });
};

const generalErrorHandler = (
  error: { message: String; code: number },
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: any
) => {
  if (error instanceof ValidationError) {
    error.code = 400;
    error.message = "Bad Validation ಥ,_｣ಥ";
  }
  debug(chalk.red(`Error: ${error.message}`));
  const message = error.code ? error.message : "General pete";
  res.status(error.code || 500).json({ error: message });
};

export = { notFoundErrorHandler, generalErrorHandler };
