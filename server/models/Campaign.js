const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  goalAmount: Number,
  raisedAmount: { type: Number, default: 0 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", CampaignSchema);
