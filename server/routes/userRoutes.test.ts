import dotenv from "dotenv";

dotenv.config();
import Debug from "debug";
import chalk from "chalk";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import supertest from "supertest";

import { app, initializeServer } from "..";
import initiateDB from "../../database";
import UserModel from "../../database/models/user";

const debug = Debug("hiking:superTest");

const request = supertest(app);
jest.setTimeout(10000);

let server;

beforeAll(async () => {
  await initiateDB(process.env.MONGODB_STRING_TEST);
  server = await initializeServer(6000);
  await UserModel.deleteMany({});
  await UserModel.create({
    name: "Arlet",
    password: await bcrypt.hash("Arlet", 10),
    email: "arlet@arlet.com",
  });
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    debug(chalk.red("Server conection close"));
    done();
  });
});
beforeEach(async () => {
  await UserModel.create({
    name: "Sonia",
    password: await bcrypt.hash("Sonia", 10),
    email: "arlet@arlet.com",
  });
});

describe("Given a route /user/login", () => {
  describe("When a method POST request arrives", () => {
    test("Then it should respond with a response and code 200", async () => {
      await request
        .post("/user/login")
        .send({ name: "Sonia", password: "Sonia" })
        .expect(200);
    });
  });

  describe("When a POST request arrives a wrong endpoint", () => {
    test("Then it should respond with a response with 'Endpoint not found 404'", async () => {
      await request
        .post("/user/log")
        .send({ name: "Sonia", password: "Sonia" })
        .expect(404);
    });
  });
});

describe("Given a route user/register", () => {
  describe("When a POST request arrives good endpoint", () => {
    test("Then is should respond with a respose and code 200", async () => {
      await request
        .post("/user/register")
        .send({ name: "Sonia", password: "Sonia", email: "arlet@arlet.com" })
        .expect(200);
    });
  });
  describe("When a POST request arrives a wrong endpoint", () => {
    test("Then it should respond with a response with 'Endpoint not found 404'", async () => {
      await request
        .post("/user/regi")
        .send({ name: "Sonia", password: "Sonia" })
        .expect(404);
    });
  });
});
