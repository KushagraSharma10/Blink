const mongoose = require("mongoose");
const Joi = require("joi");

const paymentSchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,  // Ensure the payment amount is non-negative
  },
  method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  transactionID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});



const validatePayment = (data) => {
  const schema = Joi.object({
    order: Joi.string().required(),  
    amount: Joi.number().min(0).required(),
    method: Joi.string().required(),
    status: Joi.string().required(),
    transactionID: Joi.string().required().trim(),
  });

  return schema.validate(data);
};

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = {
  paymentModel,
  validatePayment,
};
