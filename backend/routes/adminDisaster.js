const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/admin');
const authenticate=require('../middleware/auth')
const { getAllReports, updateReportAction } = require('../controllers/adminDisasterController');

router.use(authenticate,isAdmin);
router.get('/reports', getAllReports);
router.put('/reports/:id/action', updateReportAction);

module.exports = router;
