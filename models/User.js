const mongoose = require("mongoose");
const Joi = require("joi");

const addressSchema = mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zip: {
    type: Number,
    required: true,
    min: 10000, // Assuming a minimum of 5 digits for ZIP code
    max: 99999, // Assuming a maximum of 5 digits for ZIP code
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
    },
    password: {
      type: String,
      minlength: 6,
    },
    phone: {
      type: Number,
      match: /^[0-9]{10}$/, // Assuming a 10-digit phone number
    },
    address: [addressSchema],
  },
  { timestamps: true }
);

const validateUser = (data) => {
  const addressSchema = Joi.object({
    city: Joi.string().required().trim(),
    state: Joi.string().required().trim(),
    zip: Joi.number().required().min(10000).max(99999),
    address: Joi.string().required().trim(),
  });

  const schema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/),
    address: Joi.array().items(addressSchema),
  });

  return schema.validate(data);
};

const userModel = mongoose.model("User", userSchema);

module.exports = {
  userModel,
  validateUser,
};
