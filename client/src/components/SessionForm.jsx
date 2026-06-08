import React, { useState, useEffect } from 'react';

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

const SessionForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Save Session' }) => {
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('Hands-on Lab');
  const [toolsUsed, setToolsUsed] = useState([]);
  const [datasetUsed, setDatasetUsed] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [mentor, setMentor] = useState('');
  const [learnings, setLearnings] = useState('');
  const [rating, setRating] = useState(5);
  const [confidenceLevel, setConfidenceLevel] = useState(3);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      // Format date to YYYY-MM-DD
      const formattedDate = initialData.date
        ? new Date(initialData.date).toISOString().split('T')[0]
        : '';
      setDate(formattedDate);
      setTopic(initialData.topic || '');
      setType(initialData.type || 'Hands-on Lab');
      setToolsUsed(initialData.toolsUsed || []);
      setDatasetUsed(initialData.datasetUsed || '');
      setDurationHours(initialData.durationHours || 1);
      setMentor(initialData.mentor || '');
      setLearnings(initialData.learnings || '');
      setRating(initialData.rating || 5);
      setConfidenceLevel(initialData.confidenceLevel || 3);
    } else {
      // Default to today
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);

  const handleToolChange = (tool) => {
    if (toolsUsed.includes(tool)) {
      setToolsUsed(toolsUsed.filter((t) => t !== tool));
    } else {
      setToolsUsed([...toolsUsed, tool]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!date) return setError('Date is required');
    if (!topic.trim()) return setError('Topic is required');
    if (!learnings.trim()) return setError('Learnings are required');
    if (rating < 1 || rating > 5) return setError('Rating must be between 1 and 5');
    if (confidenceLevel < 1 || confidenceLevel > 5) return setError('Confidence level must be between 1 and 5');

    onSubmit({
      date,
      topic: topic.trim(),
      type,
      toolsUsed,
      datasetUsed: datasetUsed.trim(),
      durationHours: parseFloat(durationHours),
      mentor: mentor.trim(),
      learnings: learnings.trim(),
      rating,
      confidenceLevel
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && <div className="login-error">{error}</div>}

      <div className="form-row">
        <div className="form-group mb-0">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-0">
          <label className="form-label">Session Type</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {SESSION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Topic / Subject</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Pandas DataFrames & NumPy operations"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Tools Used</label>
        <div className="checkbox-group">
          {ANALYTICS_TOOLS.map((tool) => (
            <div key={tool} className="checkbox-item">
              <input
                type="checkbox"
                id={`tool-${tool}`}
                checked={toolsUsed.includes(tool)}
                onChange={() => handleToolChange(tool)}
              />
              <label htmlFor={`tool-${tool}`}>{tool}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group mb-0">
          <label className="form-label">Duration (Hours)</label>
          <input
            type="number"
            className="form-input"
            step="0.5"
            min="0.5"
            max="12"
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-0">
          <label className="form-label">Dataset Used (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Titanic.csv, Superstore Data"
            value={datasetUsed}
            onChange={(e) => setDatasetUsed(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Mentor / Instructor Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Prof. Anil Kumar"
          value={mentor}
          onChange={(e) => setMentor(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Learnings Summary</label>
        <textarea
          className="form-textarea"
          placeholder="Describe what data analytics operations, functions, or concepts you covered."
          value={learnings}
          onChange={(e) => setLearnings(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group mb-0">
          <label className="form-label">Overall Rating</label>
          <div className="star-rating" style={{ height: '41px', display: 'flex', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`star-rating-btn ${num <= rating ? 'filled' : ''}`}
                onClick={() => setRating(num)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group mb-0">
          <label className="form-label">Confidence Level ({confidenceLevel}/5)</label>
          <div style={{ height: '41px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                className={`btn btn-sm ${confidenceLevel === level ? 'btn-cta' : ''}`}
                onClick={() => setConfidenceLevel(level)}
                style={{ flex: 1, minWidth: '32px' }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="modal-footer" style={{ padding: '16px 0 0 0', border: 'none' }}>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-cta">
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
