const StoreOwnerService   = require('../services/storeOwner.service');
const { ok, err }         = require('../utils/response');

exports.getDashboard = async (req, res) => {
  try {
    const data = await StoreOwnerService.getDashboard(req.user.id);
    return ok(res, data);
  } catch (e) { return err(res, e.message, e.status || 500); }
};
