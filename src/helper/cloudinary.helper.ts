import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.config";

export const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "DocuScanAI",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
