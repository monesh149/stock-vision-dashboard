import api from './api';

export const getMarketOverview = async () => {
  const response = await api.get('/market/overview');
  return response.data;
};
