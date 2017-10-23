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
// const REQUIRE_MEMBER = "Member";

router.get('/', requireAuth, users.roleAuthorization(REQUIRE_ADMIN), users.listAllUsers);

router.get('/me', requireAuth, users.getMe);

router.get('/:userId', requireAuth, users.roleAuthorization(REQUIRE_MENTOR), users.getUser); //get user by id

router.put('/:userId', requireAuth, users.updateUser); //update non-password-non-role info

router.delete('/:userId', requireAuth, users.roleAuthorization(REQUIRE_ADMIN), users.deleteUser);

//=========================
// Auth Routes
//=========================

// Registration route
router.post('/register', users.register);

// Login route
router.post('/login', requireLogin, users.login);

// Update Role route
router.put('/update_role/:userId', requireAuth, users.roleAuthorization(REQUIRE_ADMIN), users.updateUserRole);

module.exports = router;
