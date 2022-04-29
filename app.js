require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const app = express();
const seed = require("./seed");
const prodRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const orderRoute = require("./routes/orders");
const adminRoute = require("./routes/admin");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

 mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open',() => console.log('Connected to Database'))
  
app.use(
  session({
    name: "ecomv1_id",
    secret: "thisistopsecretstuffdude",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
//Initializing..
app.use(passport.initialize());
app.use(passport.session());
//configure passport use local stratergy
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy(User.authenticate())); // for login logout session

//Configuring Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GA_clientID,
      clientSecret: process.env.GA_clientSecret,
      callbackURL: process.env.GA_callbackURL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const profileDetails = {
        username: profile.displayName,
        googleid: profile.id,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
      };
      await User.findOrCreate(profileDetails, function (err, user) {
        return done(err, user);
      });
    }
  )
);

//SERIALIZE AND DESERIALIZING
passport.serializeUser(User.serializeUser());
// passport.serializeUser((user,done)=>{
//     done(null,user);
// })
passport.deserializeUser(User.deserializeUser());
// passport.deserializeUser((user,done)=>{
//     done(null,user)
// })
//Serializing and Deserializing for google authenticate

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//seed();
//This will automatically call the flash Object
app.use((req, res, next) => {
  res.locals.status = req.flash("status");
  res.locals.register = req.flash("register");
  res.locals.login = req.flash("login");
  res.locals.loginUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use(prodRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(orderRoute);
app.use(adminRoute);
app.use('*',(req,res)=>{
  res.render('error/error')
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started at port ${process.env.PORT || 3000}`);
});
