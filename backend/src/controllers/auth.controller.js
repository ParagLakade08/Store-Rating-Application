const AuthService = require('../services/auth.service');
const { ok, created, err } = require('../utils/response');

exports.register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    return created(res, user, 'Registration successful');
  } catch (e) {
    return err(res, e.message, e.status || 500);
  }
};

exports.login = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    return ok(res, result, 'Login successful');
  } catch (e) {
    return err(res, e.message, e.status || 500);
  }
};

exports.changePassword = async (req, res) => {
  try {
    await AuthService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    return ok(res, null, 'Password changed successfully');
  } catch (e) {
    return err(res, e.message, e.status || 500);
  }
};

exports.me = async (req, res) => {
  const { ok: send } = require('../utils/response');
  const User = require('../models/User');
  try {
    const user = await User.findById(req.user.id);
    return ok(res, user);
  } catch (e) {
    return err(res, e.message, 500);
  }
};
