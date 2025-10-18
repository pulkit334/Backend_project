const mongoose = require("mongoose");
//Review Model

const reviewmodel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name si requried"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ecommerce",
      required: [true, "user is requried"],
    },
  },{timestamps : true});

//Product Model
const newschema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "the price is required"],
    },
    stock: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
   reviews: [reviewmodel],
    rating: {
      type: Number,
      default: 0,
    },
    comment :{
type : String
    },
    numReview: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "admin",
    },
  },{timestamps : true}
);
const Productmodel = mongoose.model("Product", newschema);
module.exports = Productmodel;
