// routes/auth-routes.js
const ensureLogin = require("connect-ensure-login");


const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

var checkUsuario = checkRoles('USUARIO');
var checkAdmin  = checkRoles('ADMIN');


authRoutes.get("/private-page", checkAdmin, (req, res) => {
  res.render("private", { user: req.user });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login",{"message":req.flash("error")});
});

authRoutes.get("/usuario", (req, res, next) => {
   res.render("auth/usuario",{"message":req.flash("error")});
 });

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/login");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// router.get('/rooms', ensureAuthenticated, (req, res, next) => {

//   Room.find({owner: req.user._id}, (err, myRooms) => {
//     if (err) { return next(err); }

//     res.render('rooms/index', { rooms: myRooms });
//   });

// });

// router.post('/rooms', ensureAuthenticated, (req, res, next) => {
//   const newRoom = new Room ({
//     name:  req.body.name,
//     desc:  req.body.desc,
//     owner: req.user._id   // <-- we add the user ID
//   });

//   newRoom.save ((err) => {
//     if (err) { return next(err); }
//     else {
//       res.redirect('/rooms');
//     }
//   })
// });

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}
module.exports = authRoutes;