const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  coverLetter: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);
