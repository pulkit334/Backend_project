const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); // add this
const app = express();
require("dotenv").config();
const User = require("../models/usermodels");
app.use(cookieParser());

const userverify = async (req, res, next) => {
  try {
    console.log(req.cookies)
 const token = req.cookies?.token;
    console.log(token)
    if (!token) {
      throw new Error("the user token doesn't exist");
    }
    const payload = jwt.verify(token, process.env.JWT);
    const { _id } = payload;
    console.log(_id);

    const users = await User.findById(_id);
    req.users = users;
    if (!users) {
      throw new Error("user is not find");
    }
    console.log("user si succfully passed secret test");
    next();
  } catch (err) {
 return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: err.message
    });
  }
};

module.exports = userverify;
