const express = require('express');
const orderroutes = express.Router();
const products = require("../controller/products")
const upload = require("../middleware/multer");
const ordercontroller = require("../controller/OrderController")
const userverify= require("../middleware/verifycookie");
const router = require('./auth');
const User = require("../models/usermodels")

orderroutes.post("/createo",ordercontroller)

//ALL Order Routes 
orderroutes.get("/getorder",userverify,ordercontroller);

// Get single Order
orderroutes.get("/getsingleorder/:id",userverify,ordercontroller);
//accept payment 
orderroutes.post("/payments",userverify,ordercontroller)
//veifry payment 
orderroutes.post("/verify",userverify,ordercontroller)
orderroutes.post("/verify",userverify,ordercontroller)
////////////////// ADMIN PART ////////////////////////////

orderroutes.get("/admin/geto",ordercontroller)

//change the order status ///////////////////////////////

orderroutes.put("/admin/order/:id",userverify,User.isadmin,ordercontroller)

///////forgot User  Password //////////////

orderroutes.post("/resetpassword",userverify,ordercontroller)
//rveiw the product 
orderroutes.put("/review/:id",userverify,ordercontroller)
module.exports = orderroutes; 