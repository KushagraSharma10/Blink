const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,  // Ensure the category name has at least 2 characters
    },
  }
);


const validateCategory = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required().trim(),
  });
  
  return schema.validate(data);
};

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = {
  categoryModel,
  validateCategory,
};
