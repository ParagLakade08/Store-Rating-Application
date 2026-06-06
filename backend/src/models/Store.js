const db = require('../config/db');

const Store = {
  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT s.*, u.name AS owner_name, u.email AS owner_email,
              ROUND(AVG(r.rating), 2) AS average_rating,
              COUNT(r.id)             AS total_ratings
       FROM   stores s
       JOIN   users  u ON u.id = s.owner_id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE  s.id = ?
       GROUP  BY s.id`, [id]
    );
    return rows[0] ?? null;
  },

  findByOwnerId: async (owner_id) => {
    const [rows] = await db.query(
      `SELECT s.*, ROUND(AVG(r.rating),2) AS average_rating, COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = ?
       GROUP BY s.id`, [owner_id]
    );
    return rows[0] ?? null;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT id FROM stores WHERE email = ?', [email]);
    return rows[0] ?? null;
  },

  create: async ({ name, email, address, owner_id }) => {
    const [result] = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?,?,?,?)',
      [name, email, address, owner_id]
    );
    return result.insertId;
  },

  findAll: async ({ search, sortBy, sortOrder, limit, offset }) => {
    const allowed = ['name', 'email', 'address', 'average_rating', 'created_at'];
    const col = allowed.includes(sortBy) ? sortBy : 'created_at';
    const dir = sortOrder === 'asc' ? 'ASC' : 'DESC';
    const like = `%${search || ''}%`;

    const countSql = `SELECT COUNT(DISTINCT s.id) AS total FROM stores s
                      WHERE (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)`;
    const dataSql  = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at,
             u.name AS owner_name,
             ROUND(AVG(r.rating),2) AS average_rating,
             COUNT(r.id)            AS total_ratings
      FROM   stores s
      JOIN   users  u ON u.id = s.owner_id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE  (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)
      GROUP  BY s.id
      ORDER  BY ${col} ${dir}
      LIMIT  ? OFFSET ?`;

    const [[{ total }]] = await db.query(countSql, [like, like, like]);
    const [rows]        = await db.query(dataSql,  [like, like, like, limit, offset]);
    return { rows, total };
  },
};

module.exports = Store;
