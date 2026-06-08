import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import MiniBarChart from '../components/MiniBarChart';
import EmptyState from '../components/EmptyState';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, statsRes] = await Promise.all([
          API.get('/api/admin/students'),
          API.get('/api/admin/stats')
        ]);
        setStudents(studentsRes.data.students || []);
        setStats(statsRes.data || null);
      } catch (err) {
        setError('Failed to fetch administrative metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Topbar title="ADMIN_OVERVIEW" />
          <div className="page-container">
            <div className="mono text-accent">LOADING_ADMIN_METRICS...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="ADMIN_OVERVIEW">
          <Link to="/admin/sessions" className="btn">
            View All Sessions
          </Link>
        </Topbar>

        <div className="page-container">
          {error && <div className="login-error mb-20">{error}</div>}

          {stats && (
            <div className="stat-cards">
              <StatCard label="Total Students" value={stats.totalStudents} ghostChar="U" />
              <StatCard label="Sessions Logged" value={stats.totalSessions} ghostChar="S" />
              <StatCard label="Total Hours" value={`${stats.totalHours}h`} ghostChar="H" />
              <StatCard label="Pending Doubts" value={stats.openDoubts} ghostChar="D" />
            </div>
          )}

          <div className="grid-2 mb-28">
            <div className="card">
              <h3 className="section-label">Most Used Analytics Tools</h3>
              {stats?.toolUsage?.length > 0 ? (
                <MiniBarChart
                  data={stats.toolUsage.slice(0, 6)}
                  xKey="tool"
                  yKey="count"
                  barName="Times Used"
                />
              ) : (
                <EmptyState title="No tool data recorded" />
              )}
            </div>

            <div className="card">
              <h3 className="section-label">Average Confidence per Skill</h3>
              {stats?.avgConfidencePerSkill?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {stats.avgConfidencePerSkill.slice(0, 6).map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid var(--border)',
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <span className="mono" style={{ fontSize: '13px' }}>
                        {skill.skill}
                      </span>
                      <span className="mono text-accent" style={{ fontWeight: '600' }}>
                        {skill.avgConfidence}/5
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No confidence data recorded" />
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="section-label">Internship Roster</h3>
            {students.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Batch / Section</th>
                      <th>Sessions</th>
                      <th>Total Hours</th>
                      <th>Avg Rating</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td style={{ fontWeight: '500' }}>
                          {student.name}
                        </td>
                        <td className="mono">{student.email}</td>
                        <td className="mono">
                          {student.batch ? student.batch.replace('DATA ANALYTICS - ', '') : 'N/A'}
                        </td>
                        <td className="mono">{student.sessionCount}</td>
                        <td className="mono">{student.totalHours}h</td>
                        <td className="mono" style={{ color: 'var(--accent)' }}>
                          {student.avgRating > 0 ? `${student.avgRating} ★` : 'N/A'}
                        </td>
                        <td>
                          <Link to={`/admin/students/${student._id}`} className="btn btn-sm">
                            View Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="Roster is empty" text="Pre-seeded users were not found. Run seed command to populate." />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
