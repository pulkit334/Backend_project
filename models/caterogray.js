const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category is required"],
    }
  },
  { timestamps: true }
);
const categorymodel = mongoose.model("Category", categoryschema);
module.exports = categorymodel;
