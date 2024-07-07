import { Videos } from "../models/video.model.js";
import { deleteVideoFromCloudinary } from "./cloudinary.js";

export async function deleteVideoDataFromBothCloudinaryAndMongodb({
  videoId,
}) {
  const findedVideo = await Videos.findById(videoId);

  if (!findedVideo) {
    throw new Error("Video Id is required to delete video");
  }

  const deletedVideoFromCloudinary = await deleteVideoFromCloudinary(
    findedVideo.videoData.publicId
  );

  if (!deletedVideoFromCloudinary || !deletedVideoFromCloudinary.success) {
    console.error(
      "Failed to delete video from Cloudinary:",
      findedVideo.videoData.publicId
    );
    throw new Error("Failed to delete video from Cloudinary");
  }
  await findedVideo.deleteOne();

  return true;
}
