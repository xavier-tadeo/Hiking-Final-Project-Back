import express from "express";
import {
  hikeCreate,
  hikeDelete,
  hikeGet,
  hikeUpdate,
} from "../controllers/hikeController";

const router = express.Router();

router.post("/create", hikeCreate);
router.get("/get", hikeGet);
router.delete("/delete/:hikeId", hikeDelete);
router.patch("/update/:hikeId", hikeUpdate);

export default router;
