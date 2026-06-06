const router    = require('express').Router();
const ctrl      = require('../controllers/storeOwner.controller');
const auth      = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/dashboard', auth, authorize('STORE_OWNER'), ctrl.getDashboard);

module.exports = router;
