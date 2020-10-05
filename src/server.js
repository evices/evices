'use strict';
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// requiring dependencies
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const router = require('./router/api-v1');
const auth_router = require('./router/auth-route');
const extra_route = require('./router/extra-route');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// requiring the error middleware files
const notFoundhandler = require('./error_Middleware/404error');
const internalServerError = require('./error_Middleware/500');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// puts new Express application inside the app variable (to start a new Express application)
const app = express();
// express. json() is a inbuilt method in express to recognize the incoming Request Object as a JSON Object
app.use(express.json());
//
app.use(cors());
//
app.use(morgan('dev'));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(auth_router);
app.use(extra_route);
app.use(router);

// using the error middleware handlers
app.get('*', notFoundhandler);
app.get(internalServerError);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exporting the server and the listen to the index.js to start the server
module.exports = {
    server: app,
    start: (port) => {
      const PORT = port || process.env.PORT || 3030;
      app.listen(PORT, () => console.log(`server is running on ${PORT}`));
    },
  };