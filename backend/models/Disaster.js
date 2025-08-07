const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
   assignedTo: { type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
      default: null },
  detailedStatus: 
  { type: String,
     enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending' },
  actions: [{
    type: { type: String,
       enum: ['supply_food', 'relocate', 'provide_treatment',
         'communication', 'other'], required: true },
    notes: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
}, {
  timestamps: true});

disasterSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Disaster', disasterSchema);
