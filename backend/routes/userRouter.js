const express = require('express');
const router = express.Router();
const {registerUser, viewProfile, getMatches, login, editUserProfile, updateUserSkills, updateUserInterests, logout, getNotifications, saveSkillVideoUrl, deleteSkillVideo, uploadSkillVideo, watchVideo, getTokenBalance, rateVideo, getVideoRatings, getAllVideoRatings} = require('../controllers/userController')
const {authCheck} = require('../middlewares/authCheck')

router.get('/matches', authCheck, getMatches)
router.get('/notifications', authCheck, getNotifications)
router.get('/profile', authCheck, viewProfile)
router.get('/tokens', authCheck, getTokenBalance)
router.get('/video-ratings/:username/:skill', getVideoRatings)
router.get('/all-video-ratings', authCheck, getAllVideoRatings)

router.put('/profile-update', authCheck, editUserProfile)
router.put('/skills-update', authCheck, updateUserSkills)
router.put('/interests-update', authCheck, updateUserInterests);

router.post('/logout', logout)
router.post('/login', login)
router.post('/register', registerUser)
router.post('/save-skill-video-url', authCheck, saveSkillVideoUrl)
router.post('/upload-skill-video', authCheck, uploadSkillVideo)
router.post('/watch-video', authCheck, watchVideo)
router.post('/rate-video', authCheck, rateVideo)

router.delete('/delete-skill-video', authCheck, deleteSkillVideo)


module.exports = router; 