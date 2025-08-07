const express = require('express');
const router = express.Router();
const { sendSos,getAllSos } = require('../controllers/sosController');
const authenticate = require('../middleware/auth'); // Protect the route
const isAdmin=require('../middleware/admin')
// Send SOS (authenticated user)
router.post('/', authenticate, sendSos);
router.get('/', authenticate,isAdmin, getAllSos);
module.exports = router;
