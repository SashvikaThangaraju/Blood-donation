const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// FIX: Changed the import to correctly reference the middleware function
const authMiddleware = require('../middleware/authMiddleware'); 
const messageController = require('../controllers/messageController');
const donorController = require('../controllers/donorController');

// @route   POST api/admin/login
// @desc    Authenticate admin and get token
router.post('/login', adminController.adminLogin);

// THIS ROUTE SHOULD BE USED ONCE FOR SETUP AND THEN REMOVED OR SECURED
// @route   POST api/admin/create
// @desc    Create a new admin user
router.post('/create', adminController.createAdmin);


// --- Protected Routes ---

// @route   GET api/admin/messages
// @desc    Get all messages
router.get('/messages', authMiddleware, messageController.getMessages);

// @route   DELETE api/admin/messages/:id
// @desc    Delete a message
router.delete('/messages/:id', authMiddleware, messageController.deleteMessage);

// @route   DELETE api/admin/donors/:id
// @desc    Delete a donor
router.delete('/donors/:id', authMiddleware, donorController.deleteDonor);


module.exports = router;

