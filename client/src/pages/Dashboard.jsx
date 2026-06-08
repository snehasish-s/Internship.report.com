import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import SessionTable from '../components/SessionTable';
import SkillBar from '../components/SkillBar';
import MiniBarChart from '../components/MiniBarChart';
import EmptyState from '../components/EmptyState';
import ChipBadge from '../components/ChipBadge';
import { Link } from 'react-router-dom';

const ANALYTICS_SKILLS = [
  { key: 'Python', label: 'Python', tools: ['Python', 'Pandas', 'NumPy', 'Jupyter'] },
  { key: 'SQL', label: 'SQL', tools: ['SQL'] },
  { key: 'Excel', label: 'Excel', tools: ['Excel'] },
  { key: 'Power BI', label: 'Power BI', tools: ['Power BI'] },
  { key: 'Tableau', label: 'Tableau', tools: ['Tableau'] },
  { key: 'Statistics', label: 'Statistics', tools: ['Statistics', 'NumPy'] },
  { key: 'Machine Learning', label: 'Machine Learning', tools: ['Machine Learning', 'Scikit-learn'] },
  { key: 'Data Visualization', label: 'Data Visualization', tools: ['Data Visualization', 'Matplotlib', 'Seaborn'] }
];

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, doubtsRes] = await Promise.all([
          API.get('/api/sessions'),
          API.get('/api/doubts?resolved=false')
        ]);
        setSessions(sessionsRes.data.sessions || []);
        setDoubts(doubtsRes.data.doubts || []);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSessions = sessions.length;
  const totalHours = sessions.reduce((sum, s) => sum + (s.durationHours || 0), 0);
  const avgConfidence = totalSessions > 0
    ? (sessions.reduce((sum, s) => sum + (s.confidenceLevel || 3), 0) / totalSessions).toFixed(1)
    : '0.0';
  const openDoubtsCount = doubts.length;

  // Calculate self-reported skill confidence averages
  const getSkillConfidence = () => {
    return ANALYTICS_SKILLS.map((skill) => {
      const relevantSessions = sessions.filter((s) =>
        s.toolsUsed.some((tool) => skill.tools.includes(tool)) ||
        s.topic.toLowerCase().includes(skill.key.toLowerCase())
      );

      if (relevantSessions.length === 0) {
        return { label: skill.label, percentage: 0 };
      }

      const avg =
        relevantSessions.reduce((sum, s) => sum + (s.confidenceLevel || 3), 0) /
        relevantSessions.length;
      
      // Scale 1-5 to percentage (1 -> 20%, 2 -> 40%, 3 -> 60%, 4 -> 80%, 5 -> 100%)
      const percentage = Math.round(avg * 20);
      return { label: skill.label, percentage };
    });
  };

  // Process data for Recharts weekly sessions chart
  const getWeeklyData = () => {
    const weeklyCounts = {};
    
    // Initialize last 6 weeks
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      const weekLabel = `W-${i}`;
      weeklyCounts[weekLabel] = { label: weekLabel, count: 0, startDate: new Date(date.setDate(date.getDate() - date.getDay())) };
    }

    sessions.forEach((s) => {
      const sDate = new Date(s.date);
      const diffTime = Math.abs(new Date() - sDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);

      if (weekIndex >= 0 && weekIndex <= 5) {
        const weekLabel = `W-${weekIndex}`;
        if (weeklyCounts[weekLabel]) {
          weeklyCounts[weekLabel].count += 1;
        }
      }
    });

    return Object.values(weeklyCounts).reverse();
  };

  const skillBars = getSkillConfidence();
  const weeklyData = getWeeklyData();
  const recentSessions = sessions.slice(0, 5);

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Topbar title="STUDENT_DASHBOARD" />
          <div className="page-container">
            <div className="mono text-accent">LOADING_DASHBOARD_METRICS...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="STUDENT_DASHBOARD">
          <Link to="/sessions" className="btn btn-cta">
            + Log Session
          </Link>
        </Topbar>

        <div className="page-container">
          {error && <div className="login-error mb-20">{error}</div>}

          <div className="stat-cards">
            <StatCard label="Total Sessions" value={totalSessions} ghostChar="S" />
            <StatCard label="Total Hours" value={`${totalHours}h`} ghostChar="H" />
            <StatCard label="Avg Confidence" value={`${avgConfidence}/5`} ghostChar="C" />
            <StatCard label="Open Doubts" value={openDoubtsCount} ghostChar="D" />
          </div>

          <div className="grid-2 mb-28">
            <div className="card">
              <h3 className="section-label">Weekly Activity</h3>
              <MiniBarChart data={weeklyData} xKey="label" yKey="count" barName="Sessions Logged" />
            </div>

            <div className="card">
              <h3 className="section-label">Skill Confidence Level</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {skillBars.map((skill, idx) => (
                  <SkillBar key={idx} label={skill.label} percentage={skill.percentage} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid-3 mb-28">
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div className="card-header">
                <h3 className="section-label mb-0">Recent Analytics Sessions</h3>
                <Link to="/sessions" className="btn btn-sm">
                  View All
                </Link>
              </div>
              {recentSessions.length > 0 ? (
                <SessionTable sessions={recentSessions} />
              ) : (
                <EmptyState title="No sessions logged yet" text="Click '+ Log Session' to record your first analytics work." />
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="section-label mb-0">Unresolved Doubts</h3>
                <Link to="/doubts" className="btn btn-sm">
                  Manage
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {doubts.length > 0 ? (
                  doubts.slice(0, 3).map((doubt) => (
                    <div key={doubt._id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      <div className="flex justify-between items-center mb-8">
                        <ChipBadge label={doubt.sessionId?.topic || 'Session'} variant="pink" />
                        <span className="mono text-muted" style={{ fontSize: '10px' }}>
                          {new Date(doubt.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text)' }}>
                        {doubt.question}
                      </p>
                    </div>
                  ))
                ) : (
                  <EmptyState title="Clear dashboard!" text="All doubt tickets are successfully resolved." />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
