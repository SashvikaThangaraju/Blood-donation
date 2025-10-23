const { getPool } = require('../config/db');

// @desc    Create a new message from the contact form
const createMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const db = getPool();
        const [result] = await db.query(
            'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );
        res.status(201).json({ message: 'Message sent successfully', messageId: result.insertId });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Server error while sending message.' });
    }
};

// @desc    Get all messages for the admin dashboard
const getMessages = async (req, res) => {
    try {
        const db = getPool();
        // FIX: Changed 'createdAt' to 'receivedDate' to match the database schema.
        const [messages] = await db.query('SELECT * FROM messages ORDER BY receivedDate DESC');
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error while fetching messages.' });
    }
};

// @desc    Delete a message by ID
const deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const db = getPool();
        const [result] = await db.query('DELETE FROM messages WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Message not found.' });
        }
        res.json({ message: 'Message deleted successfully.' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error while deleting message.' });
    }
};

module.exports = { createMessage, getMessages, deleteMessage };

