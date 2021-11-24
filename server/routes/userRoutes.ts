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
router.post("/login", auth, userLogin);
router.delete("/delete/:idUser", userDelete);
router.patch("/update/:idUser", userUpdate);

export default router;
