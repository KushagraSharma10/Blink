const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,  // Ensure the product name has at least 2 characters
  },
  price: {
    type: Number,
    required: true,
    min: 0,  // Ensure the price is non-negative
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
}, { timestamps: true });

const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required().trim(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required().trim(),
    stock: Joi.boolean().required(),
    description: Joi.string(), 
    image: Joi.string(), 
  });

  return schema.validate(data);
};

const productModel = mongoose.model("Product", productSchema);

module.exports = {
  productModel,
  validateProduct,
};



