const { getPool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const db = getPool();
        const [admins] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);

        if (admins.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const admin = admins[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const payload = { admin: { id: admin.id, username: admin.username } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        const db = getPool();
        const [existingAdmins] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (existingAdmins.length > 0) {
            return res.status(400).json({ message: 'Admin user already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'Admin user created successfully.' });
    } catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({ message: 'Server error while creating admin.' });
    }
};

