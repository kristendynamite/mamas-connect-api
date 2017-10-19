'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MentorSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required'
  }
});

module.exports = mongoose.model('Mentors', MentorSchema);
