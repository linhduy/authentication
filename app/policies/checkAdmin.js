module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  console.log(req.query.admin);
  if (req.query.admin == "true") {
  	console.log("vo day");
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.send('You are not permitted to perform this action.');
};
