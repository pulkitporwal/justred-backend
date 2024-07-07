import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  createNewSeries,
  deleteSeries,
  fetchAllSeries,
  fetchEpisodesForSeries,
  findSeries,
  updateSeries,
} from "../controllers/series.controller.js";
import { authorizeUser } from "../middlewares/authorizeUser.js";

const router = express.Router();

router
  .route("/create-new-series")
  .post(authorizeUser, upload.single("banner"), createNewSeries);

router.route("/fetch-all-series").get(authorizeUser, fetchAllSeries);

router.route("/find-series").post(authorizeUser, findSeries);

router
  .route("/fetch-episodes-for-series")
  .post(authorizeUser, fetchEpisodesForSeries);

router
  .route("/update-series")
  .post(authorizeUser, updateSeries);

router
  .route("/delete-series")
  .post(authorizeUser, deleteSeries);

export default router;
