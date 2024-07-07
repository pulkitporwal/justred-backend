import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema(
  {
    banner: {
      publicId: {
        type: String,
        required: true,
      },
      bannerURL: {
        type: String,
        required: true,
      },
    },
    seriesName: {
      type: String,
      unique: true,
      required: true,
    },
    seriesDescription: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
    },
    dubbedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Series = mongoose.model("Series", seriesSchema);

export { Series };
