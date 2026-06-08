const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);

router.get('/', doubtController.getDoubts);
router.post('/', doubtController.createDoubt);
router.put('/:id', doubtController.updateDoubt);

module.exports = router;
