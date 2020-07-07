/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Member = require('./members');

const memberSchema = Member.schema;
const Schema = mongoose.Schema;

const groupSchema = new mongoose.Schema ({
  name: String,
  description: String,
  members: [memberSchema]
});

module.exports = mongoose.model("Group", groupSchema);
