const express = require("express");
const cors = require("cors");
const debug = require("debug")("hiking:server");
const chalk = require("chalk");
const morgan = require("morgan");

const app = express();

const initializeServer = (port) =>
  new Promise((resolve) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`¡Escuchando en ${port}! ʕ•ᴥ•ʔﾉ♡`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.red("No se ha podido iniciar el servidor :("));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`${port} está en uso...  ʕʘ̅┏ل͜┓ʘ̅ʔ`));
      }
    });
  });

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

export = { initializeServer, app };
