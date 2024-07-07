import express from "express";
import { authorizeUser } from "../middlewares/authorizeUser.js";

const router = express.Router();

import { signUp } from "../controllers/auth.controller.js";
router.route("/signup").post(signUp);

import { signIn } from "../controllers/auth.controller.js";
router.route("/signin").post(signIn);

import { signOut } from "../controllers/auth.controller.js";
router.route("/signin").get(authorizeUser, signOut);

export default router;
