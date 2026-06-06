import api from './api';

const ownerService = {
  getDashboard: () => api.get('/owner/dashboard'),
};

export default ownerService;
