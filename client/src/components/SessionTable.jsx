import React, { useState } from 'react';
import ChipBadge from './ChipBadge';

const SessionTable = ({
  sessions,
  showStudent = false,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortedSessions = () => {
    const sorted = [...sessions];
    sorted.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle nested student name if sorting by student
      if (sortField === 'student' && a.userId && b.userId) {
        aVal = a.userId.name;
        bVal = b.userId.name;
      }

      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // Date or numeric
      return sortOrder === 'asc'
        ? new Date(aVal) - new Date(bVal)
        : new Date(bVal) - new Date(aVal);
    });
    return sorted;
  };

  const renderStars = (rating) => {
    return (
      <div className="rating-dots" title={`Rating: ${rating}/5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`rating-dot ${star <= rating ? 'filled' : ''}`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedSessions = getSortedSessions();

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th
              className={sortField === 'date' ? 'sorted' : ''}
              onClick={() => handleSort('date')}
            >
              Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            {showStudent && (
              <th
                className={sortField === 'student' ? 'sorted' : ''}
                onClick={() => handleSort('student')}
              >
                Student {sortField === 'student' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            )}
            <th
              className={sortField === 'topic' ? 'sorted' : ''}
              onClick={() => handleSort('topic')}
            >
              Topic {sortField === 'topic' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Tools Used</th>
            <th
              className={sortField === 'type' ? 'sorted' : ''}
              onClick={() => handleSort('type')}
            >
              Type {sortField === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className={sortField === 'durationHours' ? 'sorted' : ''}
              onClick={() => handleSort('durationHours')}
            >
              Duration {sortField === 'durationHours' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className={sortField === 'rating' ? 'sorted' : ''}
              onClick={() => handleSort('rating')}
            >
              Rating {sortField === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            {(onEdit || onDelete || onViewDetails) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedSessions.map((session) => (
            <tr key={session._id}>
              <td className="mono" style={{ whiteSpace: 'nowrap' }}>
                {formatDate(session.date)}
              </td>
              {showStudent && (
                <td className="mono" style={{ fontWeight: '500' }}>
                  {session.userId?.name || 'Unknown'}
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>
                    {session.userId?.batch || ''}
                  </div>
                </td>
              )}
              <td style={{ maxWidth: '250px', wordBreak: 'break-word' }}>
                <div style={{ fontWeight: '500' }}>{session.topic}</div>
                {session.datasetUsed && (
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                    Dataset: <span className="mono" style={{ color: 'var(--accent)' }}>{session.datasetUsed}</span>
                  </div>
                )}
              </td>
              <td>
                <div className="chip-group">
                  {session.toolsUsed?.map((tool, idx) => (
                    <ChipBadge key={idx} label={tool} variant="muted" />
                  ))}
                </div>
              </td>
              <td>
                <ChipBadge
                  label={session.type}
                  variant={session.type === 'Hands-on Lab' ? 'pink' : 'muted'}
                />
              </td>
              <td className="mono">{session.durationHours}h</td>
              <td>{renderStars(session.rating)}</td>
              {(onEdit || onDelete || onViewDetails) && (
                <td>
                  <div className="flex gap-8">
                    {onViewDetails && (
                      <button
                        className="btn btn-sm"
                        onClick={() => onViewDetails(session)}
                      >
                        View
                      </button>
                    )}
                    {onEdit && (
                      <button
                        className="btn btn-sm"
                        onClick={() => onEdit(session)}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(session._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;
