// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import KanbanBoard from './components/KanbanBoard';
import CreateJobForm from './components/CreateJobForm';
import { fetchJobs, updateJobStatus } from './services/api'; // Import updateJobStatus
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Function to fetch jobs
  const loadJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchJobs();
      // Convert snake_case from DB to camelCase if preferred (optional)
      const formattedJobs = response.data.map(job => ({
         id: job.id,
         customerName: job.customer_name,
         description: job.description,
         status: job.status,
         createdAt: job.created_at,
         updatedAt: job.updated_at
       }));
       setJobs(formattedJobs);
      setJobs(response.data); // Using snake_case for simplicity now
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError('Failed to load jobs. Please ensure the backend is running.');
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function doesn't change

  // Load jobs on initial mount
  useEffect(() => {
    loadJobs();
  }, [loadJobs]); // Include loadJobs in dependency array

  // Handler for when a new job is created (called by CreateJobForm)
  const handleJobCreated = () => {
    loadJobs(); // Refetch the list
  };

  // Handler for updating job status (to be passed down eventually)
  // Note: This is needed for basic status update AND drag-and-drop
  const handleUpdateStatus = useCallback(async (jobId, newStatus) => {
    try {
        // Optimistic UI Update (Optional but good UX)
        const originalJobs = [...jobs];
        setJobs(prevJobs => prevJobs.map(job =>
            job.id === jobId ? { ...job, status: newStatus } : job
        ));

        await updateJobStatus(jobId, newStatus);
        // If API call succeeds, state is already updated.
        // If API call fails, revert the state:
    } catch (err) {
        console.error("Failed to update status:", err);
        setError(`Failed to move job ${jobId}. Please try again.`);
        
        loadJobs();
    }
  }, [jobs, loadJobs]); // Include dependencies

  return (
    <div className="App">
      <h1>Job Kanban Board</h1>
      <CreateJobForm onJobCreated={handleJobCreated} />
      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        // Pass handleUpdateStatus down if implementing non-DND update first
         <KanbanBoard jobs={jobs} onUpdateStatus={handleUpdateStatus} />
        //<KanbanBoard jobs={jobs} />
      )}
    </div>
  );
};
export default App;


