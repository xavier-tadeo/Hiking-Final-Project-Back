import express from "express";

import {
  userCreate,
  userDelete,
  userLogin,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", userCreate);
router.post("/login", userLogin);
router.delete("/delete/:idUser", userDelete);

export default router;
