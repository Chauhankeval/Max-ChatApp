import Post from "../model/PostModel.js";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";

import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

const Getpost = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res
      .status(200)
      .json({ message: "Posts fetched successfully", data: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    next(
      createError(
        error.status,
        error?.responce?.data?.error ||
          error?.responce?.data?.message ||
          error?.message
      )
    );
  }
};

export { Getpost };
