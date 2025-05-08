// backend/routes/jobs.js
const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

console.log('jobController:', jobController);
console.log('jobController.getAllJobs type:', typeof jobController.getAllJobs);
// GET /api/jobs - Get all jobs
router.get('/', jobController.getAllJobs);

// POST /api/jobs - Create a new job
router.post('/', jobController.createJob);

// PATCH /api/jobs/:id/status - Update a job's status
router.patch('/:id/status', jobController.updateJobStatus);

// You could also use PUT /api/jobs/:id for full updates
// or PATCH /api/jobs/:id for partial updates including status

module.exports = router;