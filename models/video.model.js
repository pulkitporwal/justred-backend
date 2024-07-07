import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    thumbnail: {
      publicId: {
        type: String,
        required: true,
      },
      thumbnailURL: {
        type: String,
        required: true,
      },
    },
    videoName: {
      type: String,
      unique: true,
      required: true,
    },
    videoData: {
      publicId: {
        type: String,
        required: true,
      },
      videoURL: {
        type: String,
        required: true,
      },
    },
    seriesName: {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "series",
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    rating: {
      type: String,
      required: true,
    },
    isHD: {
      type: Boolean,
      required: true,
    },
    watch: {
      type: Number,
      default: 0,
    },
    videoPlaybackURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Videos = mongoose.model("Video", videoSchema);

export { Videos };
