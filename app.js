//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/microrandomDB", { useNewUrlParser: true, useUnifiedTopology: true});

const teacherSchema = {
  name: String,
  email: String,
  password: String
}
const Teacher = new mongoose.model("Teacher", teacherSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newTeacher = new Teacher({
    name: req.body.fullname,
    email: req.body.email,
    password: req.body.password
  });
  newTeacher.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.render("generate");
    }
  });
});

app.post("/login", function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  Teacher.findOne({email: email}, function(err, foundTeacher) {
    if(err) {
      console.log(err);
    } else {
      if(foundTeacher) {
        if(foundTeacher.password === password) {
          res.render("generate");
        }
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
