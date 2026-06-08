const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.use(verifyToken);
router.use(isAdmin);

router.get('/students', adminController.getStudents);
router.get('/students/:id', adminController.getStudentDetail);
router.get('/sessions', adminController.getAllSessions);
router.get('/stats', adminController.getStats);

module.exports = router;
