const express = require("express");
const Campaign = require("../models/Campaign");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🟢 CREATE a new campaign
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, goalAmount } = req.body;
    const newCampaign = new Campaign({
      title,
      description,
      goalAmount,
      creator: req.user.id,
    });

    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(400).json({ message: "Campaign creation failed", error });
  }
});

// 🔵 GET all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("creator", "name email");
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching campaigns", error });
  }
});

// 🟡 GET a single campaign by ID
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("creator", "name email");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Error fetching campaign", error });
  }
});

// 🟠 UPDATE a campaign (Only Creator)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    if (campaign.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this campaign" });
    }

    const { title, description, goalAmount } = req.body;
    campaign.title = title || campaign.title;
    campaign.description = description || campaign.description;
    campaign.goalAmount = goalAmount || campaign.goalAmount;

    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Error updating campaign", error });
  }
});

// 🔴 DELETE a campaign (Only Creator)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    if (campaign.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this campaign" });
    }

    await campaign.deleteOne();
    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting campaign", error });
  }
});

module.exports = router;
