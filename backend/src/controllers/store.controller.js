const StoreService = require('../services/store.service');
const { ok, err }  = require('../utils/response');

exports.listStores = async (req, res) => {
  try {
    const userId = req.user?.id ?? null;
    const result = await StoreService.listStores(req.query, userId);
    return ok(res, result);
  } catch (e) { return err(res, e.message, e.status || 500); }
};

exports.submitRating = async (req, res) => {
  try {
    const result = await StoreService.submitOrUpdateRating(
      req.user.id,
      parseInt(req.body.store_id),
      parseInt(req.body.rating),
    );
    return ok(res, result, result.action === 'created' ? 'Rating submitted' : 'Rating updated');
  } catch (e) { return err(res, e.message, e.status || 500); }
};
