/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Member = require('./members');

const memberSchema = Member.schema;
const Schema = mongoose.Schema;

const groupSchema = new mongoose.Schema ({
  name: { type: String, default: "CIS 120" },
  description: { type: String, default: "My brilliant class." },
  members: {type: [memberSchema], default: []}
});

module.exports = mongoose.model("Group", groupSchema);
