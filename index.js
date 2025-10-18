const express = require("express");
const morgan = require("morgan");
const connect = require("./db/db");
const app = express();
const cors = require("cors");
require("dotenv").config();
const route = require("./routes/auth");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();
const cloudinary = require("cloudinary");
const r = require("./routes/productroutes")
const categoryroutes = require("./routes/cateogoryroute")
const orderroutes = require("./routes/orderRoutes");
const userverify = require("./middleware/verifycookie");

const limiter = require("./RateLimiter_basci_wala_map/protector.js")
// helemt middlware fro header security //
const helemt = require('helmet');
//express security 
// const secure  = require('express-mongo-sanitize')
// All middlwares //
app.use(helemt());
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());  
// app.use(secure({}));
app.use(limiter)
connect();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
//stripe configration

// app.use(secure({ ignoreQuery: true }));      

app.use("/s", route);

// Products Routes //
app.use("/p",r);

//cateogry routes 
app.use("/cat",categoryroutes)

//order model
app.use("/od",orderroutes)

const initialize_con = async () => {
  try {
    // await Promise.all([connect()])d
    // Start server

    app.listen(process.env.PORT, () => {
      console.log(` Server listening at port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Error while initializing connections:", err.message);
    process.exit(1);
  }
};

initialize_con();
