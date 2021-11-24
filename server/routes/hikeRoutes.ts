import express from "express";
import { hikeCreate, hikeGet } from "../controllers/hikeController";

const router = express.Router();

router.post("/create", hikeCreate);
router.get("/get", hikeGet);

export default router;
