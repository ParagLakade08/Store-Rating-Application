const AdminService = require('../services/admin.service');
const { ok, created, err } = require('../utils/response');

exports.getDashboard = async (req, res) => {
  try {
    const stats = await AdminService.getDashboard();
    return ok(res, stats);
  } catch (e) { return err(res, e.message, e.status || 500); }
};

exports.addUser = async (req, res) => {
  try {
    const user = await AdminService.addUser(req.body);
    return created(res, user, 'User created');
  } catch (e) { return err(res, e.message, e.status || 500); }
};

exports.addStore = async (req, res) => {
  try {
    const store = await AdminService.addStore(req.body);
    return created(res, store, 'Store created');
  } catch (e) { return err(res, e.message, e.status || 500); }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await AdminService.getUsers(req.query);
    return ok(res, result);
  } catch (e) { return err(res, e.message, e.status || 500); }
};

exports.getStores = async (req, res) => {
  try {
    const result = await AdminService.getStores(req.query);
    return ok(res, result);
  } catch (e) { return err(res, e.message, e.status || 500); }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await AdminService.deleteUser(req.params.id);
    return ok(res, result, 'User deleted successfully');
  } catch (e) { return err(res, e.message, e.status || 500); }
};
