const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  threshold: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String, 
    required: true
  }
});

const Badge = mongoose.model("Badge", badgeSchema);
module.exports = Badge;
