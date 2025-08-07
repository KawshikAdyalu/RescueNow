const User = require('../models/User');

// Admin update user details
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    if (req.user.id === userId && updateData.role && updateData.role !== 'admin') {
      return res.status(403).json({ message: "You cannot remove your own admin role." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
