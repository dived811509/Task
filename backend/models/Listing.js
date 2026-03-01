const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 2000,
  },
  category: {
    type: String,
    required: true,
    enum: ["Services", "Products", "Jobs", "Events", "Other"],
  },
  price: {
    type: Number,
    min: 0,
    default: 0,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  authorUsername: {
    type: String,
    required: true,
  },
  authorDiscord: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: "Online",
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  imageUrl: {
    type: String,
    default: "https://via.placeholder.com/300?text=No+Image",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Listing", listingSchema);
