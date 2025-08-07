const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    default: 'Emergency! Please help.'
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'responded', 'resolved'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

sosSchema.index({ coordinates: '2dsphere' }); // for geo queries if needed

module.exports = mongoose.model('Sos', sosSchema);
