const JOB_STATUSES = {
    NOT_YET_STARTED: 'Not Yet Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
};
const STATUS_ORDER = [
    JOB_STATUSES.NOT_YET_STARTED,
    JOB_STATUSES.IN_PROGRESS,
    JOB_STATUSES.COMPLETED,
];
module.exports = {
    JOB_STATUSES,
    STATUS_ORDER,
    VALID_STATUSES: Object.values(JOB_STATUSES)
};
// This module exports constants related to job statuses and their order.