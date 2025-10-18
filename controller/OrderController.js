const express = require("express");
const router = express.Router();
const categorymodel = require("../models/caterogray.js");
const { countDocuments } = require("../models/productmodel.js");
const ordermodel = require("../models/orderModel.js");
const Productmodel = require("../models/productmodel.js");
const userverify = require("../middleware/verifycookie");
const OrderModel = require("../models/orderModel.js");
const razerpay = require("../razer.js");
const User = require("../models/usermodels.js");
const bcrypt = require("bcrypt");
router.post("/createo", userverify, async (req, res) => {
  try {
    const {
      Shippinginfo,
      OrderItems,
      paymentInfo,
      itemPrice,
      tax,
      ShippingCharges,
      TotalAmount,
      paymentModel,
    } = req.body;
    if (
      !Shippinginfo ||
      !ShippingCharges ||
      !OrderItems ||
      !paymentInfo ||
      !itemPrice ||
      !tax ||
      !TotalAmount ||
      !paymentModel
    ) {
      return res.status(404).json({
        message: "All Fields are required Properly",
      });
    }
    if (!req.users || !req.users._id) {
      return res.status(404).send({
        message: "user is required ",
      });
    }
    if (paymentModel === "COD") {
      paymentInfo.status = "NOT_Paid";
    }

    await ordermodel.create({
      user: req.users._id,
      Shippinginfo,
      OrderItems,
      paymentInfo,
      itemPrice,
      tax,
      ShippingCharges,
      TotalAmount,
      paymentModel,
    });

    //stock update

    for (let i = 0; i < OrderItems.length; i++) {
      const product = await Productmodel.findById(OrderItems[i].product);
      console.log(product);
      product.stock -= OrderItems[i].Quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Succesfully created  Added product to Cart",
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Erorr while Creating the cart");
  }
});
//all order APi
router.get("/getorder", async (req, res) => {
  try {
    const order = await OrderModel.find({ user: req.users._id });
    console.log(order);
    //validaiton
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Error while getting the the order Pls Re Check and verify",
      });
    }

    res.status(201).send({
      success: true,
      totalOrder: order.countDocuments,
      message: "Succesfully created  Get the order",
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Erorr while Fetching the order");
  }
});

//all SIngle  APi
router.get("/getsingleorder/:id", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    //validaiton
    const count = OrderModel.countDocuments;
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Error while getting the the Product Pls Re Check and verify",
      });
    }

    res.status(201).send({
      success: true,

      countDocuments: count,
      message: "Succesfully   Get the order",
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Erorr while Fetching the order");
  }
});

router.post("/payments", async (req, res) => {
  try {
    //ye method galt hai but for sample purpose only
    // in actually we have fetch price from orderid or course id which is stored in db
    const { TotalAmount } = req.body;
    if (!TotalAmount) {
      return res.status(400).json({
        success: false,
        message: "Total amount is required",
      });
    }
    const options = {
      amount: Number(TotalAmount),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razerpay.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log(err);
    res.status(402).send("Payment Failed");
  }
});
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

////////ADMIN SECTION////

router.get("/admin/geto", userverify, User.isadmin, async (req, res) => {
  try {
    const orders = await ordermodel.find({});
    res.status(200).send({
      success: true,
      message: "All Orders Data",
      totalOrders: orders.length,
      orders,
    });
  } catch (err) {
    res.status(404).json({
      message: "Error, please try again",
      err,
    });
  }
});

////////////change the delivery status /.//////////////

router.put("/admin/order/:id", async (req, res) => {
  try {
    //cast error handling can also be happend
    // findorder//
    const order = await ordermodel.findById(req.params.id);
    //validation
    if (!order) {
  return res.status(404).json({
        message: "Order not Found",
        success: false,
      });
    }
    if (order.OrderStatus == "Delivered") {
      return res.status(400).json({
        message: "The Order is already delivered",
        success: false,
      });
    }
    order.OrderStatus = req.body.OrderStatus || order.OrderStatus;
    order.deliverAt = new Date();
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order delivery status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Error updating order:", err);
  return res.status(500).json({
    success: false,
    message: "Error, please try again",
    error: err.message
  });
  }
});
//fogot passwrd///
router.post("/resetpassword", async (req, res) => {
  try {
    //email passowd
    const { email, newpassword, answer } = req.body;
    if (!email || !newpassword || !answer) {
      return res.status(404).json({
        message: "Provide all Necessary Fields",
        success: true,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid user or asnwer",
      });
    }
    console.log(newpassword);
    user.password = await bcrypt.hash(newpassword, 10);
    await user.save();
    //find the answer
    console.log(user.password);
    return res.status(201).send({
      message: "succesfully Changed the pasword",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while Changing the password",
      success: false,
      err,
    });
  }
});
////////////////review the product //////////
router.put("/review/:id", async (req, res) => {
  try {
    const { comment, rating } = req.body;

    // 1️ Find product
    const product = await Productmodel.findById(req.params.id); 
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
 
    // 2️ Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.users._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed",
      });
    }

    // 3️ Create new review
    const review = {
      name: req.users.name,
      rating: Number(rating),
      comment : req.users.comment,
      user: req.users._id,
    };

    //4️ Add new review and recalc rating
    product.reviews.push(review);
    product.numReview = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // 5️ Save and respond
    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (err) {
    console.error("Review API Error:", err);
    return res.status(500).json({
      message: "Error in review API",
      error: err.message,
    });
  }
});

module.exports = router;
