'use strict';
// to handel if the server could not find what was requested
module.exports = (req, res, next) => {
  res.status(404).send({ err: 'Page Not Found' });
  next();
};