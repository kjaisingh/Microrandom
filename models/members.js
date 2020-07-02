/*jshint esversion: 6 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const memberSchema = new mongoose.Schema ({
  name: { type: String, default: "John Doe" },
  email: { type: String, default: "john@gmail.com" }
});

module.exports = mongoose.model("Member", memberSchema);
