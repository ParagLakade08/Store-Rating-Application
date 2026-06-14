const Store = require("../models/Store");
const Rating = require("../models/Rating");

const StoreOwnerService = {
  getDashboard: async (ownerId) => {
    const store = await Store.findByOwnerId(ownerId);
    if (!store)
      throw { status: 404, message: "No store assigned to your account" };

    const raters = await Rating.findByStore(store.id);
    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        average_rating: store.average_rating,
        total_ratings: store.total_ratings,
      },
      raters: raters.map((r) => ({
        user_id: r.user_id,
        user_name: r.user_name,
        user_email: r.user_email,
        rating: r.rating,
        rated_at: r.updated_at,
      })),
    };
  },
};

// module.exports = StoreOwnerService;
module.exports = StoreOwnerService;
