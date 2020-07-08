/*jshint esversion: 6 */

const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const Group = require('./groups');

const groupSchema = Group.schema;
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema ({
  username: { type: String, required: true },
  name: { type: String, required: true,
          minlength: [2, 'Username must be at least 2 characters.'],
          maxlength: [20, 'Username must be less than 20 characters.'] },
  password: String,
  groups: [groupSchema]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
