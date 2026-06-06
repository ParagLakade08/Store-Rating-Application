const Store   = require('../models/Store');
const Rating  = require('../models/Rating');
const { paginate, paginatedResponse } = require('../utils/pagination');
const db      = require('../config/db');

const StoreService = {
  listStores: async (query, userId) => {
    const { page, limit, offset } = paginate(query);
    const { rows, total } = await Store.findAll({
      search:    query.search    || '',
      sortBy:    query.sortBy    || 'name',
      sortOrder: query.sortOrder || 'asc',
      limit, offset,
    });

    // Attach myRating per store for the logged-in user
    const data = await Promise.all(
      rows.map(async (store) => {
        const my = userId
          ? await Rating.findByUserAndStore(userId, store.id)
          : null;
        return { ...store, my_rating: my?.rating ?? null };
      })
    );
    return paginatedResponse(data, total, page, limit);
  },

  submitOrUpdateRating: async (userId, storeId, rating) => {
    const store = await Store.findById(storeId);
    if (!store) throw { status: 404, message: 'Store not found' };
    return Rating.upsert(userId, storeId, rating);
  },
};

module.exports = StoreService;
