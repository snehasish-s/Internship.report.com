import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import SessionTable from '../components/SessionTable';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ChipBadge from '../components/ChipBadge';

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

const BATCHES = [
  'DATA ANALYTICS - A',
  'DATA ANALYTICS - B',
  'DATA ANALYTICS - C',
  'DATA ANALYTICS - MCA'
];

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [studentFilter, setStudentFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [toolFilter, setToolFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Session Details Modal
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await API.get('/api/admin/students');
      setStudents(response.data.students || []);
    } catch (err) {
      console.error('Failed to fetch students roster for filter dropdown', err);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = [];
      if (studentFilter) params.push(`student=${studentFilter}`);
      if (batchFilter) params.push(`batch=${encodeURIComponent(batchFilter)}`);
      if (typeFilter) params.push(`type=${encodeURIComponent(typeFilter)}`);
      if (toolFilter) params.push(`tool=${encodeURIComponent(toolFilter)}`);
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);

      let query = '';
      if (params.length > 0) query = `?${params.join('&')}`;

      const response = await API.get(`/api/admin/sessions${query}`);
      setSessions(response.data.sessions || []);
    } catch (err) {
      setError('Failed to fetch filtered sessions history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [studentFilter, batchFilter, typeFilter, toolFilter, startDate, endDate]);

  const handleClearFilters = () => {
    setStudentFilter('');
    setBatchFilter('');
    setTypeFilter('');
    setToolFilter('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="ALL_STUDENT_SESSIONS" />

        <div className="page-container">
          {error && <div className="login-error mb-20">{error}</div>}

          <div className="card mb-20">
            <h3 className="section-label">Session Filters</h3>
            <div className="filter-bar mb-0">
              <div className="form-group mb-0">
                <select
                  className="form-select"
                  value={studentFilter}
                  onChange={(e) => setStudentFilter(e.target.value)}
                >
                  <option value="">All Students</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-0">
                <select
                  className="form-select"
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                >
                  <option value="">All Batches</option>
                  {BATCHES.map((b) => (
                    <option key={b} value={b}>
                      {b.replace('DATA ANALYTICS - ', '')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-0">
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
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
                  <option value="">All Tools</option>
                  {ANALYTICS_TOOLS.map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-0 flex items-center gap-8">
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '135px' }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start"
                />
                <span className="mono text-muted">to</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '135px' }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End"
                />
              </div>

              {(studentFilter || batchFilter || typeFilter || toolFilter || startDate || endDate) && (
                <button className="btn btn-sm" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="section-label">Academic Log Database</h3>
            {loading ? (
              <div className="mono text-accent">FETCHING_SESSION_LOGS...</div>
            ) : sessions.length > 0 ? (
              <SessionTable
                sessions={sessions}
                showStudent={true}
                onViewDetails={(session) => setSelectedSession(session)}
              />
            ) : (
              <EmptyState title="No sessions match the selected query" />
            )}
          </div>
        </div>
      </main>

      {/* Session Details Modal */}
      <Modal
        isOpen={selectedSession !== null}
        onClose={() => setSelectedSession(null)}
        title="Session Details Log"
      >
        {selectedSession && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-row">
              <div>
                <span className="form-label">Student</span>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>
                  {selectedSession.userId?.name || 'Unknown'}
                </p>
                <p className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  {selectedSession.userId?.email || ''} | {selectedSession.userId?.batch || 'No Batch'}
                </p>
              </div>
              <div>
                <span className="form-label">Date</span>
                <p className="mono" style={{ fontSize: '14px' }}>
                  {new Date(selectedSession.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="form-row">
              <div>
                <span className="form-label">Session Type</span>
                <p className="mono" style={{ fontSize: '14px' }}>
                  {selectedSession.type}
                </p>
              </div>
              <div>
                <span className="form-label">Duration</span>
                <p className="mono" style={{ fontSize: '14px' }}>
                  {selectedSession.durationHours} hours
                </p>
              </div>
            </div>

            <div>
              <span className="form-label">Topic</span>
              <p style={{ fontSize: '15px', fontWeight: '500' }}>
                {selectedSession.topic}
              </p>
            </div>

            <div>
              <span className="form-label">Learnings & Summary</span>
              <p style={{ fontSize: '14px', color: 'var(--muted)', background: 'var(--surface)', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap' }}>
                {selectedSession.learnings}
              </p>
            </div>

            <div className="form-row">
              <div>
                <span className="form-label">Dataset Used</span>
                <p className="mono" style={{ fontSize: '14px' }}>
                  {selectedSession.datasetUsed || 'None'}
                </p>
              </div>
              <div>
                <span className="form-label">Mentor</span>
                <p style={{ fontSize: '14px' }}>
                  {selectedSession.mentor || 'None'}
                </p>
              </div>
            </div>

            <div className="form-row">
              <div>
                <span className="form-label">Rating Given</span>
                <p className="mono" style={{ fontSize: '14px', color: 'var(--accent)' }}>
                  {selectedSession.rating}/5
                </p>
              </div>
              <div>
                <span className="form-label">Confidence Score</span>
                <p className="mono" style={{ fontSize: '14px', color: 'var(--accent)' }}>
                  {selectedSession.confidenceLevel}/5
                </p>
              </div>
            </div>

            <div>
              <span className="form-label">Tools Logged</span>
              <div className="chip-group" style={{ marginTop: '4px' }}>
                {selectedSession.toolsUsed?.map((tool, idx) => (
                  <ChipBadge key={idx} label={tool} variant="muted" />
                ))}
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '16px 0 0 0', border: 'none' }}>
              <button
                type="button"
                className="btn"
                onClick={() => setSelectedSession(null)}
              >
                Close details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminSessions;
