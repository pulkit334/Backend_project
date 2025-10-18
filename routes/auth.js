const express = require('express');
const route = require("../controller/auth");
const userverify= require("../middleware/verifycookie")
const router = express.Router();
const rout = require("../controller/uplaoding")
const upload = require("../middleware/multer")
const updatecontoller = require("../controller/uplaoding")



// Signup route
router.post("/signup", route);
router.post("/login", route);
router.get("/getprofile",route);
router.post("/logout",route);
router.put("/update",route);

//cloudh uplaod 
// router.post("/upload",rout)
router.post("/updateprofile", updatecontoller)


module.exports = router;
