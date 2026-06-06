const { err } = require('../utils/response');

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return err(res, 'Forbidden: insufficient permissions', 403);
  }
  next();
};

module.exports = authorize;
