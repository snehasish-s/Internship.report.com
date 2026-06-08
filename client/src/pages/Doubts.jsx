import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import EmptyState from '../components/EmptyState';
import ChipBadge from '../components/ChipBadge';
import Modal from '../components/Modal';

const Doubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [resolvedFilter, setResolvedFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      let query = '';
      if (resolvedFilter) {
        query = `?resolved=${resolvedFilter}`;
      }
      const response = await API.get(`/api/doubts${query}`);
      setDoubts(response.data.doubts || []);
    } catch (err) {
      setError('Failed to fetch doubts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await API.get('/api/sessions');
      setSessions(response.data.sessions || []);
      if (response.data.sessions?.length > 0) {
        setSessionId(response.data.sessions[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch sessions for dropdown', err);
    }
  };

  useEffect(() => {
    fetchDoubts();
    fetchSessions();
  }, [resolvedFilter]);

  const handleCreateDoubt = async (e) => {
    e.preventDefault();
    if (!sessionId || !question.trim()) {
      setError('Please select a session and enter a question.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await API.post('/api/doubts', { sessionId, question: question.trim() });
      setIsModalOpen(false);
      setQuestion('');
      fetchDoubts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file doubt ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (doubtId) => {
    try {
      await API.put(`/api/doubts/${doubtId}`, { resolved: true });
      fetchDoubts();
    } catch (err) {
      setError('Failed to mark doubt as resolved.');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="DOUBT_PANEL">
          <button
            className="btn btn-cta"
            onClick={() => setIsModalOpen(true)}
            disabled={sessions.length === 0}
            title={sessions.length === 0 ? 'Log at least one session before raising a doubt' : ''}
          >
            + Ask Doubt
          </button>
        </Topbar>

        <div className="page-container">
          {error && <div className="login-error mb-20">{error}</div>}

          <div className="card mb-20">
            <h3 className="section-label">Filter Status</h3>
            <div className="filter-bar mb-0">
              <div className="form-group mb-0">
                <select
                  className="form-select"
                  value={resolvedFilter}
                  onChange={(e) => setResolvedFilter(e.target.value)}
                >
                  <option value="">All Doubt Tickets</option>
                  <option value="false">Unresolved</option>
                  <option value="true">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-label font-mono">Doubt History</h3>
            {loading ? (
              <div className="mono text-accent">LOADING_DOUBT_LOGS...</div>
            ) : doubts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {doubts.map((d) => (
                  <div
                    key={d._id}
                    className="card"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-8">
                        <ChipBadge
                          label={d.sessionId?.topic || 'General Topic'}
                          variant="pink"
                        />
                        <ChipBadge
                          label={d.resolved ? 'RESOLVED' : 'OPEN'}
                          variant={d.resolved ? 'success' : 'error'}
                        />
                      </div>
                      <span className="mono text-muted" style={{ fontSize: '11px' }}>
                        Filed: {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <div className="form-label">Question</div>
                      <p style={{ fontSize: '14px', color: 'var(--text)' }}>
                        {d.question}
                      </p>
                    </div>

                    {d.answer ? (
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                        <div className="form-label" style={{ color: 'var(--success)' }}>Mentor Response</div>
                        <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
                          {d.answer}
                        </p>
                      </div>
                    ) : (
                      !d.resolved && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>
                            Awaiting mentor resolution...
                          </span>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleResolve(d._id)}
                          >
                            Mark Resolved
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No doubt tickets found" text="File one if you run into SQL syntaxes, Pandas indexing issues, or regression logic doubt." />
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Raise Doubt Ticket"
      >
        <form onSubmit={handleCreateDoubt} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Link to Analytics Session</label>
            <select
              className="form-select"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              required
            >
              {sessions.map((s) => (
                <option key={s._id} value={s._id}>
                  [{new Date(s.date).toLocaleDateString()}] {s.topic}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Your Doubt / Question</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. When performing pd.merge, how do I resolve column suffix duplicates? Or how is R-squared different from adjusted R-squared?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ padding: '16px 0 0 0', border: 'none' }}>
            <button
              type="button"
              className="btn"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-cta"
              disabled={submitting}
            >
              {submitting ? 'FILING...' : 'File Doubt Ticket'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Doubts;
