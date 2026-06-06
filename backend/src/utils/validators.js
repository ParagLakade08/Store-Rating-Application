const { body, query } = require('express-validator');

const nameRule = body('name')
  .trim()
  .isLength({ min: 4, max: 60 })
  .withMessage('Name must be 4–60 characters');

const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('Valid email is required')
  .normalizeEmail();

const passwordRule = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8–16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*]/)
  .withMessage('Password must contain at least one special character (!@#$%^&*)');

const addressRule = (field = 'address', optional = false) => {
  const r = body(field).trim().isLength({ max: 400 }).withMessage('Address max 400 characters');
  return optional ? r.optional() : r;
};

exports.registerRules = [nameRule, emailRule, passwordRule, addressRule('address', true)];
exports.loginRules    = [emailRule, body('password').notEmpty().withMessage('Password is required')];

exports.changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordRule.withMessage('New password must meet requirements').bail(),
];

exports.addUserRules  = [nameRule, emailRule, passwordRule, addressRule('address', true),
  body('role').isIn(['ADMIN','USER','STORE_OWNER']).withMessage('Invalid role')];

exports.addStoreRules = [
  nameRule,
  emailRule,
  addressRule('address'),
  body('owner_id').isInt({ min: 1 }).withMessage('owner_id must be a positive integer'),
];

exports.ratingRules = [
  body('store_id').isInt({ min: 1 }).withMessage('store_id must be a positive integer'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

exports.paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be ≥ 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1–100'),
];
