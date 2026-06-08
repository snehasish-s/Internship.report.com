const Session = require('../models/Session');
const Doubt = require('../models/Doubt');

// GET /api/sessions — student's own sessions
exports.getSessions = async (req, res) => {
  try {
    const { type, tool, sort } = req.query;
    const filter = { userId: req.user.id };

    if (type) filter.type = type;
    if (tool) filter.toolsUsed = { $in: [tool] };

    let sortOption = { date: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'duration') sortOption = { durationHours: -1 };
    if (sort === 'date-asc') sortOption = { date: 1 };

    const sessions = await Session.find(filter).sort(sortOption);
    res.json({ sessions });
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ message: 'Server error fetching sessions.' });
  }
};

// POST /api/sessions — create new session
exports.createSession = async (req, res) => {
  try {
    const {
      date, topic, toolsUsed, learnings, type,
      durationHours, mentor, rating, confidenceLevel, datasetUsed
    } = req.body;

    const session = new Session({
      userId: req.user.id,
      date,
      topic,
      toolsUsed: toolsUsed || [],
      learnings,
      type,
      durationHours: durationHours || 1,
      mentor,
      rating,
      confidenceLevel: confidenceLevel || 3,
      datasetUsed
    });

    await session.save();
    res.status(201).json({ message: 'Session created', session });
  } catch (err) {
    console.error('Create session error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating session.' });
  }
};

// PUT /api/sessions/:id — update session (owner only)
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    const allowedFields = [
      'date', 'topic', 'toolsUsed', 'learnings', 'type',
      'durationHours', 'mentor', 'rating', 'confidenceLevel', 'datasetUsed'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        session[field] = req.body[field];
      }
    });

    await session.save();
    res.json({ message: 'Session updated', session });
  } catch (err) {
    console.error('Update session error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating session.' });
  }
};

// DELETE /api/sessions/:id — delete session (owner only) + cascade doubts
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    // Delete associated doubts
    await Doubt.deleteMany({ sessionId: session._id });
    await Session.deleteOne({ _id: session._id });

    res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ message: 'Server error deleting session.' });
  }
};
