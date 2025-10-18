
router.put("/review/:id", async (req, res) => {
  try {
    //find the
    const { comment, rating } = req.body;
    const product = await Productmodel.findById(req.params.id);
    //if the review exist or nto
    const aleradyreview = product.revview.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (aleradyreview) {
      return res.status(400).send({
        success: false,
        message: "Product alerday reviewed",
      });
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }
    product.revview.push(review);
    //no of review also presnet
    product.numReview = product.revview.length
    product.rating = product.revview.reduce((acc,item)=>item.rating + acc,0)/product.revview.length
    await product.save();
    res.status(201).json({
    success : true,
    message : "review added"
    })
  } catch (err) {
    return res.status(500).send({
      message: "Error IN review APi ",
      err,
    });
  }
});


// initialize_con();
const cluster = require('cluster');
const os = require('os');
const numCPUs = 5; // using 4 workers as requested

if (cluster.isMaster) {
  console.log(`Master ${process.pid} running, forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died, starting a new one`);
    cluster.fork();
  });

} else {
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
  
  connect();

  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  //stripe configration

  // app.use(secure({ ignoreQuery: true }));      
app.use(limiter)
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
        console.log(`Worker ${process.pid} Server listening at port ${process.env.PORT}`);
      });
    } catch (err) {
      console.error("Error while initializing connections:", err.message);
      process.exit(1);
    }
  };

  initialize_con();
}

