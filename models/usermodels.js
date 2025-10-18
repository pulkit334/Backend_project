const mongoose = require("mongoose");
const { MAX } = require("uuid");
const use = require("../controller/auth");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userdata = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "the password length should be greater then 6 greater"],
    },
    city: {
      type: String,
      required: true,
    },
    profilepic: {
      public_id: { type: String },
      url: { type: String },
    },
    answer:{
      type : String,
      required: [true,"anwer is requried"],
    },
    role : {
      type : String,
      default : "User",
      required : true
    },
  },
  { timestamps: true }
);


userdata.methods.comparepass = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userdata.methods.verifyjwt = function () {
  const jwtvrify = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT,
    { expiresIn: "1hr" }
  );
  return jwtvrify;
};
userdata.pre("save", async function (next) {
  const user = this;

  const exists = await mongoose.models.ecommerce.findOne({ email: user.email });

  if (exists && exists._id.toString() !== user._id.toString()) {
    const err = new Error("Email already exists");
    next(err);
  } else {
    next();
  }
});

//////////////////////ADMIN AUTH////////////////////////////


const User = mongoose.model("ecommerce", userdata);
User.isadmin = async (req, res, next) => {
  try {
    console.log(req.users)
    if (!req.users) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized — token missing or invalid"
      });
    }

    if (!req.users.role || req.users.role.toLowerCase() !== 'admin') {
      return res.status(403).send({
        success: false,
        message: "Access Denied — Admins only"
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error verifying admin access",
      error: error.message
    });
  }
};

module.exports = User;
