'use strict';
// to handel the internal Server Errors
module.exports =(error, req, res, next)=>{
  res.status(500).json({error:error});
  next();
};