// frontend/src/components/KanbanBoard.js
import React from 'react';
import KanbanColumn from './KanbanColumn';
import './KanbanBoard.css';

// Should match backend/constants.js or be shared
const STATUS_ORDER = ["Not Yet Started", "In Progress", "Completed"];

function KanbanBoard({ jobs, onUpdateStatus }) {
  console.log('KanbanBoard received onUpdateStatus:', typeof onUpdateStatus, onUpdateStatus);
  // Group jobs by status
  const columns = STATUS_ORDER.map(status => ({
    title: status,
    jobs: jobs.filter(job => job.status === status)
  }));

  return (
    <div className="kanban-board">
      {columns.map(column => (
        <KanbanColumn
          key={column.title}
          title={column.title}
          jobs={column.jobs.filter(job => job.status === column.title)}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;