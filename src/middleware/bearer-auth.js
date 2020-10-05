'use strict';

const User = require('../model/user/user-collection');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
  }else{

      let token = req.headers.authorization.split(' ').pop();
    
      try {
        const users = await User.authenticateToken(token);
        console.log(users);
        req.user = {
          id: users.id,
          username: users.username,
          role: users.role,
          capabilities: users.capabilities,
        };
        next();
      } catch (e) {
        next('Invalid Login');
      }
  }
};
