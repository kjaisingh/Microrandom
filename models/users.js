/*jshint esversion: 6 */

const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const Group = require('./groups');

const groupSchema = Group.schema;
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema ({
  username: String,
  name: String,
  password: String,
  groups: [groupSchema]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
