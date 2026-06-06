const router    = require('express').Router();
const ctrl      = require('../controllers/admin.controller');
const auth      = require('../middleware/auth');
const authorize = require('../middleware/role');
const validate  = require('../middleware/validate');
const { addUserRules, addStoreRules, paginationRules } = require('../utils/validators');

const guard = [auth, authorize('ADMIN')];

router.get('/dashboard',        ...guard,                    ctrl.getDashboard);
router.post('/users',           ...guard, addUserRules,  validate, ctrl.addUser);
router.post('/stores',          ...guard, addStoreRules, validate, ctrl.addStore);
router.get('/users',            ...guard, paginationRules, validate, ctrl.getUsers);
router.get('/stores',           ...guard, paginationRules, validate, ctrl.getStores);
router.delete('/users/:id',     ...guard,                          ctrl.deleteUser);

module.exports = router;
