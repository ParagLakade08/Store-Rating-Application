const router   = require('express').Router();
const ctrl     = require('../controllers/store.controller');
const auth     = require('../middleware/auth');
const authorize = require('../middleware/role');
const validate = require('../middleware/validate');
const { ratingRules, paginationRules } = require('../utils/validators');

// Public — enriched with my_rating when token is present (optional auth)
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const { verifyToken } = require('../utils/jwt');
    try { req.user = verifyToken(header.split(' ')[1]); } catch { /* ignore */ }
  }
  next();
};

router.get('/',          optionalAuth, paginationRules, validate, ctrl.listStores);
router.post('/ratings',  auth, authorize('USER'), ratingRules, validate, ctrl.submitRating);

module.exports = router;
