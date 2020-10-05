'use strict';

// requiring dependencies
require('dotenv').config();
const mongoose = require('mongoose');

// requiring the server and the listen to start the server
const server = require('./src/server.js');

// requiring the mongo DB URL from the .env file
const MONGOOSE_URL = process.env.MONGOOSE_URL;
// 
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
// connecting the mongoose DB using the MONGOOSE_URL and mongoose Options
mongoose.connect(MONGOOSE_URL, mongooseOptions);

// starting the server
server.start();