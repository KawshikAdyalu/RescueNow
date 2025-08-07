const Sos = require('../models/Sos');
const getAllSos = async (req, res) => {
  try {
    const sosList = await Sos.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: sosList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const sendSos = async (req, res) => {
  try {
    const { lat, lng, message } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location is required (lat, lng).' });
    }

    const sos = new Sos({
      userId: req.user.id,
      message: message || 'Emergency!',
      coordinates: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    });

    await sos.save();

    // 🔴 Broadcast SOS in real time via Socket.IO
    req.app.get('io').emit('sos-alert', sos);

    res.status(201).json({
      success: true,
      message: 'SOS alert sent.',
      data: sos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendSos,getAllSos };