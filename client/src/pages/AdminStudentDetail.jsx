import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import SessionTable from '../components/SessionTable';
import SkillBar from '../components/SkillBar';
import EmptyState from '../components/EmptyState';
import ChipBadge from '../components/ChipBadge';
import Modal from '../components/Modal';

const AdminStudentDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Doubt Answering state
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [answering, setAnswering] = useState(false);

  // View Session details modal
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/admin/students/${id}`);
      setData(response.data || null);
    } catch (err) {
      setError('Failed to fetch student profile detail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || !selectedDoubt) return;

    setAnswering(true);
    try {
      await API.put(`/api/doubts/${selectedDoubt._id}`, {
        answer: answerText.trim(),
        resolved: true
      });
      setSelectedDoubt(null);
      setAnswerText('');
      fetchStudentData();
    } catch (err) {
      setError('Failed to submit doubt resolution.');
    } finally {
      setAnswering(false);
    }
  };

  const handleOpenAnswerModal = (doubt) => {
    setSelectedDoubt(doubt);
    setAnswerText(doubt.answer || '');
  };

  const handleToggleResolveDoubt = async (doubtId, currentResolved) => {
    try {
      await API.put(`/api/doubts/${doubtId}`, {
        resolved: !currentResolved
      });
      fetchStudentData();
    } catch (err) {
      setError('Failed to update doubt ticket status.');
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Topbar title="STUDENT_REPORT" />
          <div className="page-container">
            <div className="mono text-accent">LOADING_STUDENT_DATA_MATRICES...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Topbar title="STUDENT_REPORT" />
          <div className="page-container">
            <EmptyState title="Student Profile not found" text="Verify if the user exists or was modified." />
          </div>
        </main>
      </div>
    );
  }

  const { student, sessions, doubts, skillBars, stats } = data;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title={`STUDENT_REPORT > ${student.name.toUpperCase()}`}>
          <Link to="/admin" className="btn">
            Back to Roster
          </Link>
        </Topbar>

        <div className="page-container">
          {error && <div className="login-error mb-20">{error}</div>}

          <div className="stat-cards">
            <StatCard label="Total Sessions" value={stats.totalSessions} ghostChar="S" />
            <StatCard label="Total Hours" value={`${stats.totalHours}h`} ghostChar="H" />
            <StatCard label="Avg Rating" value={`${stats.avgRating}/5`} ghostChar="R" />
            <StatCard label="Confidence Level" value={`${stats.avgConfidence}/5`} ghostChar="C" />
          </div>

          <div className="grid-2 mb-28">
            <div className="card">
              <h3 className="section-label">Reported Skill Confidence</h3>
              {skillBars.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {skillBars.map((skill, idx) => (
                    <SkillBar key={idx} label={skill.skill} percentage={skill.avgConfidence} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No analytics tools recorded yet" text="Student must log sessions and select tools." />
              )}
            </div>

            <div className="card">
              <h3 className="section-label">Doubt Tickets</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {doubts.length > 0 ? (
                  doubts.map((doubt) => (
                    <div key={doubt._id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      <div className="flex justify-between items-center mb-8">
                        <ChipBadge label={doubt.sessionId?.topic || 'Session'} variant="pink" />
                        <div className="flex items-center gap-8">
                          <ChipBadge
                            label={doubt.resolved ? 'RESOLVED' : 'OPEN'}
                            variant={doubt.resolved ? 'success' : 'error'}
                          />
                          <button
                            className="btn btn-sm"
                            style={{ height: '22px', fontSize: '10px', padding: '0 6px' }}
                            onClick={() => handleToggleResolveDoubt(doubt._id, doubt.resolved)}
                          >
                            Toggle
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '8px' }}>
                        {doubt.question}
                      </p>
                      {doubt.answer ? (
                        <div style={{ background: 'var(--surface)', borderLeft: '2px solid var(--accent)', padding: '6px 10px', fontSize: '12px', color: 'var(--muted)' }}>
                          <strong>Ans:</strong> {doubt.answer}
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-cta"
                          style={{ height: '24px', fontSize: '10px', padding: '0 8px' }}
                          onClick={() => handleOpenAnswerModal(doubt)}
                        >
                          Answer doubt
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <EmptyState title="No doubt tickets raised" text="This student hasn't raised any doubts." />
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-label">Session Log List</h3>
            {sessions.length > 0 ? (
              <SessionTable
                sessions={sessions}
                onViewDetails={(session) => setSelectedSession(session)}
              />
            ) : (
              <EmptyState title="No sessions logged by this student" />
            )}
          </div>
        </div>
      </main>

      {/* Answer Doubt Modal */}
      <Modal
        isOpen={selectedDoubt !== null}
        onClose={() => setSelectedDoubt(null)}
        title="Resolve Doubt Ticket"
      >
        {selectedDoubt && (
          <form onSubmit={handleAnswerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div className="form-label">Student Question</div>
              <p style={{ fontSize: '14px', color: 'var(--text)', background: 'var(--surface)', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                {selectedDoubt.question}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Your Answer / Resolution</label>
              <textarea
                className="form-textarea"
                placeholder="Provide analytical context, query fixes, or explanations..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                required
              />
            </div>

            <div className="modal-footer" style={{ padding: '16px 0 0 0', border: 'none' }}>
              <button
                type="button"
                className="btn"
                onClick={() => setSelectedDoubt(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-cta"
                disabled={answering}
              >
                {answering ? 'SUBMITTING...' : 'Submit Resolution'}
              </button>
            </div>
          </form>
        )}
      </Modal>

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
                <span className="form-label">Date</span>
                <p className="mono" style={{ fontSize: '14px' }}>
                  {new Date(selectedSession.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="form-label">Session Type</span>
                <p className="mono" style={{ fontSize: '14px' }}>
                  {selectedSession.type}
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
                <span className="form-label">Duration</span>
                <p className="mono" style={{ fontSize: '14px' }}>
                  {selectedSession.durationHours} hours
                </p>
              </div>
              <div>
                <span className="form-label">Dataset</span>
                <p className="mono" style={{ fontSize: '14px' }}>
                  {selectedSession.datasetUsed || 'None'}
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

export default AdminStudentDetail;
