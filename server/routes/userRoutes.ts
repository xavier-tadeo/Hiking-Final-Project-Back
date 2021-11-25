import express from "express";

import {
  userCreate,
  userDelete,
  userLogin,
  userUpdate,
} from "../controllers/userController";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/register", userCreate);
router.post("/login", userLogin);
router.delete("/delete/:idUser", auth, userDelete);
router.patch("/update/:idUser", auth, userUpdate);

export default router;
