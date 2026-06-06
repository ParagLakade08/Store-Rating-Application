const { verifyToken }  = require('../utils/jwt');
const { err }          = require('../utils/response');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return err(res, 'No token provided', 401);
  }
  const token = header.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return err(res, 'Invalid or expired token', 401);
  }
};

module.exports = authenticate;
