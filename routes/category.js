const express = require("express");
const validateAdmin = require("../middlewares/admin");
const router = express.Router();
const { categoryModel } = require("../models/Category");

router.post("/create", validateAdmin, async (req,res)=>{
    const {name} = req.body;
    let category = await categoryModel.create({
        name
    })

    res.redirect("back");
})

module.exports = router;
