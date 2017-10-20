'use strict';
const express = require('express');
const router = express.Router();
const mentors = require('../controllers/mentorController');

const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/mentors', requireAuth, mentors.listAllMentors);

router.post('/mentors', mentors.addMentor);

router.get('/mentors/:mentorId', mentors.getMentor);

router.put('/mentors/:mentorId', mentors.updateMentor);

router.delete('/mentors/:mentorId', mentors.deleteMentor);

module.exports = router;
