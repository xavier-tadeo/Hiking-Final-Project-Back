import express from "express";

import {
  userCreate,
  userDelete,
  userGetOne,
  userLogin,
  userUpdate,
} from "../controllers/userController";
import auth from "../middlewares/auth";
import checkUser from "../middlewares/checkUser";

const router = express.Router();

router.post("/register", userCreate);
router.post("/login", userLogin);
router.delete("/delete/:idUser", auth, checkUser, userDelete);
router.patch("/update/:idUser", auth, checkUser, userUpdate);
router.get("/oneUser/:idUser", auth, checkUser, userGetOne);

export default router;
