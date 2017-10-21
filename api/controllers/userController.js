'use strict';
const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../config/main');
const sendWrappedResponse = require('../../utilities/responseWrapper');

let controller = {};


// Helper functions
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 60 * 60 * 24 * 7 // in seconds
  });
}

// Set user info from request
function setUserInfo(request) {
  return {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role,
  };
}

//GET all users
controller.listAllUsers = (req, res) => {
  sendWrappedResponse(User, res, req.query);
};

//GET one user by id
controller.getUser = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err)
      res.send(err);
    res.json(user);
  });
};

//PUT update user
controller.updateUser = (req, res) => {
  User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, (err, user) => {
    if (err)
      res.send(err);
    res.json(user);
  });
};

//DELETE user by id
controller.deleteUser = (req, res) => {
  User.remove({
    _id: req.params.userId
  }, (err, user) => {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
};

//GET me
controller.getMe = (req, res) => {

  const authorizationHeader = req.headers.authorization;

  const token = authorizationHeader.replace('Bearer ', '');

  const id = jwt.decode(token)._id;

  User.findById(id, (err, user) => {
    if (err)
      res.send(err);
    res.json(user);
  })
}

//========================================
// Login Route
//========================================
controller.login = function(req, res, next) {

  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'Bearer ' + generateToken(userInfo),
    user: userInfo
  });
}


//========================================
// Registration Route
//========================================
controller.register = function(req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'});
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'You must enter your full name.'});
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email: email }, function(err, existingUser) {
      if (err) { return next(err); }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({ error: 'That email address is already in use.' });
      }

      // If email is unique and password was provided, create account
      let user = new User({
        email: email,
        password: password,
        profile: { firstName: firstName, lastName: lastName }
      });

      user.save(function(err, user) {
        if (err) { return next(err); }

        // Respond with JWT if user was created

        let userInfo = setUserInfo(user);

        res.status(201).json({
          token: 'Bearer ' + generateToken(userInfo),
          user: userInfo
        });
      });
  });
}

//========================================
// Authorization Middleware
//========================================

// Role authorization check
controller.roleAuthorization = function(role) {
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}

module.exports = controller;
