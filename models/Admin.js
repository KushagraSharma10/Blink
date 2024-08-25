const mongoose = require("mongoose");
const Joi = require("joi");

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Advanced email regex
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "superadmin"], // Example roles; adjust as needed
  },
});

const validateAdmin = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "superadmin", "editor").required(), // Match roles in Mongoose schema
  });

  return schema.validate(data);
};

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = {
  adminModel,
  validateAdmin,
};
