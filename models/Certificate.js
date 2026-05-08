const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  name: String,
  role: String,
  event: String,
  date: String,
  certificateId: String,
});

module.exports = mongoose.model(
  "Certificate",
  certificateSchema
);