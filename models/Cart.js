const mongoose = require("mongoose");
const Joi = require("joi");

const cartSchema = mongoose.Schema(
  {
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
      min: 0,  // Ensure totalPrice is non-negative
    },
  },
  { timestamps: true }
);
const validateCart = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),  // Expecting a valid ObjectId in string format
    products: Joi.array()
      .items(Joi.string().required())  // Each product should be a valid ObjectId
      .required(),
    totalPrice: Joi.number().min(0).required(),
  });

  return schema.validate(data);
};

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = {
  cartModel,
  validateCart,
};



