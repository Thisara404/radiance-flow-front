const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['class', 'event', 'monthly_tuition', 'registration', 'workshop', 'costume'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.ObjectId,
    refPath: 'itemModelName',
    required: function() {
      return ['class', 'event'].includes(this.itemType);
    }
  },
  itemModelName: {
    type: String,
    enum: ['Class', 'Event'],
    required: function() {
      return ['class', 'event'].includes(this.itemType);
    }
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  amountLKR: {
    type: Number,
    required: true
  },
  exchangeRate: {
    type: Number,
    default: 303
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  paypalOrderId: {
    type: String,
    unique: true,
    sparse: true
  },
  paypalCaptureId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'paypal'
  },
  paymentDate: {
    type: Date
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: {
    type: Date
  },
  refundReason: {
    type: String
  },
  isRefundable: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ paypalOrderId: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for checking if payment is refundable (within 7 days)
paymentSchema.virtual('canRefund').get(function() {
  if (!this.isRefundable || this.status !== 'completed') return false;
  
  const paymentDate = this.paymentDate || this.createdAt;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return paymentDate > sevenDaysAgo;
});

paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);