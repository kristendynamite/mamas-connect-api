const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./config/main');
const db = process.env.NODE_ENV !== 'test' ? config.database : config.testDatabase;
//Import routes here
const userRoutes = require('./api/routes/userRoutes');

mongoose.Promise = global.Promise;
mongoose.connect(db, { useMongoClient: true });

////////////////
// MIDDLEWARE //
////////////////
// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

//set up CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

//register Routes
app.use('/api/users', userRoutes);

app.listen(config.port, () => { console.log(`API started on: ${config.port}`); });

module.exports = app;