// backend/models/transactionModel.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.000001
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected", "cancelled"],
      default: "pending"
    },
    note: {
      type: String,
      default: null
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    processedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Virtual for total value
transactionSchema.virtual('totalValue').get(function() {
  return this.quantity * this.price;
});

// Create mongoose model
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;