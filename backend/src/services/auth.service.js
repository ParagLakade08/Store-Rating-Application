const bcrypt    = require('bcryptjs');
const User      = require('../models/User');
const { signToken } = require('../utils/jwt');

const AuthService = {
  register: async ({ name, email, password, address }) => {
    const exists = await User.findByEmail(email);
    if (exists) throw { status: 409, message: 'Email is already registered' };

    const hashed = await bcrypt.hash(password, 10);
    const id     = await User.create({ name, email, password: hashed, address, role: 'USER' });
    return User.findById(id);
  },

  login: async ({ email, password }) => {
    console.log('[Auth] login attempt', { email });
    const user = await User.findByEmail(email);
    if (!user) {
      console.warn('[Auth] user not found for', email);
      throw { status: 401, message: 'Invalid credentials' };
    }

    console.log('[Auth] user found id=', user.id);
    const match = await bcrypt.compare(password, user.password);
    if (!match)  {
      console.warn('[Auth] password mismatch for', email);
      throw { status: 401, message: 'Invalid credentials' };
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const { password: _, ...safe } = user;
    return { token, user: safe };
  },

  changePassword: async (id, currentPassword, newPassword) => {
    const user  = await User.findByEmail((await User.findById(id)).email);
    const fullUser = await require('../config/db').query('SELECT password FROM users WHERE id = ?', [id]);
    const stored   = fullUser[0][0]?.password;
    if (!stored) throw { status: 404, message: 'User not found' };

    const match = await bcrypt.compare(currentPassword, stored);
    if (!match)  throw { status: 400, message: 'Current password is incorrect' };

    if (currentPassword === newPassword) throw { status: 400, message: 'New password must be different' };

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(id, hashed);
  },
};

module.exports = AuthService;
