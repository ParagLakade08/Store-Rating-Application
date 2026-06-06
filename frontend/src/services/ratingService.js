import api from './api';

const ratingService = {
  submitOrUpdate: (data) => api.post('/stores/ratings', data),
};

export default ratingService;
