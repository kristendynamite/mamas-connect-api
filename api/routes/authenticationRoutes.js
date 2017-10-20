const AuthenticationController = require('../controllers/authenticationController'),
      express = require('express'),
      passportService = require('../../config/passport'),
      passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin",
      REQUIRE_MENTOR = "Mentor",
      REQUIRE_MEMBER = "Member";

// Initializing route groups
const router = express.Router();

//=========================
// Auth Routes
//=========================

// Registration route
router.post('/register', AuthenticationController.register);

// Login route
router.post('/login', requireLogin, AuthenticationController.login);

module.exports = router;
