import express from "express";
import hikeCreate from "../controllers/hikeController";

const router = express.Router();

router.post("/create", hikeCreate);

export default router;
