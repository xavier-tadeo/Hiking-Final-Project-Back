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

const router = express.Router();

router.post("/create", upload.single("images"), firebase, hikeCreate);
router.get("/get", hikeGet);
router.delete("/delete/:hikeId", hikeDelete);
router.patch("/update/:hikeId", hikeUpdate);
router.get("/get/:hikeId", hikeGetOne);

export default router;
