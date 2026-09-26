const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPhoto = async (fileBase64, folder = "drivecare/jobs") => {
  const res = await cloudinary.uploader.upload(fileBase64, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return {
    url: res.secure_url,
    key: res.public_id,
    width: res.width,
    height: res.height,
    size: res.bytes,
  };
};

module.exports = { cloudinary, uploadPhoto };
