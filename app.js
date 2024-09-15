const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/auth")
const adminRouter = require("./routes/admin")
const productRouter = require("./routes/product")
const categoriesRouter = require("./routes/category")
const usersRouter = require("./routes/user")
const expressSession = require("express-session")
const path = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");

app.use(cookieParser())
require("dotenv").config();
require("./config/google_oauth_config");        
require("./config/db");


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/categories", categoriesRouter)
app.use("/users", usersRouter)

app.listen(3000);
