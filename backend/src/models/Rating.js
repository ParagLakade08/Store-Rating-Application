const db = require('../config/db');

const Rating = {
  findByUserAndStore: async (user_id, store_id) => {
    const [rows] = await db.query(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?', [user_id, store_id]
    );
    return rows[0] ?? null;
  },

  upsert: async (user_id, store_id, rating) => {
    const existing = await Rating.findByUserAndStore(user_id, store_id);
    if (existing) {
      await db.query('UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?', [rating, user_id, store_id]);
      return { action: 'updated' };
    }
    await db.query('INSERT INTO ratings (rating, user_id, store_id) VALUES (?,?,?)', [rating, user_id, store_id]);
    return { action: 'created' };
  },

  findByStore: async (store_id) => {
    const [rows] = await db.query(
      `SELECT r.id, r.rating, r.created_at, r.updated_at,
              u.id AS user_id, u.name AS user_name, u.email AS user_email
       FROM   ratings r
       JOIN   users   u ON u.id = r.user_id
       WHERE  r.store_id = ?
       ORDER  BY r.updated_at DESC`, [store_id]
    );
    return rows;
  },

  countAll: async () => {
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM ratings');
    return total;
  },
};

module.exports = Rating;
