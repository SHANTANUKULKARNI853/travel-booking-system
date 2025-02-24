const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  travelers: { type: Number, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);
