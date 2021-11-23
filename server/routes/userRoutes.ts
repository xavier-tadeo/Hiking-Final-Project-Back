import express from "express";

import { userCreate, userLogin } from "../controllers/userController";

const router = express.Router();

router.post("/register", userCreate);
router.post("/login", userLogin);

export default router;
