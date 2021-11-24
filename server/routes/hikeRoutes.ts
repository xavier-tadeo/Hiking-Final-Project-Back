import express from "express";
import { hikeCreate, hikeDelete, hikeGet } from "../controllers/hikeController";

const router = express.Router();

router.post("/create", hikeCreate);
router.get("/get", hikeGet);
router.delete("/delete/:hikeId", hikeDelete);

export default router;
