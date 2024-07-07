import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  deleteVideo,
  fetchAllVideos,
  findVideo,
  updateVideo,
  uploadNewVideo,
} from "../controllers/video.controller.js";
import { authorizeUser } from "../middlewares/authorizeUser.js";

const router = express.Router();

router.route("/upload-new-video").post(
  authorizeUser,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  uploadNewVideo
);

router.route("/fetch-all-videos").get(authorizeUser, fetchAllVideos);

router.route("/find-video").post(authorizeUser, findVideo);

router.route("/update-video").post(authorizeUser, updateVideo);

router.route("/delete-video").post(authorizeUser, deleteVideo);

export default router;
