const express = require("express");
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🟢 Make a Donation
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, campaignId } = req.body;
    if (!amount || !campaignId) {
      return res.status(400).json({ message: "Amount and campaignId are required" });
    }

    // Create a new donation
    const donation = new Donation({
      amount,
      donor: req.user.id,
      campaign: campaignId,
    });

    await donation.save();

    // Update the campaign's raisedAmount
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    campaign.raisedAmount += amount;
    await campaign.save();

    res.status(201).json({ message: "Donation successful!", donation });
  } catch (error) {
    res.status(500).json({ message: "Error processing donation", error });
  }
});

// 🔵 Get all donations for a campaign
router.get("/campaign/:campaignId", async (req, res) => {
  try {
    const donations = await Donation.find({ campaign: req.params.campaignId })
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
});

// 🟡 Get all donations made by a user
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate("campaign", "title")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user donations", error });
  }
});

module.exports = router;
