const cloudinary = require("cloudinary").v2;
const express = require("express");
const rout = express.Router();
const app = express();
require("dotenv").config();
const productmodel = require("../models/productmodel");
const validateproduct = require("../validater/productvalidator");
const getdatauri = require("../middleware/featuremiddle");
const userauth = require("../middleware/verifycookie");
const Productmodel = require("../models/productmodel");
const categorymodel = require("../models/caterogray");
const router = require("./OrderController");

// filterating and get product api //

rout.get("/getproducts", async (req, res) => {
  // getting query from herr //
  const { keyword, category } = req.query || "";
  // make a catogoy quer for later //

  try {
    const product = await productmodel
      .find({
        name: { $regex: keyword, $options: "i" },

        // if tehere is no category then send undefined/

        category: category ? category : null,
      })
      .populate("category");
    //populate wiill poluate the the category ref all in the [Products]
    console.log(product);

    if (!product) {
      return res.status(404).send("Error: No products found");
    }
    res.status(200).json({
      messgae: "succesfully fetcehd the docuemt",
      product,
      totalproductlength: product.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while fetching the products");
  }
});

//Get Top products//

rout.get("/top", async (req, res) => {
  try {
    const products = await productmodel.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).send({
      message: "Top 3 Products",
      products,
    });
  } catch (err) {
    res.status(500).send("Error while Getting Top Products");
  }
});


// for single products //
rout.get("/getsingle/:id", async (req, res) => {
  try {
    console.log("Category ID:", req.params.id);

    const category = await categorymodel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Productmodel.find({
      category: category._id,
    }).populate("category");
    // fin hamesha return karge aarray of and poplpluate result ko dang se dega//
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json({
      message: "Successfully fetched products",
      category,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while fetching the products");
  }
});


// to create products//

rout.post("/createproduct", userauth, async (req, res) => {
  try {
    console.log(req.body);
    validateproduct(req.body);
    let image = null;

    // Handle optional image upload
    if (req.file) {
      const imageData = getdatauri(req.file); // convert to data URI

      const cdr = await cloudinary.uploader.upload(imageData.content); // upload to Cloudinary

      image = {
        public_id: cdr.public_id,
        url: cdr.secure_url,
      };
    }
    // createing products catergoyr name

    if (image) {
      req.body.images = image;
    }
    const categoryname = req.body.category;
    //data abse me enetry karni padhi
    let category = await productmodel.findOne({ name: categoryname });
    if (!category) {
      category = await categorymodel.create({ name: categoryname });
    }

    req.body.category = category._id;

    const dbupload = await Productmodel.create(req.body);

    if (!dbupload) {
      res.status(404).json({
        messgae: "failed to create the products in user db".err,
      });
    }
    res.status(201).send({
      messgae: "succesfully created the products",
      dbupload,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      messgae: "erro while creating the prodcuts",
      err,
    });
  }
});


// to update the user//
rout.post("/updateproduct/:id", userauth, async (req, res) => {
  try {
    // Find product by ID
    console.log(req.params.id);
    const data = await productmodel.findById(req.params.id);
    console.log(data);
    if (!data) {
      return res.status(404).json({
        messgae: "failed to update the user",
      });
    }

    // Update fields if they exist in request
    const { name, description, stock, price, category } = req.body;
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (stock !== undefined) data.stock = stock;
    if (price !== undefined) data.price = price;
    if (category !== undefined) data.category = category;

    // Save updated product
    const dbupload = await data.save();

    // Send response
    res.status(201).send({
      messgae: "succesfully updated the products",
      dbupload,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("erro while updatign the data " + err);
  }
});

rout.post("/updateimage/:id", userauth, async (req, res) => {
  try {
    const data = await productmodel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = getdatauri(req.file);
    const cdb = await cloudinary.uploader.upload(file.content);

    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url, //  fixed secure_url
    };
    // agar wo array nahi hai toh //

    data.images.push(image);
    await data.save();
    res.status(202).json({ message: "Successfully updated the image", image });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update the image", error: err.message });
  }
});

// delegte product Image /
rout.delete("/deleteimage/:id", userauth, async (req, res) => {
  try {
    const product = await Productmodel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        message: "Sorry, an error occurred (product not found)",
      });
    }

    const id = req.query.id; // this is the _id of the image in product.images
    if (!id) {
      return res.status(400).send("Error: Image ID (query param) is missing");
    }

    let index = -1;
    product.images.forEach((item, i) => {
      if (item._id.toString() === id) {
        index = i;
      }
    });

    if (index < 0) {
      return res.status(404).json({
        message: "No photo found by the image ID",
      });
    }

    await cloudinary.uploader.destroy(product.images[index].public_id);
    product.images.splice(index, 1);
    await product.save();

    return res.status(202).json({ message: "Successfully deleted the image" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "failed to delete the Image",
      err,
    });
  }
});
//deleting entire product

rout.delete("/deleteproduct", async (req, res) => {
  try {
    const userid = await productmodel.findByIdAndDelete(req.body.id);
    if (!userid)
      return res.status(404).send(" Error While Deleting the Product");

    for (let index = 0; index < userid.images.length; index++) {
      await cloudinary.uploader.destroy(userid.images[index].public_id);
    }

    await userid.remove();

    return res.status(202).json({
      messgae: "succesfully deleted the product",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "failed to delete the Image",
    });
  }
});

module.exports = rout;
