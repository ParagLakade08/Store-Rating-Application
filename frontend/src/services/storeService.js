import api from './api';

const storeService = {
  getStores: (params) => api.get('/stores', { params }),
};

export default storeService;
