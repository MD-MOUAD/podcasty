import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (
  fileBuffer: Buffer,
  folder: "podcast-images" | "podcast-audio"
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
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const extractPublicId = (url: string): string | null => {
  // Extract public ID from Cloudinary URL
  const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches ? matches[1] : null;
};

export const deleteMedia = async (
  url: string,
  resourceType: "image" | "video" = "image"
) => {
  try {
    const publicId = extractPublicId(url);
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return true;
  } catch (error) {
    console.error("Error deleting media from Cloudinary:", error);
    throw error;
  }
};
