const express = require('express');
const router = express.Router();
const { registerDonor, getDonors, deleteDonor } = require('../controllers/donorController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/donors
// @desc    Register a new donor
router.post('/', registerDonor);

// @route   GET api/donors
// @desc    Get all donors with optional filters (Public Route)
router.get('/', getDonors);

// NOTE: The DELETE route for donors is handled in routes/admin.js as it's a protected action.
// This keeps this file for public-facing donor actions.

module.exports = router;

