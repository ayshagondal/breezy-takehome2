// frontend/src/components/KanbanCard.js
import React from 'react';
import { useDrag } from 'react-dnd'; 
import './KanbanCard.css';

export const ItemTypes = { 
  JOB_CARD: 'job_card',
};

const JOB_STATUSES_FRONTEND = {
  NOT_YET_STARTED: 'Not Yet Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

// 'onUpdateStatus' is kept for the buttons
function KanbanCard({ job, onUpdateStatus }) {
  const [{ isDragging }, dragRef, previewRef] = useDrag(() => ({ // Use the hook
    type: ItemTypes.JOB_CARD,
    item: { id: job.id, currentStatus: job.status, originalJobData: job }, // Pass necessary data
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    
  }));

  
  // To make the entire card the drag source and the preview:
  const combinedRef = (el) => {
    dragRef(el);
    previewRef(el);
  };


  const handleMove = (newStatus) => {
    if (job.status !== newStatus) {
      // This onUpdateStatus comes from props, for the buttons
      if (typeof onUpdateStatus === 'function') {
        onUpdateStatus(job.id, newStatus);
      } else {
        console.error("KanbanCard: onUpdateStatus prop is not a function (for button click)");
      }
    }
  };

  return (
    // Apply the ref from useDrag to make this div draggable
    <div
      ref={combinedRef} // <--- ATTACH THE DRAG REF HERE
      className="kanban-card"
      style={{
        opacity: isDragging ? 0.5 : 1, // Visual feedback
        cursor: 'grab',                // Indicate draggable
      }}
      // title={`ID: ${job.id}`} // For debugging
    >
      <h4>{job.customer_name || job.customerName}</h4>
      <p>{job.description}</p>
      <div className="kanban-card-actions">
        {/* --- When current status is IN_PROGRESS --- */}
        {job.status === JOB_STATUSES_FRONTEND.IN_PROGRESS && (
          <>
            <button onClick={() => handleMove(JOB_STATUSES_FRONTEND.NOT_YET_STARTED)} title="Move to Not Yet Started">
              « Not Yet Started
            </button>
            <button onClick={() => handleMove(JOB_STATUSES_FRONTEND.COMPLETED)} title="Move to Completed">
              Completed »
            </button>
          </>
        )}

        {/* --- When current status is NOT_YET_STARTED --- */}
        {job.status === JOB_STATUSES_FRONTEND.NOT_YET_STARTED && (
          <button onClick={() => handleMove(JOB_STATUSES_FRONTEND.IN_PROGRESS)} title="Move to In Progress">
            In Progress »
          </button>
        )}

        {/* --- When current status is COMPLETED --- */}
        {job.status === JOB_STATUSES_FRONTEND.COMPLETED && (
          <button onClick={() => handleMove(JOB_STATUSES_FRONTEND.IN_PROGRESS)} title="Move back to In Progress">
            « In Progress
          </button>
        )}
      </div>
    </div>
  );
}

export default KanbanCard;