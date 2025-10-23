const { getPool } = require('../config/db');

exports.registerDonor = async (req, res) => {
    const { fullName, age, bloodGroup, phone, email, location, availability, medicalHistory, emergencyContact } = req.body;
    
    // Basic validation
    if (!fullName || !age || !bloodGroup || !phone || !email || !location || !availability) {
        return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    try {
        const db = getPool();
        const [result] = await db.query(
            'INSERT INTO donors (fullName, age, bloodGroup, phone, email, location, availability, medicalHistory, emergencyContact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [fullName, age, bloodGroup, phone, email, location, availability, medicalHistory || null, emergencyContact || null]
        );
        res.status(201).json({ message: 'Donor registered successfully', donorId: result.insertId });
    } catch (error) {
        console.error('Error registering donor:', error);
        // Check for duplicate email error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'This email address is already registered.' });
        }
        res.status(500).json({ message: 'Server error during donor registration.' });
    }
};

exports.getDonors = async (req, res) => {
    const { search, bloodGroup } = req.query;

    try {
        const db = getPool();
        let sql = 'SELECT id, fullName, bloodGroup, location, phone, email, availability FROM donors';
        const params = [];

        if (search || bloodGroup) {
            sql += ' WHERE';
            let conditions = [];
            if (search) {
                conditions.push(`(fullName LIKE ? OR location LIKE ?)`);
                params.push(`%${search}%`, `%${search}%`);
            }
            if (bloodGroup) {
                conditions.push(`bloodGroup = ?`);
                params.push(bloodGroup);
            }
            sql += ` ${conditions.join(' AND ')}`;
        }
        
        const [donors] = await db.query(sql, params);
        res.json(donors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ message: 'Server error while fetching donors.' });
    }
};

exports.deleteDonor = async (req, res) => {
    const { id } = req.params;
    try {
        const db = getPool();
        const [result] = await db.query('DELETE FROM donors WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Donor not found.' });
        }
        res.json({ message: 'Donor deleted successfully.' });
    } catch (error) {
        console.error('Error deleting donor:', error);
        res.status(500).json({ message: 'Server error while deleting donor.' });
    }
};

