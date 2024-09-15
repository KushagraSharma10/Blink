const express = require("express");
const { userModel, validateUser } = require("../models/User");
const router = express.Router();

router.get("/login", (req,res)=>{
    res.render("user_login")
})


router.get("/profile", (req,res)=>{
    res.send("Profile page")
})

router.get("/logout", (req,res,next)=>{
    req.logout((err) => {
        if(err) {
            return next(err)
        }

        req.session.destroy((err)=>{
            if(err) {
                return next(err)
            }
            res.clearCookie('connect.sid')
            res.redirect('/users/login')
        })
    })
})

module.exports = router;
