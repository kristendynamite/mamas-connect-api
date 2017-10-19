const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mamasconnect');

//Import models here
const Mentor = require('./api/models/mentorModel');

//Import routes here
const mentorRoutes = require('./api/routes/mentorRoutes');

//register Routes
app.use('/api', mentorRoutes);


////////////////
// MIDDLEWARE //
////////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




app.listen(process.env.PORT || 3000, () => { console.log(`API started on: ${process.env.PORT || 3000}`); });
