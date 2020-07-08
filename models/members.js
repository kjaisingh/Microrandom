/*jshint esversion: 6 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const memberSchema = new mongoose.Schema ({
  name: { type: String },
  email: { type: String},
  age: { type: Number,
    enum: [16.5, 18.5, 20.5, 22.5, 24.5] },
  gender: { type: String,
    enum: ["Male", "Female", "Other"] },
  ethnicity: { type: String,
    enum: ["American Indian", "Asian", "African American", "Caucasian", "Hispanic", "Pacific Islander"] },
  religion: { type: String,
    enum: ["Christian", "Muslim", "Buddhist", "Hindu", "Jewish", "Other", "None"] }
});

module.exports = mongoose.model("Member", memberSchema);
