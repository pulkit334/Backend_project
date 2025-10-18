const express = require("express");
const router = express.Router();
const categorymodel = require("../models/caterogray.js");
const { countDocuments } = require("../models/productmodel.js");
const Productmodel = require("../models/productmodel.js");

router.post("/createcat", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(404).send({
        success: true,
        message: "Pls Provide Message Name",
      });
    }
    const confimation = await categorymodel.create({ name });
    res.status(201).json({
      success: true,
      messgae: `Cateogory  had been Created`,
      data: confimation,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Error while creating the cateogroy pls try again");
  }
});

//Get Cateogory All

router.get("/getcat", async (req, res) => {
  try {
    // i can  also take Pagination in fact of this current Remmber while  getting the data//

    // if User want only 10 Products at Time then he had A feature or A proper Limit At A time A user Can only get Only limited then he can next it //
    // const limits = req.body.limit;
    // console.log(limit)
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    const AllCat = await categorymodel.find({}).skip(skip).limit(limit);
    const count = await categorymodel.countDocuments();
    // .skip(skip).limit(limit);/

    if (!AllCat || AllCat.length === 0) {
      return res.status(404).json({
        message: "No categories found",
        success: false,
      });
    }

    res.status(201).json({
      message: `Here is All Category `,
      success: true,
      countDocuments: count,
      skipped: skip,
      catlen: AllCat.length,
      data: AllCat,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      secure: false,
      message: "Error while Getting  The category Try Again",
    });
  }
});

router.delete("/deletecat/:id", async (req, res) => {
  try {
    const categorie = await categorymodel.findById(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Id Not Found",
        success: false,
      });
    }
    // find product id wiht this catoegory ///

    const products = await Productmodel.find({ category: categorie._id });

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.categorie = undefined;
      await product.save();
    }
    //saver
    await categorie.deleteOne();
    res.status(200).send({
      message: "catorgy delete",
      success: true,
    });

    return res.status(201).json({
      message: "Succefully deletd the cateogary",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      secure: false,
      message: "Error while Deleting the cateogary ",
    });
  }
});
//u[pdating the cateogry

router.put("/updatecat/:id", async (req, res) => {
  try {
    const categorie = await categorymodel.findById(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Id Not Found",
        success: false,
      });
    }
    // find product id wiht this catoegory ///
    const { catupdate } = req.body;

    const products = await Productmodel.find({ category: categorie._id });

    // first i have to Change the Product category Before changing the Name .//
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.categorie = catupdate;
      await product.save();
    }
    //saver
    // then Update the Category name //
    categorie.name = catupdate;
    await categorie.save();

    return res.status(200).json({
      message: "Category updated successfully",
      success: true,
      data: products,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      secure: false,
      message: "Error while Updating the cateogary ",
    });
  }
});

module.exports = router;
