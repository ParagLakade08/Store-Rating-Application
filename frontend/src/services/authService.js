import api from './api';

const authService = {
  login:          (data)    => api.post('/auth/login', data),
  register:       (data)    => api.post('/auth/register', data),
  me:             ()        => api.get('/auth/me'),
  changePassword: (data)    => api.patch('/auth/change-password', data),
};

export default authService;
