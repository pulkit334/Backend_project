const express = require("express");
const path = require("path");
const multer = require("multer")
const app = express();
const PORT = 3000;
// create and instance or go with disk storage//
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        return cb(null,"./uploads")
    },
    filename : function (req,file,cb) {
        return cb(null,`${Date.now()}-${file.originalname}`)
    },
})
const upload = multer({storage })
// set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : false }))
// route
app.get("/", (req, res) => {
  res.render("index", { title: "My First EJS Page", message: "Hello from EJS!" });
});
app.post("/upload", upload.any("pulkit"),(req,res,next)=>{

    console.log(req.file);
    console.log(req.body)
    next()
})
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
