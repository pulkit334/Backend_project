const express = require('express');
const router = express.Router();
const products = require("../controller/products")
const upload = require("../middleware/multer");
const userverify= require("../middleware/verifycookie")
const category = require("../controller/category")
// category routes ///


//for Creating the Cateogory 
router.post("/createcat",userverify,category)
//For Getting all the Cateogroy 
router.get("/getcat",userverify,category)
// FOr deleting the Cateogary 
router.delete("/deletecat/:id",userverify,category)
//updating the catogory
router.put("/updatecat/:id",userverify,category)
module.exports = router; 