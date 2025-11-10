const express = require('express');
const router = express.Router();
const {
    getAvailableTests,
    startTest,
    submitTest,
    getTestHistory,
    getCertificate
} = require('../controllers/testController');
const { authCheck } = require('../middlewares/authCheck');

// All routes require authentication
router.get('/available', authCheck, getAvailableTests);
router.get('/history', authCheck, getTestHistory);
router.get('/start/:skill', authCheck, startTest);
router.get('/certificate/:certificateId', authCheck, getCertificate);

router.post('/submit', authCheck, submitTest);

module.exports = router;
