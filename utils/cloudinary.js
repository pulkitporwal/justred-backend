import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import ffmpegPath from 'ffmpeg-static';
import { execFile } from 'child_process';

dotenv.config();

function compressVideo(localFilePath, compressedFilePath, targetSizeMB = 100) {
  return new Promise((resolve, reject) => {
    const args = [
      '-i', localFilePath,
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-vf', "scale='min(1920,iw)':'-2'",
      '-fs', `${targetSizeMB}M`,
      compressedFilePath
    ];
    
    execFile(ffmpegPath, args, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

async function uploadVideoOnCloudinary(localFilePath) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const stats = fs.statSync(localFilePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    let filePathToUpload = localFilePath;

    if (fileSizeInMB > 100) {
      const compressedFilePath = path.join(
        path.dirname(localFilePath),
        `compressed-${path.basename(localFilePath)}`
      );
      await compressVideo(localFilePath, compressedFilePath, 100);
      filePathToUpload = compressedFilePath;
    }

    const uploadResult = await cloudinary.uploader.upload(filePathToUpload, {
      resource_type: "video",
      folder: "Videos",
    });

    fs.unlink(filePathToUpload, (unlinkErr) => {
      if (unlinkErr) {
        console.error(unlinkErr);
        console.error("Failed to delete file from server");
      } else {
        console.log(
          "Video uploaded successfully and deleted from server successfully"
        );
      }
    });

    if (filePathToUpload !== localFilePath) {
      fs.unlink(localFilePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(unlinkErr);
          console.error("Failed to delete original file from server");
        }
      });
    }

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    fs.unlink(localFilePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(unlinkErr);
        console.error("Failed to delete file from server");
      }
    });
    throw error;
  }
}

async function uploadImageOnCloudinary(localFilePath) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "Thumbnails",
    });

    fs.unlink(localFilePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(unlinkErr);
        console.error("Failed to delete file from server");
      } else {
        console.log(
          "Image uploaded successfully and deleted from server successfully"
        );
      }
    });

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    fs.unlink(localFilePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(unlinkErr);
        console.error("Failed to delete file from server");
      }
    });
    throw error;
  }
}

const deleteVideoFromCloudinary = async (publicId) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return { success: result.result === "ok" };
  } catch (error) {
    console.error("Error deleting video from Cloudinary:", error);
    return { success: false };
  }
};

const deleteAllFilesWithinAFolder = async (folderName) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await cloudinary.api.delete_resources_by_prefix(
      `${folderName}/`
    );
    console.log("All Files Deleted Successfully:", result);
  } catch (error) {
    console.error("Error deleting video from Cloudinary:", error);
  }
};

// deleteAllFilesWithinAFolder("Thumbnails");
// deleteAllFilesWithinAFolder("Videos");

export {
  uploadVideoOnCloudinary,
  uploadImageOnCloudinary,
  deleteVideoFromCloudinary,
};
