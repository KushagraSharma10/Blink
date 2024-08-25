const jwt = require("jsonwebtoken")

async function validateAdmin (req, res, next){
    try{
        const token = req.cookies.token;
        if(!token) return res.send("you need to login first")
        let data  = await jwt.verify(token, process.env.JWT_KEY);
        req.user = data;
        next();
    }catch(err){
        return res.send(err.message)
    }
}

module.exports = validateAdmin;