const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  destination: String,
  date: String,
  travelers: Number,
});

module.exports = mongoose.model("Booking", bookingSchema);
