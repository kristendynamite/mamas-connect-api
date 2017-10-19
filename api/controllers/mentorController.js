'use strict';
const mongoose = require('mongoose');
const Mentor = mongoose.model('Mentors');
let controller = {};

controller.listAllMentors = (req, res) => {
  Mentor.find({}, (err, mentor) => {
    if (err)
      res.send(err);
    res.json(mentor);
  });
};

controller.addMentor = (req, res) => {
  var newMentor = new Mentor(req.body);
  newMentor.save((err, mentor) => {
    if (err)
      res.send(err);
    res.json(mentor);
  });
};

controller.getMentor = (req, res) => {
  Mentor.findById(req.params.mentorId, (err, mentor) => {
    if (err)
      res.send(err);
    res.json(mentor);
  });
};

controller.updateMentor = (req, res) => {
  Mentor.findOneAndUpdate({_id: req.params.mentorId}, req.body, {new: true}, (err, mentor) => {
    if (err)
      res.send(err);
    res.json(mentor);
  });
};

controller.deleteMentor = (req, res) => {
  Mentor.remove({
    _id: req.params.mentorId
  }, (err, mentor) => {
    if (err)
      res.send(err);
    res.json({ message: 'Mentor successfully deleted' });
  });
};

module.exports = controller;
