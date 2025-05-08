// backend/controllers/jobController.js
console.log('[jobController.js] File loading...');
const db = require('../db');
const { JOB_STATUSES, VALID_STATUSES } = require('../constants');

const getAllJobs = async (req, res) => { // Your actual function
  try {
      console.log('[jobController.js] ACTUAL getAllJobs called'); // Add a log
      const queryText = 'SELECT * FROM jobs ORDER BY created_at DESC';
      const result = await db.query(queryText);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('[jobController.js] Error in ACTUAL getAllJobs:', error);
      res.status(500).json({ error: 'Internal server error in getAllJobs' });
  }
};

const createJob = async (req, res) => { // Your actual function
  console.log('[jobController.js] ACTUAL createJob called with body:', req.body);
  const { customerName, description } = req.body;
  if (!customerName || !description) {
      return res.status(400).json({ error: 'Customer name and description are required' });
  }
  try {
      const queryText = ' INSERT INTO jobs (customer_name, description, status) VALUES ($1, $2, $3) RETURNING *';
      // Ensure JOB_STATUSES.NOT_YET_STARTED is correct from your constants.js
      const values = [customerName, description, JOB_STATUSES.NOT_YET_STARTED];
      const result = await db.query(queryText, values);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('[jobController.js] Error in ACTUAL createJob:', error);
      res.status(500).json({ error: 'Internal server error in createJob' });
  }
};


const updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`[jobController.js] ACTUAL updateJobStatus called for id: ${id} with status: ${status}`);

  // Validate the incoming status against your defined valid statuses
  if (!status || !VALID_STATUSES.includes(status)) {
      console.warn(`[jobController.js] Invalid status received: ${status}. Valid are: ${VALID_STATUSES.join(', ')}`);
      return res.status(400).json({
          message: `Invalid status: '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
  }

  try {
      const queryText = `
          UPDATE jobs
          SET status = $1, updated_at = NOW()
          WHERE id = $2
          RETURNING *;
      `;
      const values = [status, parseInt(id, 10)]; // Ensure id is an integer if your DB column is
      const result = await db.query(queryText, values);

      if (result.rows.length === 0) {
          console.warn(`[jobController.js] Job not found for update, id: ${id}`);
          return res.status(404).json({ message: 'Job not found.' });
      }
      console.log(`[jobController.js] Job id: ${id} status updated to: ${status}`);
      res.status(200).json(result.rows[0]);
  } catch (error) {
      console.error(`[jobController.js] Error updating job status for id: ${id}`, error);
      // Specific check for PostgreSQL check constraint violation
      if (error.code === '23514') { // 'check_violation'
          return res.status(400).json({
              message: `Database constraint violation: The status '${status}' is not allowed by the database rules. Allowed are: ${VALID_STATUSES.join(', ')} (or check DB schema)`
          });
      }
      res.status(500).json({ message: 'Internal server error while updating job status.' });
  }
};

module.exports = {
  getAllJobs: getAllJobs, 
  createJob: createJob, 
  updateJobStatus: updateJobStatus
};

console.log('[jobController.js] module.exports set to:', module.exports);

/*
const db = require('../db');
const { JOB_STATUSES, VALID_STATUSES } = require('../constants');

exports.createJob  = async (req,res) => {
    const { customerName, description } = req.body;

    if (!customerName||!description) {
        return res.status(400).json({ error: 'Customer name and description are required' });
    }
    try {
        const queryText = ' INSERT INTO jobs (customer_name, description, status) VALUES ($1, $2, $3) RETURNING *';
        const values = [customerName, description, JOB_STATUSES.NOT_YET_STARTED];
        const result = await db.query(queryText, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllJobs = async (req, res) => {
    try {
        const queryText = 'SELECT * FROM jobs ORDER BY created_at DESC';
        const result = await db.query(queryText);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateJobStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const queryText = `
      UPDATE jobs
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, id];
    const result = await db.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
      // Catch potential CHECK constraint violation
      if (error.code === '23514') { // PostgreSQL error code for check constraint violation
          return res.status(400).json({ message: `Invalid status value: ${status}` });
      }
      console.error('Error updating job status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};
*/