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
  User.findById(req.params.userId, (err, user) => {
    if (err) res.send(err);

    let update = JSON.parse(JSON.stringify(user)); //deep clone the document

    if (req.body.password || req.body.role) {
      res.status(400).send({error: 'You may not update a password or role from this route.'});
    }

    update.email = req.body.email ? req.body.email : update.email;
    update.profile.firstName = req.body.firstName ? req.body.firstName : update.profile.firstName;
    update.profile.lastName = req.body.lastName ? req.body.lastName : update.profile.lastName;

    User.findOneAndUpdate({_id: req.params.userId}, update, {new: true}, (err, updatedUser) => {
      if (err) res.send(err);
      res.json(updatedUser);
    });
  });
};

controller.updateUserRole = (req, res) => {
  User.findOneAndUpdate({_id: req.params.userId}, {role: req.body.role}, {new: true}, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
}

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

controller.updateUserPassword = (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const userId = req.params.userId;

  //req comes in
  //URL: api/users/update_password/329423904
  //payload: { oldPassword: oldpass, newPassword: newpass }

  //grab the user by userId
  User.findById(userId, (err, user) => {
    if (err) { res.send(err) }

    //compare the old password to make sure they are authed
    user.comparePassword(oldPassword, (err, isMatch) => {
      if (err) { res.send(err); }
      if (!isMatch) { res.send({error: 'not authed' }); }
      if (isMatch) {
        //hash the new password
        user.createPasswordHash(newPassword, (hashedPassword) => {
          //update the record in the database with the new hash
          User.findOneAndUpdate({ _id: userId }, { password: hashedPassword }, { new: true }, (err, user) => {
            if (err) { res.send(err); }
            //send back a success message
            res.json(user);
          })
        });
      }
    });
  });
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

      if (role === 'Admin' && foundUser.role === 'Admin') return next();
      if (role === 'Mentor' && (foundUser.role === 'Mentor' || foundUser.role === 'Admin')) return next();
      if (role === 'Member' && (foundUser.role === 'Mentor' || foundUser.role === 'Admin' || foundUser.role === 'Member')) return next();

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}

module.exports = controller;
