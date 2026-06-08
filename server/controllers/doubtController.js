const Doubt = require('../models/Doubt');
const Session = require('../models/Session');

// GET /api/doubts — student's own doubts
exports.getDoubts = async (req, res) => {
  try {
    const { resolved } = req.query;
    const filter = { studentId: req.user.id };

    if (resolved === 'true') filter.resolved = true;
    if (resolved === 'false') filter.resolved = false;

    const doubts = await Doubt.find(filter)
      .populate('sessionId', 'topic date type')
      .sort({ createdAt: -1 });

    res.json({ doubts });
  } catch (err) {
    console.error('Get doubts error:', err);
    res.status(500).json({ message: 'Server error fetching doubts.' });
  }
};

// POST /api/doubts — create new doubt
exports.createDoubt = async (req, res) => {
  try {
    const { sessionId, question } = req.body;

    // Verify the session belongs to the student
    const session = await Session.findOne({ _id: sessionId, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found or not yours.' });
    }

    const doubt = new Doubt({
      sessionId,
      studentId: req.user.id,
      question
    });

    await doubt.save();

    // Populate session info before returning
    await doubt.populate('sessionId', 'topic date type');

    res.status(201).json({ message: 'Doubt created', doubt });
  } catch (err) {
    console.error('Create doubt error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating doubt.' });
  }
};

// PUT /api/doubts/:id — update doubt / mark resolved
exports.updateDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found.' });
    }

    // Students can only update their own doubts, admins can update any
    if (req.user.role !== 'admin' && doubt.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this doubt.' });
    }

    if (req.body.answer !== undefined) doubt.answer = req.body.answer;
    if (req.body.resolved !== undefined) doubt.resolved = req.body.resolved;
    if (req.body.question !== undefined) doubt.question = req.body.question;

    await doubt.save();
    await doubt.populate('sessionId', 'topic date type');

    res.json({ message: 'Doubt updated', doubt });
  } catch (err) {
    console.error('Update doubt error:', err);
    res.status(500).json({ message: 'Server error updating doubt.' });
  }
};
