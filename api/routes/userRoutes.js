'use strict';
const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');

const passportService = require('../../config/passport');
const passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin";
const REQUIRE_MENTOR = "Mentor";
const REQUIRE_MEMBER = "Member";

router.get('/', requireAuth, users.listAllUsers);

router.get('/me', requireAuth, users.getMe);

router.get('/:userId', requireAuth, users.getUser);

router.put('/:userId', requireAuth, users.updateUser);

router.delete('/:userId', requireAuth, users.deleteUser);


module.exports = router;



//=========================
// Auth Routes
//=========================

// Registration route
router.post('/users/register', users.register);

// Login route
router.post('/users/login', requireLogin, users.login);
