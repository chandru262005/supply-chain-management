const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  reorderPoint: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  location: {
    warehouse: String,
    aisle: String,
    shelf: String
  },
  supplier: {
    id: String,
    name: String,
    leadTime: Number // in days
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  movementHistory: [{
    date: Date,
    quantity: Number,
    type: {
      type: String,
      enum: ['received', 'shipped', 'adjusted']
    },
    reference: String // Order ID or adjustment reference
  }]
});