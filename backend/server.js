// backend/server.js
require('dotenv').config(); // Load .env variables first
const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// --- Routes ---
app.use('/api/jobs', jobRoutes); // Mount job routes under /api/jobs

// --- Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});