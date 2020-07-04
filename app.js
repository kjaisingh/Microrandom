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
  email: "john@microrandom.com"
});

const memberTwo = new Member({
  name: "Rohit Singh",
  email: "rohit@microrandom.com"
});
const memberThree = new Member({
  name: "Rebecca Tobey",
  email: "becca@microrandom.com"
});
const memberFour = new Member({
  name: "Kevin Lee",
  email: "kevin@microrandom.com"
});
const memberFive = new Member({
  name: "Kayla Harris",
  email: "kayla@microrandom.com"
});
const memberSix = new Member({
  name: "Jeffery Hughes",
  email: "jeff@microrandom.com"
});
const memberSeven = new Member({
  name: "Noor Ismail",
  email: "noor@microrandom.com"
});
const memberEight = new Member({
  name: "Obadiye Diallo",
  email: "obadiye@microrandom.com"
});
const memberNine = new Member({
  name: "William Barton",
  email: "will@microrandom.com"
});
const memberTen = new Member({
  name: "Samantha Kim",
  email: "samantha@microrandom.com"
});

const defaultMembersOne = [
  memberOne, memberTwo, memberThree
];

const defaultMembersTwo = [
  memberFour, memberFive, memberSix
];

const defaultMembersThree = [
  memberSeven, memberEight
];

const defaultMembersFour = [
  memberNine, memberTen
];

const defaultGroupOne = new Group({
  name: "CIS 120",
  description: "Programming Languages & Technologies.",
  members: defaultMembersOne
});
const defaultGroupTwo = new Group({
  name: "CIS 121",
  description: "Data Structures & Algorithms.",
  members: defaultMembersTwo
});
const defaultGroupThree = new Group({
  name: "CIS 160",
  description: "Mathematics of Computer Science.",
  members: defaultMembersThree
});
const defaultGroupFour = new Group({
  name: "CIS 240",
  description: "Computer Architecutre",
  members: defaultMembersFour
});

const defaultGroups = [defaultGroupOne, defaultGroupTwo, defaultGroupThree, defaultGroupFour];


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
// GET REQUESTS - AUTH
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


// -------------------------
// POST REQUESTS - AUTH
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
// GET REQUESTS - MAIN
// -------------------------
app.get("/generate", function(req, res) {
  if(req.isAuthenticated()) {
    const currentUsername = req.user.username;

    const result = User.findOne({ username: currentUsername }, function(err, foundUser) {
      const userGroups = foundUser.groups;
      res.render("generate", {userId: foundUser._id, groups: userGroups});
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/create", function(req, res) {
  if(req.isAuthenticated()) {
    const currentUsername = req.user.username;

    const result = User.findOne({ username: currentUsername }, function(err, foundUser) {
      res.render("create");
    });
  } else {
    res.redirect(req.baseUrl + "/login");
  }
});

app.get("/:groupId/generate", function(req, res) {
  if(req.isAuthenticated()) {
    const currentUsername = req.user.username;
    const requestedGroupId = req.params.groupId;

    const result = User.findOne({ username: currentUsername }, function(err, foundUser) {
      const requestedUserId = foundUser._id;
      const foundGroup = foundUser.groups.id(requestedGroupId);
      res.render("group", { userId: requestedUserId, groupItem: foundGroup });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/:userId/:groupId/options", function(req, res) {
  res.render("options");
});


// -------------------------
// POST REQUESTS - MAIN
// -------------------------
app.post("/createGroup", function(req, res) {
  if(req.isAuthenticated()) {
    const currentUsername = req.user.username;
    const result = User.findOne({ username: currentUsername }, function(err, foundUser) {
      foundUser.groups.push(new Group({
        name: req.body.inputGroupName,
        description: req.body.inputGroupDescription
      }));
      foundUser.save();
    });
    res.redirect(req.baseUrl + "/generate");
  } else {
    res.redirect(req.baseUrl + "/login");
  }
});

app.post("/deleteMember", function(req, res) {
  if(req.isAuthenticated()) {
    const requestedUserId = req.body.userId;
    const requestedGroupId = req.body.groupId;
    const requestedMemberId = req.body.memberId;

    const result = User.findOne({ _id: requestedUserId }, function(err, foundUser) {
      const foundGroup = foundUser.groups.id(requestedGroupId);
      foundGroup.members.id(requestedMemberId).remove();
      foundUser.save();
      res.redirect(req.baseUrl + "/" + requestedUserId + "/" + requestedGroupId + "/" + "generate");
    });
  } else {
    res.redirect(req.baseUrl + "/login");
  }
});

app.post("/deleteGroup", function(req, res) {
  if(req.isAuthenticated()) {
    const currentUsername = req.user.username;
    const requestedGroupId = req.body.groupId;

    const result = User.findOne({ username: currentUsername }, function(err, foundUser) {
      const foundGroup = foundUser.groups.id(requestedGroupId);
      foundGroup.remove();
      foundUser.save();
      res.redirect(req.baseUrl + "/generate");
    });
  } else {
    res.redirect(req.baseUrl + "/login");
  }
});


// ----------------------------
// GET/POST REQUESTS - MEMBERS
// ----------------------------
app.get("/:userId/:groupId/join-group", function(req, res) {
  res.render("join");
});


// -------------------------
// SETUP
// -------------------------
// adding new member to a particular group
/*
foundUser.groups[0].members.push(new Member({
  name: "Karan Jaisingh",
  email: "karan@microrandom.com"
}));
foundUser.save();
*/

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
