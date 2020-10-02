'use strict';

module.exports = (req, res, next) => {
  let model = req.params.model;
  switch (model) {
    case 'user':
      req.model = require(`../model/${model}/${model}-collection`);
      next();
      return;
    case 'message':
      req.model = require(`../model/${model}/${model}-collection`);
      next();
      return;
    case 'post':
      req.model = require(`../model/${model}/${model}-collection`);
      next();
      return;
    case 'signin':
      next();
      return;
    case 'signup':
      next();
      return;
    default:
      next('Invalid Model');
      return;
  }
};