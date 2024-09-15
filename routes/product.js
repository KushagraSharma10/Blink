const express = require("express");
const { productModel, validateProduct } = require("../models/Product");
const validateAdmin = require("../middlewares/admin");
const router = express.Router();
const upload = require("../config/multer_config");
const { categoryModel } = require("../models/Category");


router.get("/", async (req, res) => {
  try {
    const prods = await productModel.find();
    res.render("index");
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  let { name, price, description, stock, category, image } = req.body;
  let { error } = validateProduct({
    name,
    price,
    description,
    stock,
    category,
    image,
  });

  if (error) return res.send(error.message);

  let isCategory = await categoryModel.findOne({ name: category });
  if (!isCategory) {
    await categoryModel.create({ name: category });
  }

  let product = await productModel.create({
    name,
    price,
    description,
    stock,
    category,
    image: req.file.buffer,
  });

  res.redirect("admin/products" );
});

router.get("/delete/:id", validateAdmin, async (req, res) => {
  if(req.user.admin){
    const prods= await productModel.findOneAndDelete({ _id: req.params.id });
    return res.redirect("/admin/products");
  }
  res.send("You are not allowed to delete this product.")
});


router.post("/delete/", validateAdmin, async (req, res) => {
  if(req.user.admin){
    const prods= await productModel.findOneAndDelete({ _id: req.body.product_id });
    return res.redirect("back");
  }
  res.send("You are not allowed to delete this product.")
});


module.exports = router;
