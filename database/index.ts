const debug = require("debug")("socialNetwork:DB");
const chalk = require("chalk");
const mongoose = require("mongoose");

const connectDB = (stringConnection) =>
  new Promise<void>((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret._v;
      },
    });
    mongoose.connect(stringConnection, (error) => {
      if (error) {
        debug(chalk.red("I can't connected database"));
        debug(chalk.red(error.message));
        reject();
        return;
      }
      debug(chalk.bgBlueBright.black.bold("Conect to the basadate"));
      resolve();
    });
    mongoose.connection.on("close", () => {
      debug(chalk.green("Desconectado de la base de datos"));
    });
  });

export = { connectDB };
