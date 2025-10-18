const express = require('express');
const r = express.Router();
const products = require("../controller/products")
const upload = require("../middleware/multer");

r.get("/getproducts",products);
r.get("/getsingle/:id",products);
r.post("/createproduct",upload.single("file"),products);
r.post("/updateproduct/:id",products);
r.post("/updateimage/:id",upload.single("file"), products)
r.delete("/deleteimage/:id", products)
r.delete("/deleteproduct", products)
//get All Products 
r.get("/top",products)
module.exports = r; 