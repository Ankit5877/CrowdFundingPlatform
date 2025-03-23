const express = require("express");
const Donation = require("../models/Donation");
const User = require("../models/User");
const Badge = require("../models/Badge");

const router = express.Router();

// 🔥 🏆 Get Top Donors (Leaderboard)
router.get("/top-donors", async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      {
        $group: {
          _id: "$donor",
          totalDonated: { $sum: "$amount" }
        }
      },
      { $sort: { totalDonated: -1 } },
      { $limit: 10 }
    ]);

    // Populate donor details
    const donorsWithDetails = await Promise.all(
      topDonors.map(async (donor) => {
        const user = await User.findById(donor._id).select("name email");
        return {
          donor: user,
          totalDonated: donor.totalDonated
        };
      })
    );

    res.json(donorsWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
});

// 🏅 Assign Badges Based on Donations
router.get("/badges/:userId", async (req, res) => {
  try {
    const totalDonated = await Donation.aggregate([
      { $match: { donor: req.params.userId } },
      { $group: { _id: null, totalDonated: { $sum: "$amount" } } }
    ]);

    if (totalDonated.length === 0) {
      return res.json({ badge: "No Badge Yet" });
    }

    const amount = totalDonated[0].totalDonated;
    let badge = "Supporter";

    if (amount >= 5000) badge = "Legendary Donor";
    else if (amount >= 1000) badge = "Gold Supporter";
    else if (amount >= 500) badge = "Silver Supporter";
    else if (amount >= 100) badge = "Bronze Supporter";

    res.json({ badge });
  } catch (error) {
    res.status(500).json({ message: "Error fetching badge", error });
  }
});

module.exports = router;
