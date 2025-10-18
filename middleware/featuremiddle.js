const express = require("express");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const rout = express.Router();
require("dotenv").config();
const path = require("path");
const DatauriParser = require("datauri/parser");
const { MulterError } = require("multer");
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

const getdatauri = (file) => {
  const parser = new DatauriParser();
  const extname = path.extname(file.originalname).toString();
  return parser.format(extname, file.buffer);
};
module.exports = getdatauri;
