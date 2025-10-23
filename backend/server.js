const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/db');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// --- Start the server ---
const startServer = async () => {
  // Initialize the database first
  await initializeDatabase();
  
  // Then start the Express server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

// API Routes
app.use('/api/donors', require('./routes/donors'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the BloodConnect API');
});

startServer();

