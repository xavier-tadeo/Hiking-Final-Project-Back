import admin from "firebase-admin";
import Debug from "debug";
import chalk from "chalk";

const debug = Debug("hiking:upload");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "hiking-ad227.appspot.com",
});

const firebase = async (req, res, next) => {
  const bucket = admin.storage().bucket();
  try {
    req.body.images = [];
    const images = req.files.map(async (image) => {
      await bucket.upload(image.path);
      await bucket.file(image.filename).makePublic();
      const imageUrl = bucket.file(image.filename).publicUrl();
      return imageUrl;
    });
    debug(chalk.green("Images upload!"));
    const imagesAll = await Promise.all(images);
    req.body.images = imagesAll;
    next();
  } catch (error) {
    error.code = 400;
    error.message = "Error firebase";
    next(error);
  }
};

export default firebase;
