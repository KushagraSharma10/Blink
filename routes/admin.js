const express = require("express");
const router = express.Router();
const { adminModel } = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateAdmin = require("../middlewares/admin");

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

            let token = jwt.sign({ email: "Kushagra@123.com" }, process.env.JWT_KEY)
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
        let token = jwt.sign({ email: "Kushagra@123.com" }, process.env.JWT_KEY)
        res.cookie("token", token)
        res.redirect("/admin/dashboard")
    }
  })
  
  router.get("/dashboard", validateAdmin  , (req,res)=>{
    res.render("admin_Dashboard")
  }) 
  router.get("/logout", validateAdmin  , (req,res)=>{
    res.cookie("token", "")
    res.redirect("/admin/login") 
  })  
}
module.exports = router;
