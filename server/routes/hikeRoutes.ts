import express from "express";
import {
  hikeCreate,
  hikeDelete,
  hikeGet,
  hikeGetOne,
  hikeUpdate,
} from "../controllers/hikeController";

const router = express.Router();

router.post("/create", hikeCreate);
router.get("/get", hikeGet);
router.delete("/delete/:hikeId", hikeDelete);
router.patch("/update/:hikeId", hikeUpdate);
router.get("/get/:hikeId", hikeGetOne);

export default router;
