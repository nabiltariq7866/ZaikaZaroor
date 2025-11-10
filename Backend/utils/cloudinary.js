import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const uploadFileOnCloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECERT,
  });
  try {
    const res = await cloudinary.uploader.upload(file);
    return res.secure_url;
  } catch (error) {
    console.error(error)
  } finally {
    if(file){
        fs.unlinkSync(file);
    }
  }
};
export default uploadFileOnCloudinary;