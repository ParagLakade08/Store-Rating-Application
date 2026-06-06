import api from './api';

const adminService = {
  getDashboard: ()       => api.get('/admin/dashboard'),
  getUsers:     (params) => api.get('/admin/users',  { params }),
  getStores:    (params) => api.get('/admin/stores', { params }),
  addUser:      (data)   => api.post('/admin/users',  data),
  addStore:     (data)   => api.post('/admin/stores', data),
  deleteUser:   (id)     => api.delete(`/admin/users/${id}`),
};

export default adminService;
