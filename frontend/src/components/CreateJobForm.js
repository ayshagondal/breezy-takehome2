// frontend/src/components/CreateJobForm.js
import React, { useState } from 'react';
import { createJob } from '../services/api';
import './CreateJobForm.css';

function CreateJobForm({ onJobCreated, onCancel }) {
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !description) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await createJob({ customerName, description });
      
      setCustomerName(''); // Clear form
      setDescription('');
      onJobCreated(); // Notify parent to refresh list
    } catch (err) {
      console.error("Error creating job:", err);
      setError('Failed to create job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-job-form modal-form"> {/* Add modal-form class */}
      <h3>Create New Job</h3>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="customerName">Customer Name:</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          autoFocus /* Focus on the first field */
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="button-cancel" disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" className="button-submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Job'}
        </button>
      </div>
    </form>
  );
}


export default CreateJobForm;