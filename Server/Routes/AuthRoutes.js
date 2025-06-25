import express from "express";

import {
  checkAuth,
  login,
  logout,
  register,
} from "../Controller/AuthController.js";

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check", checkAuth);

export default authRouter;
