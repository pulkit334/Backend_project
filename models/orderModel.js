// const mongoose = require("mongoose");

// const Orderschema = new mongoose.Schema(
//   {
//     Shippinginfo: {
//       Country: {
//         type: String,
//         required: [true, "Country is Required"],
//       },

//       address: {
//         type: String,
//         required: [true, "Adresss Is required"],
//       },
//       City: {
//         type: String,
//         required: [true, "City Is Requierd"],
//       },
//       Pincode: {
//         type: Number,
//         required: [true, "Pincode is Required"],
//       },
//     },
//     OrderItems: [
//       {
//         name: {
//           type: String,
//           required: [true, "Product is Required"],
//         },
//         price: {
//           type: String,
//           required: [true, "Price is Required"],
//         },
//         Quantity : {
//             type : Number,
//             required : [true, "Quantiy is Required"]
//         },
//         image : {
//             type  : String,
//             required : [true,"Image is Required"]
//         },
//     product : {
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "Product",
//         required : true
//     },
//     user :{
//         type : mongoose.Schema.Types.ObjectId,
//         ref:"ecommerce",
//         required : [true,"user id is required"]
//     },
//     paymentInfo : {
//         id : String,
//         status : String
//     },
//     itemPrice : {
//         type : Number,
//         required : [true, "itme price is required"]
//     },
//    tax : {
//         type : Number,
//         required : [true, "tax price is required"]
//     },
//     ShippingCharges : {
//         type : Number,
//         required : [true, "itme  ShippingCharges  is required"]
//     },
//     TotalAmount: {
//         type : Number,
//         required : [true, "TotalAmount price is required"]
//     },
//     OrderStatus : {
//         type : String,
//         enum : ["Processing", "Shipped","Deliverd"],
//         default : "processign"
//     },
//     deliverAt:Date,
    
//       },

//     ],
//     paymentModel : {
//         type : String,
//         enum : ["COd","Online"],
//         default : "Cod"
//     }

//   },
//   { timestamps: true }
// );
// const categorymodel = mongoose.model("Orders", Orderschema);
// module.exports = categorymodel;
const mongoose = require("mongoose");

const Orderschema = new mongoose.Schema(
  {
    Shippinginfo: {
      Country: {
        type: String,
        required: [true, "Country is Required"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      City: {
        type: String,
        required: [true, "City is required"],
      },
      Pincode: {
        type: Number,
        required: [true, "Pincode is required"],
      },
    },
    OrderItems: [
      {
        name: {
          type: String,
          required: [true, "Product name is required"],
        },
        price: {
          type: String,
          required: [true, "Price is required"],
        },
        Quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
        image: {
          type: String,
          required: [true, "Image is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ecommerce",
      required: [true, "User ID is required"],
    },
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "Item price is required"],
    },
    tax: {
      type: Number,
      required: [true, "Tax price is required"],
    },
    ShippingCharges: {
      type: Number,
      required: [true, "Shipping charges are required"],
    },
    TotalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    OrderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
    deliverAt: Date,
    paymentModel: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
  },
  { timestamps: true }
); 

const OrderModel = mongoose.model("Orders", Orderschema);
module.exports = OrderModel;
