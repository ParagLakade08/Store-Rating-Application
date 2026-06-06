const db = require('../config/db');

const User = {
  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, name, email, address, role, created_at, updated_at FROM users WHERE id = ?', [id]
    );
    return rows[0] ?? null;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] ?? null;
  },

  create: async ({ name, email, password, address, role = 'USER' }) => {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?,?,?,?,?)',
      [name, email, password, address ?? null, role]
    );
    return result.insertId;
  },

  updatePassword: async (id, hashedPassword) => {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  },

  findAll: async ({ search, sortBy, sortOrder, limit, offset }) => {
    const allowed = ['name', 'email', 'role', 'created_at'];
    const col  = allowed.includes(sortBy) ? sortBy : 'created_at';
    const dir  = sortOrder === 'asc' ? 'ASC' : 'DESC';
    const like = `%${search || ''}%`;

    const countSql = 'SELECT COUNT(*) AS total FROM users WHERE (name LIKE ? OR email LIKE ? OR address LIKE ?)';
    const dataSql  = `
      SELECT id, name, email, address, role, created_at, updated_at
      FROM   users
      WHERE  (name LIKE ? OR email LIKE ? OR address LIKE ?)
      ORDER  BY ${col} ${dir}
      LIMIT  ? OFFSET ?`;

    const [[{ total }]] = await db.query(countSql, [like, like, like]);
    const [rows]        = await db.query(dataSql,  [like, like, like, limit, offset]);
    return { rows, total };
  },

  deleteById: async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = User;
