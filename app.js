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
const generateGroups = require('./microrandom.js');

// -------------------------
// DEFAULTS
// -------------------------
const memberOne = new Member({
  name: "John Doe",
  email: "john@microrandom.com",
  age: 16.5,
  gender: "Male",
  ethnicity: "American Indian",
  religion: "Christian"
});

const memberTwo = new Member({
  name: "Rohit Singh",
  email: "rohit@microrandom.com",
  age: 20.5,
  gender: "Male",
  ethnicity: "Asian",
  religion: "Hindu"
});
const memberThree = new Member({
  name: "Rebecca Tobey",
  email: "becca@microrandom.com",
  age: 18.5,
  gender: "Female",
  ethnicity: "Caucasian",
  religion: "Jewish"
});
const memberFour = new Member({
  name: "Kevin Lee",
  email: "kevin@microrandom.com",
  age: 24.5,
  gender: "Male",
  ethnicity: "Hispanic",
  religion: "Buddhist"
});
const memberFive = new Member({
  name: "Kayla Harris",
  email: "kayla@microrandom.com",
  age: 20.5,
  gender: "Female",
  ethnicity: "African American",
  religion: "Muslim"
});
const memberSix = new Member({
  name: "Jeffery Hughes",
  email: "jeff@microrandom.com",
  age: 22.5,
  gender: "Other",
  ethnicity: "Pacific Islander",
  religion: "None"
});
const memberSeven = new Member({
  name: "Noor Ismail",
  email: "noor@microrandom.com",
  age: 16.5,
  gender: "Female",
  ethnicity: "Asian",
  religion: "Buddhist"
});
const memberEight = new Member({
  name: "Obadiye Diallo",
  email: "obadiye@microrandom.com",
  age: 18.5,
  gender: "Male",
  ethnicity: "American Indian",
  religion: "Muslim"
});
const memberNine = new Member({
  name: "William Barton",
  email: "will@microrandom.com",
  age: 24.5,
  gender: "Other",
  ethnicity: "Caucasian",
  religion: "Other"
});

const defaultMembersOne = [
  memberOne, memberTwo, memberThree,
  memberFour, memberFive, memberSix,
  memberSeven, memberEight, memberNine
];

const defaultGroupOne = new Group({
  name: "CIS 120",
  description: "Programming Languages & Technologies",
  members: defaultMembersOne
});

const defaultGroups = [defaultGroupOne];


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

app.get("/:groupId/options", function(req, res) {
  res.render("options", { groupId: req.params.groupId });
});

app.get("/:groupId/create-num-groups", function(req, res) {
  if(req.isAuthenticated()) {
    const currentUsername = req.user.username;
    const requestedGroupId = req.params.groupId;
    const requestedNumGroups = req.query.inputNumGroups;

    const result = User.findOne({ username: currentUsername }, function(err, foundUser) {
      const foundGroup = foundUser.groups.id(requestedGroupId);
      const foundMembers = foundGroup.members;

      const maxGroup = requestedNumGroups;
      const groupings = generateGroups(foundMembers, maxGroup);
      
      res.render("view", { groupings: groupings });
    });
  } else {
    res.redirect(req.baseUrl + "/login");
  }
});

app.get("/:groupId/create-max-group", function(req, res) {
  if(req.isAuthenticated()) {
    const currentUsername = req.user.username;
    const requestedGroupId = req.params.groupId;
    const requestedMaxGroup = req.query.inputMaxGroup;

    const result = User.findOne({ username: currentUsername }, function(err, foundUser) {
      const foundGroup = foundUser.groups.id(requestedGroupId);
      const foundMembers = foundGroup.members;

      const maxGroup = requestedMaxGroup;
      const groupings = generateGroups(foundMembers, maxGroup);

      res.render("view", { groupings: groupings });
    });
  } else {
    res.redirect(req.baseUrl + "/login");
  }
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
  res.render("join", { userId: req.params.userId, groupId: req.params.groupId });
});

app.post("/:userId/:groupId/joined-group", function(req, res) {
  const requestedUserId = req.params.userId;
  const requestedGroupId = req.params.groupId;

  const requestedUserName = req.body.joinGroupName;
  const requestedUserEmail = req.body.joinGroupEmail;
  const requestedUserGender = req.body.joinGroupGender;

  const inputUserAge = req.body.joinGroupAge;
  var requestedUserAge;
  switch(inputUserAge) {
    case "< 18":
      requestedUserAge = 16.5;
      break;
    case "18-19":
      requestedUserAge = 18.5;
      break;
    case "20-21":
      requestedUserAge = 20.5;
      break;
    case "22-23":
      requestedUserAge = 22.5;
      break;
    case "24+":
      requestedUserAge = 24.5;
      break;
    default:
      requestedUserAge = 20.5;
  }

  const requestedUserEthnicity = req.body.joinGroupEthnicity;
  const requestedUserReligion = req.body.joinGroupReligion;

  const result = User.findOne({ _id: requestedUserId }, function(err, foundUser) {
    const foundGroup = foundUser.groups.id(requestedGroupId);
    foundGroup.members.push(new Member({
      name: requestedUserName,
      email: requestedUserEmail,
      age: requestedUserAge,
      gender: requestedUserGender,
      ethnicity: requestedUserEthnicity,
      religion: requestedUserReligion
    }));
    foundUser.save();
  });
  res.redirect(req.baseUrl + "/");
});


// -------------------------
// SETUP
// -------------------------

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
