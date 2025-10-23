const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/messages
// @desc    Create a new message
router.post('/', messageController.createMessage);

// @route   GET api/messages
// @desc    Get all messages (Admin only)
router.get('/', auth, messageController.getMessages);

// @route   DELETE api/messages/:id
// @desc    Delete a message (Admin only)
router.delete('/:id', auth, messageController.deleteMessage);


module.exports = router;
