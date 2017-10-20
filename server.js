const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./config/main');

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

//Import models here
const Mentor = require('./api/models/mentorModel');



////////////////
// MIDDLEWARE //
////////////////
// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set up CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


//Import routes here
const mentorRoutes = require('./api/routes/mentorRoutes');
const authRoutes = require('./api/routes/authenticationRoutes');

app.use(logger('dev'));

//register Routes
app.use('/api', mentorRoutes);
app.use('/auth', authRoutes);



app.listen(config.port, () => { console.log(`API started on: ${config.port}`); });
