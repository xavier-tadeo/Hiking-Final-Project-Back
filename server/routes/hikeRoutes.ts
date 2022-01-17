import express from "express";

import {
  hikeCreate,
  hikeDelete,
  hikeGet,
  hikeGetOne,
  hikeUpdate,
} from "../controllers/hikeController";
import firebase from "../middlewares/firebase";
import upload from "../middlewares/upload";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/create", auth, upload.array("images"), firebase, hikeCreate);
router.get("/get", hikeGet);
router.delete("/delete/:hikeId", auth, hikeDelete);
router.patch("/update/:hikeId", auth, hikeUpdate);
router.get("/get/:hikeId", hikeGetOne);

export default router;
