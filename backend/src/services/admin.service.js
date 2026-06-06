const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const Store   = require('../models/Store');
const Rating  = require('../models/Rating');
const db      = require('../config/db');
const { paginate, paginatedResponse } = require('../utils/pagination');

const AdminService = {
  getDashboard: async () => {
    const [[{ totalUsers }]]  = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalStores }]] = await db.query('SELECT COUNT(*) AS totalStores FROM stores');
    const totalRatings        = await Rating.countAll();
    return { totalUsers, totalStores, totalRatings };
  },

  addUser: async ({ name, email, password, address, role }) => {
    const exists = await User.findByEmail(email);
    if (exists) throw { status: 409, message: 'Email already registered' };
    const hashed = await bcrypt.hash(password, 10);
    const id     = await User.create({ name, email, password: hashed, address, role });
    return User.findById(id);
  },

  addStore: async ({ name, email, address, owner_id }) => {
    const owner = await User.findById(owner_id);
    if (!owner)                      throw { status: 404, message: 'Owner not found' };
    if (owner.role !== 'STORE_OWNER') throw { status: 400, message: 'User must have STORE_OWNER role' };

    const existing = await Store.findByOwnerId(owner_id);
    if (existing) throw { status: 409, message: 'This owner already has a store' };

    const emailUsed = await Store.findByEmail(email);
    if (emailUsed) throw { status: 409, message: 'Store email already in use' };

    const id = await Store.create({ name, email, address, owner_id });
    return Store.findById(id);
  },

  getUsers: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { rows, total } = await User.findAll({
      search: query.search || '',
      sortBy: query.sortBy || 'created_at',
      sortOrder: query.sortOrder || 'desc',
      limit, offset,
    });
    return paginatedResponse(rows, total, page, limit);
  },

  getStores: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { rows, total } = await Store.findAll({
      search: query.search || '',
      sortBy: query.sortBy || 'created_at',
      sortOrder: query.sortOrder || 'desc',
      limit, offset,
    });
    return paginatedResponse(rows, total, page, limit);
  },

  deleteUser: async (id) => {
    if (!id || id <= 0) throw { status: 400, message: 'Invalid user ID' };
    const user = await User.findById(id);
    if (!user) throw { status: 404, message: 'User not found' };
    if (user.role === 'ADMIN') throw { status: 403, message: 'Cannot delete admin users' };
    const deleted = await User.deleteById(id);
    if (!deleted) throw { status: 500, message: 'Failed to delete user' };
    return { message: 'User deleted successfully' };
  },
};

module.exports = AdminService;
