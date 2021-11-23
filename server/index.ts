import express from "express";

import cors from "cors";
import chalk from "chalk";
import morgan from "morgan";

import Debug from "debug";

const debug = Debug("hiking:server");

const app = express();

const initializeServer = (port) =>
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

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

export default initializeServer;
