const express = require("express");
const Listing = require("../models/Listing");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, category, price, location, imageUrl } =
      req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required",
      });
    }

    if (title.length < 3 || title.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Title must be between 3 and 100 characters",
      });
    }

    if (description.length < 10 || description.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Description must be between 10 and 2000 characters",
      });
    }

    if (
      !["Services", "Products", "Jobs", "Events", "Other"].includes(category)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    if (price && (price < 0 || typeof price !== "number")) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const listing = new Listing({
      title,
      description,
      category,
      price: price || 0,
      location: location || "Online",
      imageUrl: imageUrl || "https://via.placeholder.com/300?text=No+Image",
      author: req.user.id,
      authorUsername: user.username,
      authorDiscord: user.discordUsername,
    });

    await listing.save();

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while creating listing",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    let listings = await Listing.find(query)
      .populate("author", "username discordUsername")
      .lean();

    if (sort === "newest") {
      listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "votes") {
      listings.sort((a, b) => b.voteCount - a.voteCount);
    } else if (sort === "price-low") {
      listings.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      listings.sort((a, b) => b.price - a.price);
    }

    res.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching listings",
    });
  }
});

// Get single listing
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("author", "username discordUsername email")
      .populate("voters", "username");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching listing",
    });
  }
});

// Update listing
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, category, price, location, imageUrl } =
      req.body;

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check authorization
    if (listing.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this listing",
      });
    }

    // Update fields if provided
    if (title) {
      if (title.length < 3 || title.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Title must be between 3 and 100 characters",
        });
      }
      listing.title = title;
    }

    if (description) {
      if (description.length < 10 || description.length > 2000) {
        return res.status(400).json({
          success: false,
          message: "Description must be between 10 and 2000 characters",
        });
      }
      listing.description = description;
    }

    if (category) {
      if (
        !["Services", "Products", "Jobs", "Events", "Other"].includes(category)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }
      listing.category = category;
    }

    if (price !== undefined) {
      if (price < 0 || typeof price !== "number") {
        return res.status(400).json({
          success: false,
          message: "Price must be a non-negative number",
        });
      }
      listing.price = price;
    }

    if (location) listing.location = location;
    if (imageUrl) listing.imageUrl = imageUrl;

    listing.updatedAt = Date.now();
    await listing.save();

    res.json({
      success: true,
      message: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while updating listing",
    });
  }
});

// Delete listing
router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check authorization
    if (listing.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing",
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting listing",
    });
  }
});

module.exports = router;
