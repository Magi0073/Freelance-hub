const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  milestoneId: { type: mongoose.Schema.Types.ObjectId },
  provider: String,
  providerPaymentId: String,
  amount: Number,
  status: { type: String, enum: ['created','succeeded','failed'], default: 'created' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
