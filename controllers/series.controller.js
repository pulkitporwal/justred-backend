import axios from "axios";
import { Series } from "../models/series.model.js";
import { Videos } from "../models/video.model.js";
import { uploadImageOnCloudinary } from "../utils/cloudinary.js";
import { deleteVideoFromCloudinary } from "../utils/cloudinary.js";
import { deleteVideo } from "./video.controller.js";
import { deleteVideoDataFromBothCloudinaryAndMongodb } from "../utils/deleteVideoDataFromBothCloudinaryAndMongodb.js";

const createNewSeries = async (req, res) => {
  try {
    const { seriesName, seriesDescription, createdBy, dubbedBy } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Error in file Uploading",
      });
    }
    if (!(seriesName && seriesDescription && createdBy && dubbedBy)) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const uploadedBannerInstance = await uploadImageOnCloudinary(req.file.path);

    const newSeries = await Series.create({
      banner: {
        bannerURL: uploadedBannerInstance.secure_url,
        publicId: uploadedBannerInstance.public_id,
      },
      seriesName,
      seriesDescription,
      createdBy,
      dubbedBy,
    });

    return res.status(200).json({
      success: true,
      message: "Series Created Successfully",
      newSeries,
    });
  } catch (error) {
    console.error("ERROR: ", error);
    res
      .status(500)
      .json({ error: "Internal server error while Creating new Series" });
    error;
  }
};

const fetchAllSeries = async (req, res) => {
  try {
    const allSeries = await Series.find().lean();

    res.status(200).json({
      success: true,
      message: "All Series fetched Successfully",
      allSeries,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching all series",
      error: error.message,
    });
  }
};

const findSeries = async (req, res) => {
  try {
    const { seriesId } = req.body;

    if (!seriesId) {
      return res.status(400).json({
        success: false,
        message: "Series ID is required",
      });
    }

    const seriesData = await Series.findById(seriesId);

    if (!seriesData) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong while getting series data from database",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Series Data Fetched Successfully",
      seriesData,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching series",
      error: error.message,
    });
  }
};

const fetchEpisodesForSeries = async (req, res) => {
  try {
    const { seriesId } = req.body;

    if (!seriesId) {
      console.error("Series ID is required");
      return res.status(400).json({
        success: false,
        message: "Series ID is required",
      });
    }

    const allEpisodes = await Videos.find({ seriesName: seriesId });

    return res.status(200).json({
      success: true,
      message: "All Episodes for Series fetched successfully",
      allEpisodes,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching episodes for series",
      error: error.message,
    });
  }
};

const updateSeries = async (req, res) => {
  try {
    const { seriesId, seriesName, seriesDescription, createdBy, dubbedBy } =
      req.body;

    if (!seriesId) {
      return res.status(400).json({
        success: false,
        message: "Series ID is required",
      });
    }

    if (!(seriesName || seriesDescription || createdBy || dubbedBy)) {
      return res.status(400).json({
        success: false,
        message: "At Least enter value in one field",
      });
    }

    const findedSeries = await Series.findById(seriesId);

    await findedSeries.updateOne({
      seriesName,
      seriesDescription,
      createdBy,
      dubbedBy,
    });

    const updatedSeries = await findedSeries.save();

    return res.status(200).json({
      success: true,
      message: "Series Updated Successfully",
      updatedSeries,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating series",
      error: error.message,
    });
  }
};

const deleteSeries = async (req, res) => {
  try {
    const { seriesId } = req.body;

    if (!seriesId) {
      return res.status(400).json({
        success: false,
        message: "Series ID is required",
      });
    }

    const findedSeries = await Series.findById(seriesId);

    if (!findedSeries) {
      return res.status(404).json({
        success: false,
        message: "Series not found",
      });
    }

    const episodesAssociatedWithSeries = await Videos.find({
      seriesName: seriesId,
    });

    for (const episode of episodesAssociatedWithSeries) {
      const isDeleted = await deleteVideoDataFromBothCloudinaryAndMongodb({
        videoId:episode._id,
      });

      if (!isDeleted) {
        return res.status(500).json({
          success: false,
          message:
            "Failed to delete the video from both cloudinary and mongodb",
          error: error.message,
        });
      }
    }

    await findedSeries.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Series Deleted Successfully",
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting series",
      error: error.message,
    });
  }
};

export {
  createNewSeries,
  fetchAllSeries,
  fetchEpisodesForSeries,
  findSeries,
  updateSeries,
  deleteSeries,
};
