import { compare } from "bcrypt";
import UserData from "../model/userModel.js";
import pkg from "jsonwebtoken"; // Import the entire package
const { sign } = pkg; // Destructure the 'sign' function

import { renameSync, unlink, unlinkSync } from "fs";
import path from "path"; // To safely handle file paths

const maxage = 3 * 24 * 60 * 60 * 1000; // Cookie expiry time

// Function to create JWT token
const createToken = (email, userId) => {
  return sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxage });
};

// Signup function
const signup = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    // Check if email and password are provided
    if (!password || !email) {
      return res
        .status(401)
        .json({ message: "Password and email must be required" });
    }

    // Create user in the database
    const user = await UserData.create({ email, password });

    // Set a JWT in the cookie
    res.cookie("jwt", createToken(email, user.id), {
      maxAge: maxage,
      secure: true,
      sameSite: "None",
      sameSite: "Lax",
    });

    // Return a success response with user details
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetUp: user.profileSetUp,
      },
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!password || !email) {
      return res
        .status(401)
        .json({ message: "Password and email must be required" });
    }

    const user = await UserData.findOne({ email });
    console.log("<<USER", user);
    if (!user) {
      return res.status(404).json({ message: "Email not Found" });
    }

    const auth = await compare(password, user.password);
    console.log("<<<<<auth", auth);

    if (!auth) {
      return res.status(404).json({ message: "PassWord is inCorrect" });
    }

    // Set a JWT in the cookie
    res.cookie("jwt", createToken(email, user.id), {
      maxAge: maxage,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetUp: user.profileSetUp,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const getUserData = async (req, res) => {
  try {
    // Log the userId from the request
    console.log("<<USERID", req.userId);

    // Use the correct model to find the user by their ID (assuming your model is named 'User')
    const userData = await UserData.findById(req.userId);



    // Check if the user was found
    if (!userData) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Return user data as a response
    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetUp: userData.profileSetUp,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    console.log("Request body:", req.body); // Log the incoming request data
    console.log("userId>>>>>>", userId); // Log the userId to check if it's passed correctly

    // Check if required fields are present
    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "First name and last name are required." });
    }

    // Update user information
    const updateUser = await UserData.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetUp: true }, // Fields to update
      { new: true, runValidators: true } // Return updated document and validate
    );

    console.log("<<<<Update", updateUser);

    if (!updateUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with updated user data
    return res.status(200).json({
      message: "User's profile updated successfully.",

      id: updateUser._id,
      email: updateUser.email,
      profileSetUp: updateUser.profileSetUp,
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      image: updateUser.image,
      color: updateUser.color,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    // Ensure file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "File is Required" });
    }

    // No need for renameSync because Multer already handles file storage
    const fileName = req.file.path; // Path is already set by multer

    // Update user image in the database
    const updatedUser = await UserData.findByIdAndUpdate(
      req.userId, // Assuming req.userId is set from token
      { image: fileName },
      { new: true, runValidators: true } // Return updated document and validate
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Error in updating profile image:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const DeleteProfileImage = async (req, res) => {
  try {
    const { userId } = req;

    const updateUser = await UserData.findById(userId);

    if (!updateUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (updateUser.image) {
      unlinkSync(updateUser.image);
    }

    updateUser.image = null;
    await updateUser.save();

    return res.status(200).json({
      message: "User's profile Delete successfully.",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const LogOutUser = async (req, res) => {
  const { userId } = req;
  try {
    res.cookie("jwt", "", { maxage: 1, secure: true,  sameSite: "None"});

    return res.status(200).json({
      message: "LogOut SuccessFUlly",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export {
  signup,
  login,
  getUserData,
  updateProfile,  
  updateProfileImage,
  DeleteProfileImage,
  LogOutUser,
};
