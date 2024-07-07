import { Videos } from "../models/video.model.js";
import {
  uploadVideoOnCloudinary,
  uploadImageOnCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";
import { deleteVideoDataFromBothCloudinaryAndMongodb } from "../utils/deleteVideoDataFromBothCloudinaryAndMongodb.js";

const uploadNewVideo = async (req, res) => {
  try {
    const { videoName, seriesName, season, description, rating, isHD } =
      req.body;

    if (!req.files && !req.files["thumbnail"] && !req.files["video"]) {
      return res.status(400).json({
        success: false,
        message: "Error in file uploading",
      });
    }

    if (!(videoName && seriesName && season && description && rating && isHD)) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const thumbnailUploadInstance = await uploadImageOnCloudinary(
      req.files["thumbnail"][0].path,
      "images",
      "Thumbnails"
    );

    const videoUploadInstance = await uploadVideoOnCloudinary(
      req.files["video"][0].path,
      "Videos"
    );

    const video = await Videos.create({
      thumbnail: {
        thumbnailURL: thumbnailUploadInstance.secure_url,
        publicId: thumbnailUploadInstance.public_id,
      },
      videoData: {
        videoURL: videoUploadInstance.playback_url,
        publicId: videoUploadInstance.public_id,
      },
      videoName,
      seriesName,
      description,
      rating,
      season,
      isHD,
      videoPlaybackURL: videoUploadInstance.secure_url,
    });

    res.status(200).json({
      success: true,
      message: "New Video Uploaded Successfully",
      video,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while Uploading and Creating new Video",
      error,
    });
  }
};

const fetchAllVideos = async (req, res) => {
  try {
    const allVideos = await Videos.find().lean();

    res.status(200).json({
      success: true,
      message: "All Videos fetched Successfully",
      allVideos,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching all Videos",
      error: error.message,
    });
  }
};

const findVideo = async (req, res) => {
  try {
    const { videoId } = req.body;

    const videoData = await Videos.findById(videoId);

    if (!videoData) {
      return res.status(404).json({
        success: false,
        message: "No Video found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video found successfully",
      videoData,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching Video",
      error: error.message,
    });
  }
};

const updateVideo = async (req, res) => {
  try {
    const {
      videoId,
      videoName,
      seriesName,
      season,
      description,
      rating,
      isHD,
    } = req.body;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Video ID is required",
      });
    }

    if (!(videoName || seriesName || season || description || rating || isHD)) {
      return res.status(400).json({
        success: false,
        message: "At Least enter value in one field",
      });
    }

    const findVideo = await Videos.findById(videoId);

    await findVideo.updateOne({
      videoName,
      seriesName,
      season,
      description,
      rating,
      isHD,
    });

    const updatedVideo = await findVideo.save();

    if (!updatedVideo) {
      console.error("ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while updating video",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video Updated Successfully",
      updatedVideo,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching Video",
      error: error.message,
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      console.error("Video ID is required");
      return res.status(400).json({
        success: false,
        message: "Video ID is required",
      });
    }

    const isDeleted = await deleteVideoDataFromBothCloudinaryAndMongodb({
      videoId,
    });

    if (!isDeleted) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete the video from both cloudinary and mongodb",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video Deleted Successfully",
    });
  } catch (error) {
    console.error("ERROR while deleting video:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting Video",
      error: error.message,
    });
  }
};

export { uploadNewVideo, fetchAllVideos, findVideo, updateVideo, deleteVideo };
