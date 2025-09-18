const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: String,
  description: String,
  amount: Number,
  dueDate: Date,
  status: { type: String, enum: ['pending','funded','completed','released'], default: 'pending' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  budgetMin: Number,
  budgetMax: Number,
  status: { type: String, enum: ['open','in_progress','completed','cancelled'], default: 'open' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedBid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
  milestones: [milestoneSchema]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
