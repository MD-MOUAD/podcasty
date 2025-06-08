import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (
  fileBuffer: Buffer,
  folder: "podcast-images" | "podcast-audio",
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const resourceType = folder === "podcast-audio" ? "video" : "image";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // For images: automatically optimize and format
        ...(resourceType === "image"
          ? {
              quality: "auto",
              fetch_format: "auto",
            }
          : {}),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      },
    );

    uploadStream.end(fileBuffer);
  });
};
