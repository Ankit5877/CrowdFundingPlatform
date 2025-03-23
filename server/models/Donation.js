const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  amount: Number,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
