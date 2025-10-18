const express = require("express");
const validateUser = require("../validater/validator");
const comparepass = require("../validater/validator");
const app = express();
const User = require("../models/usermodels");
const route = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const userverify = require("../middleware/verifycookie");
const cookieParser = require("cookie-parser");
app.use(cookieParser);
require("dotenv").config();
// app.use(encodeURI {})//

route.post("/signup", async (req, res) => {
  try {
    validateUser(req.body);

    // man lo yaha se data set ho gaya fir kya karna hai //
    req.body.password = await bcrypt.hash(req.body.paessword, 10);
    console.log(req.body.password);

    const createuser = new User(req.body);
    await createuser.save();
 return    res.status(201).send("Succesfully created the user", createuser);
  } catch (err) {
    res.status(404).send({
    
      message: "Error while creating the user",
      error: err.message,
    });
  }
});
route.post("/login", async (req, res) => {
  //sabse phele password ko valiudate karva lete hai ok
  try {
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("email is not valid");
    }
    // then compare the password //
    const passMatch = await user.comparepass(password);
    if (!passMatch) {
      return res.status(401).json({ error: "Password incorrect" });
    }

    const token = user.verifyjwt();
    console.log(token);
    res.cookie("token", token, {
      // httpOnly : true,
      // secure : process.env.ENV === "production" ? true : false,
      maxAge: 20 * 60 * 1000,
      path: "/",
    });

    res.send("seccufully login", token);
  } catch (err) {
    res.status(400).send("error while sinup" + err.message);
  }
});

// GET THE USER INFORMATIOMN.//
route.get("/getprofile", userverify, async (req, res) => {
  try {
    const data = res.send(req.users);
    console.log(data);
    if (!data) {
      throw new Error("the user infomraiton is nto avaibile ");
    }
    res.status(201).json({
      // success : true,
      message: "succesfully fetched the user data",
      data,
    });
  } catch (err) {
    console.log("error is ", err);
    res.status(500).send({
      success: false,
      message: "Eror in getting datails APi",
    });
  }
});

route.post("/logout", (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(400).send("No token provided");
    console.log("Logging out token:", token);

    res.cookie(
      "token",
      null,
      { expires: new Date(Date.now()) },
      { httpOnly: true }
    );

    res.send("Logout successful ");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

route.put("/update", userverify, async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.users, req.body);
    if (!data) return res.status(404).send({ error: "User not found" });

    res.status(201).json({
      message: "succefully  done it with",
      data,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = route;
