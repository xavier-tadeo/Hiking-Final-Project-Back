import express from "express";

import cors from "cors";
import chalk from "chalk";
import morgan from "morgan";

import Debug from "debug";

import { notFoundErrorHandler, generalErrorHandler } from "./middlewares/error";
import userRoutes from "./routes/userRoutes";
import hikeRoutes from "./routes/hikeRoutes";

const debug = Debug("hiking:server");

export const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

export const initializeServer = (port) =>
  new Promise((resolve) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`¡Escuchando en ${port}! ʕ•ᴥ•ʔﾉ♡`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.red("No se ha podido iniciar el servidor :("));
      if (error.message === "EADDRINUSE") {
        debug(chalk.red(`${port} está en uso...  ʕʘ̅┏ل͜┓ʘ̅ʔ`));
      }
    });
  });

app.use("/user", userRoutes);
app.use("/hike", hikeRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);
