const Disaster=require('../models/Disaster')

const createDisaster = async (req, res) => {
  try {
    const { type, description, location, severity, status, lng, lat } = req.body;

    const disaster = new Disaster({
      type,
      description,
      location,
      severity: severity || 'low',
      status: status || 'active',
      coordinates: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      createdBy: req.user.id
    });

    await disaster.save();

    req.app.get('io').emit('new-disaster', disaster);//socket.io

    res.status(201).json({
      message: 'Disaster reported successfully',
      disaster
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const getDisaster = async (req, res) => {
  try {
    const {
      type,
      severity,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

   
    const filter = {};
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const disasters = await Disaster.find(filter)
      .populate('createdBy', 'username email') // Include creator info
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }) // Apply sorting
      .skip((page - 1) * parseInt(limit)) // Pagination start
      .limit(parseInt(limit));            // Pagination size

    res.json({
      success: true,
      count: disasters.length,
      data: disasters
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getNearbyDisasters = async (req, res) => {
  try {
    const { lat, lng, radius = 20000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const disasters = await Disaster.find({
      coordinates: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius)
        }
      }
    }).populate('createdBy', 'username email');

    res.json({ success: true, count: disasters.length, data: disasters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id);
    if (!disaster)
      return res.status(404).json({ message: "Disaster not found." });

    // Only the report's creator or an admin can update
    if (disaster.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    // Update allowed fields
    const fields = ['type', 'description', 'location', 'status', 'severity'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) disaster[field] = req.body[field];
    });

    await disaster.save();

    req.app.get('io').emit('update-disaster', disaster);//socket.io updated

    res.json({ message: "Disaster updated.", disaster });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id);
    if (!disaster)
      return res.status(404).json({ message: "Disaster not found." });

    // Only the report's creator or an admin can delete
    if (disaster.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await disaster.remove();
    res.json({ message: "Disaster deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






module.exports={createDisaster,getDisaster,updateDisaster,deleteDisaster,getNearbyDisasters}