const express = require("express");
const Listing = require("../models/Listing");
const Vote = require("../models/Vote");
const auth = require("../middleware/auth");

const router = express.Router();

// Vote on listing
router.post("/:listingId", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: req.user.id,
      listing: req.params.listingId,
    });

    if (existingVote) {
      // Remove vote
      await Vote.deleteOne({ _id: existingVote._id });
      listing.voters = listing.voters.filter(
        (v) => v.toString() !== req.user.id,
      );
      listing.voteCount = Math.max(0, listing.voteCount - 1);
      await listing.save();

      return res.json({
        success: true,
        message: "Vote removed",
        voteCount: listing.voteCount,
        voted: false,
      });
    }

    // Add vote
    const vote = new Vote({
      user: req.user.id,
      listing: req.params.listingId,
    });

    await vote.save();

    if (!listing.voters.includes(req.user.id)) {
      listing.voters.push(req.user.id);
      listing.voteCount += 1;
    }

    await listing.save();

    res.json({
      success: true,
      message: "Vote added",
      voteCount: listing.voteCount,
      voted: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while voting",
    });
  }
});

// Check if user voted
router.get("/:listingId/check", auth, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      user: req.user.id,
      listing: req.params.listingId,
    });

    res.json({
      success: true,
      voted: !!vote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
