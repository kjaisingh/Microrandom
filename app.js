/*jshint esversion: 6 */


// -------------------------
// REQUIREMENTS
// -------------------------
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require('path');
const User = require('./models/users');
const Group = require('./models/groups');
const Member = require('./models/members');

// -------------------------
// DEFAULTS
// -------------------------
const memberOne = new Member({
  name: "John Doe",
  description: "john@microrandom.com"
});

const memberTwo = new Member({
  name: "Rohit Singh",
  description: "rohit@microrandom.com"
});
const memberThree = new Member({
  name: "Jack Tobey",
  description: "jack@microrandom.com"
});
const memberFour = new Member({
  name: "Kevin Lee",
  description: "kevin@microrandom.com"
});
const memberFive = new Member({
  name: "Jamal Harris",
  description: "jamal@microrandom.com"
});
const defaultMembers = [memberOne, memberTwo, memberThree, memberFour, memberFive];

const defaultGroup = new Group({
  name: "CIS 121",
  description: "Your default class.",
  members: defaultMembers
});
console.log(defaultGroup.members);
const defaultGroups = [defaultGroup];


// -------------------------
// INITIALIZATION
// -------------------------
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/microrandomDB", { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// -------------------------
// GET REQUESTS
// -------------------------
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/generate", function(req, res) {
  if(req.isAuthenticated()) {
    res.render("generate");
  } else {
    res.redirect("/login");
  }
});


// -------------------------
// POST REQUESTS
// -------------------------
app.post("/register", function(req, res) {
  User.register({
    username: req.body.username,
    name: req.body.name,
    groups: defaultGroups
  },
  req.body.password,
  function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/generate");
      });
    }
  });
});

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local");
      passport.authenticate("local")(req, res, function() {
        res.redirect("/generate");
      });
    }
  });
});


// -------------------------
// SETUP
// -------------------------
app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
