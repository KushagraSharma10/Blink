const mongoose = require("mongoose");
const Joi = require("joi");

const deliverySchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    deliveryBoy: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,  // Ensure the delivery boy's name has at least 2 characters
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "dispatched", "in transit", "delivered", "cancelled"],  // Add more statuses as needed
      default: "pending",
    },
    trackingURL: {
      type: String,
      required: true, 
    },
    estimatedDeliveryTime: {
      type: Number,
      required: true,
      min: 0,  // Ensure estimated delivery time is non-negative
    },
  },
  { timestamps: true }
);


const validateDelivery = (data) => {
  const schema = Joi.object({
    order: Joi.string().required(),  // Expecting a valid ObjectId in string format
    deliveryBoy: Joi.string().min(2).required().trim(),
    status: Joi.string().valid("pending", "dispatched", "in transit", "delivered", "cancelled").required(),
    trackingURL: Joi.string().uri().required(),  // Ensure the tracking URL is valid
    estimatedDeliveryTime: Joi.number().min(0).required(),
  });
  

  return schema.validate(data);
};

const deliveryModel = mongoose.model("Delivery", deliverySchema);

module.exports = {
  deliveryModel,
  validateDelivery,
};
