const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    customer: {
      id: String,
      name: String,
      email: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    },
    items: [{
      productId: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      unitPrice: Number,
      subtotal: Number
    }],
    totalAmount: Number,
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,
    trackingInfo: {
      carrier: String,
      trackingNumber: String,
      status: String
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  });

  module.exports = mongoose.model('Order', orderSchema);