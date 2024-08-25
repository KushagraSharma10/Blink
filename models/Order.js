const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,  // Ensure the total price is non-negative
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,  // Ensure the address has a reasonable length
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],  // Define order statuses
    default: "pending",
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
    required: true,
  },
}, { timestamps: true });



const validateOrder = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),  // Expecting a valid ObjectId in string format
    products: Joi.array()
      .items(Joi.string().required())  // Each product should be a valid ObjectId
      .required(),
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string().min(5).required().trim(),
    status: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "cancelled").required(),
    payment: Joi.string().required(),  // Expecting a valid ObjectId in string format
    delivery: Joi.string().required(),  // Expecting a valid ObjectId in string format
  });

  return schema.validate(data);
};

const orderModel = mongoose.model("Order", orderSchema);

module.exports = {
  orderModel,
  validateOrder,
};