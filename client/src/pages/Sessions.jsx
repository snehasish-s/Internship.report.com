import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import SessionTable from '../components/SessionTable';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import SessionForm from '../components/SessionForm';

const ANALYTICS_TOOLS = [
  'Python',
  'SQL',
  'Excel',
  'Power BI',
  'Tableau',
  'Matplotlib',
  'Seaborn',
  'Jupyter',
  'Pandas',
  'NumPy',
  'Scikit-learn'
];

const SESSION_TYPES = [
  'Hands-on Lab',
  'Lecture',
  'Tool Workshop',
  'Project Review',
  'Mentor Session'
];

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [toolFilter, setToolFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      let query = '';
      const params = [];
      if (typeFilter) params.push(`type=${encodeURIComponent(typeFilter)}`);
      if (toolFilter) params.push(`tool=${encodeURIComponent(toolFilter)}`);
      if (params.length > 0) query = `?${params.join('&')}`;

      const response = await API.get(`/api/sessions${query}`);
      setSessions(response.data.sessions || []);
    } catch (err) {
      setError('Failed to retrieve session history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [typeFilter, toolFilter]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingSession) {
        await API.put(`/api/sessions/${editingSession._id}`, formData);
      } else {
        await API.post('/api/sessions', formData);
      }
      setIsModalOpen(false);
      setEditingSession(null);
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save session.');
    }
  };

  const handleEditClick = (session) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session? This will also delete associated doubts.')) {
      try {
        await API.delete(`/api/sessions/${sessionId}`);
        fetchSessions();
      } catch (err) {
        setError('Failed to delete session.');
      }
    }
  };

  const handleAddClick = () => {
    setEditingSession(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="MY_SESSIONS">
          <button className="btn btn-cta" onClick={handleAddClick}>
            + Log Session
          </button>
        </Topbar>

        <div className="page-container">
          {error && <div className="login-error mb-20">{error}</div>}

          <div className="card mb-20">
            <h3 className="section-label">Filters</h3>
            <div className="filter-bar mb-0">
              <div className="form-group mb-0">
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Session Types</option>
                  {SESSION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-0">
                <select
                  className="form-select"
                  value={toolFilter}
                  onChange={(e) => setToolFilter(e.target.value)}
                >
                  <option value="">All Analytics Tools</option>
                  {ANALYTICS_TOOLS.map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </select>
              </div>

              {(typeFilter || toolFilter) && (
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    setTypeFilter('');
                    setToolFilter('');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="section-label">Log History</h3>
            {loading ? (
              <div className="mono text-accent">RETRIEVING_SESSIONS...</div>
            ) : sessions.length > 0 ? (
              <SessionTable
                sessions={sessions}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ) : (
              <EmptyState title="No sessions match your selection" />
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSession ? 'Edit Analytics Session' : 'Log New Analytics Session'}
      >
        <SessionForm
          initialData={editingSession}
          onSubmit={handleCreateOrUpdate}
          onCancel={handleCloseModal}
          submitLabel={editingSession ? 'Update Session' : 'Log Session'}
        />
      </Modal>
    </div>
  );
};

export default Sessions;
