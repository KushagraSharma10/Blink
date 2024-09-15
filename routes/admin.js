const express = require("express");
const router = express.Router();
const { adminModel } = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateAdmin = require("../middlewares/admin");
const { productModel } = require("../models/Product");
const { categoryModel } = require("../models/Category");

require("dotenv").config()

if (
    typeof process.env.NODE_ENV !== undefined &&
    process.env.NODE_ENV === "development"
) {
    router.get("/create", async function (req, res) {
        try {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
            // const { name, password, email, role } = req.body;
            let admin = await adminModel.create({
                name: "Kushagra",
                password: hash,
                email: "Kushagra@123.com",
                role: "admin",
            });
            await admin.save();

            let token = jwt.sign({ email: "Kushagra@123.com" , admin: true }, process.env.JWT_KEY)
            res.cookie("token", token)
            res.send("admin Created successfully")
        } catch(err){
            res.send(err.message)
        }
  });

  router.get("/login", (req,res)=>{
    res.render("admin_login")
  })
  router.post("/login", async (req,res)=>{
    let {email, password} = req.body;
    let admin = await adminModel.findOne({email})

    if(!admin) return res.send("this admin is not available")

    let valid = await bcrypt.compare(password, admin.password);
    if(valid){
        let token = jwt.sign({ email: "Kushagra@123.com", admin: true }, process.env.JWT_KEY)
        res.cookie("token", token)
        res.redirect("/admin/dashboard")
    }
  })
  
  router.get("/dashboard", validateAdmin , async (req,res)=>{
    let prodcount = await productModel.countDocuments();
    let categcount = await categoryModel.countDocuments();
    res.render("admin_Dashboard", {prodcount , categcount})
  }) 
   router.get("/products", validateAdmin  ,async (req,res)=>{
    const result = await productModel.aggregate([
      {
        $group: {
          _id: '$category',  // Group by the category field directly (as it's a String)
          products: {
            $push: {
              _id: '$_id',
              name: '$name',
              category: '$category',  // Keep the category as String
              price: '$price',
              description: '$description',
              stock: '$stock',
              image: '$image',
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',              // Rename _id to category
          products: { $slice: ['$products', 10] }  // Limit products to the first 10
        }
      }
    ]);
  
    // Transform the result into the desired format
    const formattedResult = result.reduce((acc, categoryData) => {
      acc[categoryData.category] = categoryData.products;
      return acc;
    }, {});
  
   res.render("admin_products", { products: formattedResult})
   
  }) 
  router.get("/logout", validateAdmin  , (req,res)=>{
    res.cookie("token", "")
    res.redirect("/admin/login") 
  })  
}
module.exports = router;
