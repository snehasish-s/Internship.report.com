const User = require('../models/User');
const Session = require('../models/Session');
const Doubt = require('../models/Doubt');

// GET /api/admin/students — all students with stats
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).sort({ name: 1 });

    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const sessions = await Session.find({ userId: student._id });
        const sessionCount = sessions.length;
        const avgRating = sessionCount > 0
          ? Math.round((sessions.reduce((sum, s) => sum + s.rating, 0) / sessionCount) * 10) / 10
          : 0;
        const totalHours = sessions.reduce((sum, s) => sum + (s.durationHours || 0), 0);

        return {
          ...student.toJSON(),
          sessionCount,
          avgRating,
          totalHours: Math.round(totalHours * 10) / 10
        };
      })
    );

    res.json({ students: studentsWithStats });
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ message: 'Server error fetching students.' });
  }
};

// GET /api/admin/students/:id — individual student detail
exports.getStudentDetail = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const sessions = await Session.find({ userId: student._id }).sort({ date: -1 });
    const doubts = await Doubt.find({ studentId: student._id })
      .populate('sessionId', 'topic date type')
      .sort({ createdAt: -1 });

    // Calculate skill confidence from sessions
    const toolConfidence = {};
    const toolCounts = {};
    sessions.forEach(session => {
      session.toolsUsed.forEach(tool => {
        if (!toolConfidence[tool]) {
          toolConfidence[tool] = 0;
          toolCounts[tool] = 0;
        }
        toolConfidence[tool] += session.confidenceLevel || 3;
        toolCounts[tool] += 1;
      });
    });

    const skillBars = Object.keys(toolConfidence).map(tool => ({
      skill: tool,
      avgConfidence: Math.round((toolConfidence[tool] / toolCounts[tool]) * 20), // Scale 1-5 to percentage
      sessions: toolCounts[tool]
    }));

    const totalHours = sessions.reduce((sum, s) => sum + (s.durationHours || 0), 0);
    const avgRating = sessions.length > 0
      ? Math.round((sessions.reduce((sum, s) => sum + s.rating, 0) / sessions.length) * 10) / 10
      : 0;
    const avgConfidence = sessions.length > 0
      ? Math.round((sessions.reduce((sum, s) => sum + (s.confidenceLevel || 3), 0) / sessions.length) * 10) / 10
      : 0;

    res.json({
      student: student.toJSON(),
      sessions,
      doubts,
      skillBars,
      stats: {
        totalSessions: sessions.length,
        totalHours: Math.round(totalHours * 10) / 10,
        avgRating,
        avgConfidence,
        openDoubts: doubts.filter(d => !d.resolved).length
      }
    });
  } catch (err) {
    console.error('Get student detail error:', err);
    res.status(500).json({ message: 'Server error fetching student detail.' });
  }
};

// GET /api/admin/sessions — all sessions with filters
exports.getAllSessions = async (req, res) => {
  try {
    const { student, batch, type, tool, startDate, endDate } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (tool) filter.toolsUsed = { $in: [tool] };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // If student filter, add userId
    if (student) {
      filter.userId = student;
    }

    // If batch filter, find all users in that batch first
    if (batch) {
      const usersInBatch = await User.find({ batch, role: 'student' }).select('_id');
      const userIds = usersInBatch.map(u => u._id);
      filter.userId = filter.userId
        ? { $in: [filter.userId].filter(id => userIds.includes(id)) }
        : { $in: userIds };
    }

    const sessions = await Session.find(filter)
      .populate('userId', 'name email batch')
      .sort({ date: -1 });

    res.json({ sessions });
  } catch (err) {
    console.error('Get all sessions error:', err);
    res.status(500).json({ message: 'Server error fetching sessions.' });
  }
};

// GET /api/admin/stats — aggregate statistics
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSessions = await Session.countDocuments();
    const allSessions = await Session.find();

    // Tool usage frequency
    const toolUsage = {};
    allSessions.forEach(session => {
      session.toolsUsed.forEach(tool => {
        toolUsage[tool] = (toolUsage[tool] || 0) + 1;
      });
    });
    const toolUsageArray = Object.entries(toolUsage)
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count);

    // Session type distribution
    const typeDistribution = {};
    allSessions.forEach(session => {
      typeDistribution[session.type] = (typeDistribution[session.type] || 0) + 1;
    });
    const typeDistributionArray = Object.entries(typeDistribution)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Average confidence per skill/tool
    const skillConfidence = {};
    const skillCounts = {};
    allSessions.forEach(session => {
      session.toolsUsed.forEach(tool => {
        if (!skillConfidence[tool]) {
          skillConfidence[tool] = 0;
          skillCounts[tool] = 0;
        }
        skillConfidence[tool] += session.confidenceLevel || 3;
        skillCounts[tool] += 1;
      });
    });
    const avgConfidencePerSkill = Object.keys(skillConfidence).map(tool => ({
      skill: tool,
      avgConfidence: Math.round((skillConfidence[tool] / skillCounts[tool]) * 10) / 10
    }));

    // Total hours
    const totalHours = allSessions.reduce((sum, s) => sum + (s.durationHours || 0), 0);

    // Average rating
    const avgRating = totalSessions > 0
      ? Math.round((allSessions.reduce((sum, s) => sum + s.rating, 0) / totalSessions) * 10) / 10
      : 0;

    // Weekly sessions (last 8 weeks)
    const weeklySessions = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const count = allSessions.filter(s => {
        const d = new Date(s.date);
        return d >= weekStart && d <= weekEnd;
      }).length;

      weeklySessions.push({
        week: weekStart.toISOString().slice(0, 10),
        count
      });
    }

    // Open doubts count
    const openDoubts = await Doubt.countDocuments({ resolved: false });
    const totalDoubts = await Doubt.countDocuments();

    res.json({
      totalStudents,
      totalSessions,
      totalHours: Math.round(totalHours * 10) / 10,
      avgRating,
      openDoubts,
      totalDoubts,
      toolUsage: toolUsageArray,
      typeDistribution: typeDistributionArray,
      avgConfidencePerSkill,
      weeklySessions
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'Server error fetching stats.' });
  }
};
