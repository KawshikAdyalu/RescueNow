const Disaster = require('../models/Disaster');

// Get all disaster reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Disaster.find()
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update disaster report action/status
exports.updateReportAction = async (req, res) => {
  try {
    const { status, assignedTo, action } = req.body;
    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) return res.status(404).json({ message: 'Not found' });

    if (status) disaster.detailedStatus = status;
    if (assignedTo) disaster.assignedTo = assignedTo;

    if (action) {
      disaster.actions.push({
        type: action.type,
        notes: action.notes,
        performedBy: req.user.id
      });
    }

    await disaster.save();

    req.app.get('io').to('admins').emit('admin-report-updated', disaster);

    res.json({ success: true, data: disaster });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
