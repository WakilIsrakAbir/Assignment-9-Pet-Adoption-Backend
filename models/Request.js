const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  ownerEmail: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
