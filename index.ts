/* eslint-disable import/first */
import dotenv from "dotenv";

import connectDB from "./database/index";
import initializeServer from "./server/index";

dotenv.config();
const port = process.env.PORT ?? process.env.SERVER_PORT ?? 6000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_STRING);
    initializeServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
