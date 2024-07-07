import express from "express";
import { authorizeUser } from "../middlewares/authorizeUser.js";

const router = express.Router();

import { createInteraction } from "../controllers/interaction.controller.js";
router.route('create-interaction').post(authorizeUser,createInteraction)

import { getInteractionsByUserId } from "../controllers/interaction.controller.js";
router.route('get-user-interactions').get(authorizeUser,getInteractionsByUserId)

export default router;
