const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

// Return profile of the logged-in user
router.get('/me', authenticate, (req, res) => {
  res.json({
    message: 'User profile loaded successfully.',
    user: req.user
  });
});

// Admin-only test route
router.get('/admin/test', authenticate, isAdmin, (req, res) => {
  res.json({
    message: 'Hello Admin! This route is protected.',
  });
});

module.exports = router;
