const cloudinary = require("cloudinary").v2;
const express = require("express");
const rout = express.Router();
require("dotenv").config();
const getdatauri = require("../middleware/featuremiddle");
const path = require("path");
const User = require("../models/usermodels");
const userverify = require("../middleware/verifycookie");
const upload = require("../middleware/multer");

rout.put("/updateprofile", userverify, upload.single("file"), async (req, res) => {
  console.time("updateProfile"); // Start timing
  try {
    // 1️ Validate request
    if (!req.file) {
      console.timeEnd("updateProfile");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.users?._id;
    if (!userId) {
      console.timeEnd("updateProfile");
      return res.status(401).json({ error: "User not authenticated" });
    }

    // 2️ Fetch user from DB
    const user = await User.findById(userId);
    if (!user) {
      console.timeEnd("updateProfile");
      return res.status(404).json({ error: "User not found" });
    }

    // 3️ Convert file to data URI
    const fileUri = getdatauri(req.file);

    // 4️ Delete old profile pic if exists
    if (user.profilepic?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.profilepic.public_id);
      } catch (destroyErr) {
        console.warn("Failed to delete old Cloudinary image:", destroyErr.message);
      }
    }

    // 5️ Upload new image
    const cloudRes = await cloudinary.uploader.upload(fileUri.content, {
      folder: "profile_pics",
    });

    // 6️ Update user document
    user.profilepic = {
      public_id: cloudRes.public_id,
      url: cloudRes.secure_url,
    };
    await user.save();

    console.timeEnd("updateProfile"); // End timing
    res.status(200).json({
      message: "Profile updated successfully",
      profilePic: user.profilepic,
    });
  } catch (err) {
    console.error("Profile update failed:", err);
    console.timeEnd("updateProfile");
    res.status(500).json({ error: "Failed to update profile" });
  }
});


module.exports = rout;

// cloudinary.config({
// cloud_name : process.env.CLOUD_NAME,
// api_key  : process.env.API_KEY,
// api_secret :  process.env. API_SECRET

// })

// routerr.post("/upload",upload.single("file"),async (req,res)=>{
//     try {
//      if (!req.file) return res.status(400).send("No file uploaded");
// // array check populat4e req.files//
// console.log(req.file.path)
//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ error: "No files uploaded"});
//     }

// const result = await cloudinary.uploader.upload(req.file.path,{
//     folder : "files"
// })
// // locall delete after

//         res.json({
//             message: "File uploaded to Cloudinary successfully!",
//             url: result.secure_url,
//         });
//     }
//  catch (err) {
//         console.error(err);
//         res.status(500).send("Cloudinary upload failed");
//     }

// })
