const router   = require('express').Router();
const ctrl     = require('../controllers/auth.controller');
const auth     = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerRules, loginRules, changePasswordRules } = require('../utils/validators');

// POST /api/auth/register
router.post('/register', registerRules, validate, ctrl.register);

// POST /api/auth/login
router.post('/login', loginRules, validate, ctrl.login);

// GET  /api/auth/me
router.get('/me', auth, ctrl.me);

// PATCH /api/auth/change-password
router.patch('/change-password', auth, changePasswordRules, validate, ctrl.changePassword);

module.exports = router;
