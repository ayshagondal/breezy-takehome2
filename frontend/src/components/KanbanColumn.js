// frontend/src/components/KanbanColumn.js
import React from 'react';
import { useDrop } from 'react-dnd'; // <--- IMPORT useDrop
import KanbanCard, { ItemTypes } from './KanbanCard'; // <--- IMPORT ItemTypes from KanbanCard
import './KanbanColumn.css';

const statusClassMap = {
  "Not Yet Started": "not-started",
  "In Progress": "in-progress",
  "Completed": "completed"
};

// KanbanColumn needs onUpdateStatus from its parent (KanbanBoard -> App)
function KanbanColumn({ title, jobs, onUpdateStatus }) {
  

  // --- D&D Drop Target Logic ---
  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.JOB_CARD, 
      drop: (draggedItem, monitor) => {
        // This is the 'item' object from useDrag in KanbanCard
        console.log(`--- KANBAN COLUMN (${title}) --- DROP HANDLER TRIGGERED ---`);
        console.log('Dragged Item:', draggedItem);
        console.log('Target Column Status (title):', title);

        if (draggedItem.currentStatus !== title) {
          console.log(`Calling onUpdateStatus for card ${draggedItem.id} to new status ${title}`);
          if (typeof onUpdateStatus === 'function') {
            onUpdateStatus(draggedItem.id, title); // 'title' is the status of this target column
          } else {
            console.error(`ERROR in KanbanColumn (${title}): onUpdateStatus is NOT a function!`);
          }
        } else {
          console.log(`Card ${draggedItem.id} dropped on the same column ${title}. No status update needed.`);
        }
      },
      canDrop: (draggedItem, monitor) => {
        const canItDrop = draggedItem.currentStatus !== title;
        // console.log(`KanbanColumn (${title}): canDrop for item ${draggedItem.id} (status: ${draggedItem.currentStatus})? ${canItDrop}`);
        return canItDrop; // Prevent dropping a card onto the column it's already in
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [title, onUpdateStatus, jobs] // Dependencies for useDrop
  );
  // --- End D&D Drop Target Logic ---

  let columnDynamicClass = '';
  if (isOver && canDrop) {
    columnDynamicClass = 'is-over';
  }

  const finalColumnClassName = `kanban-column ${statusClassMap[title] || ''} ${columnDynamicClass}`;

  return (
    // Attach the dropRef to the main div of the column to make it a drop target
    <div ref={dropRef} className={finalColumnClassName}>
      <h3>{title}</h3>
      <div className="column-cards">
        {jobs.map(job => (
          <KanbanCard
            key={job.id}
            job={job}
            onUpdateStatus={onUpdateStatus} // want buttons on card to also work
          />
        ))}
        {/* Optional: Visual cues for D&D */}
        {isOver && canDrop && <div className="drop-placeholder">Drop Job Here</div>}
        {!jobs.length && canDrop && !isOver && !isOver && <div className="empty-column-drop-cue">Drag a job here</div>}
      </div>
    </div>
  );
}

export default KanbanColumn;