import api from './api';

export const getAnalysis = async (symbol) => {
  const response = await api.get(`/analysis/${symbol}`);
  return response.data;
};

export const getIndicators = async (symbol) => {
  const response = await api.get(`/analysis/${symbol}/indicators`);
  return response.data;
};

export const getSignal = async (symbol) => {
  const response = await api.get(`/analysis/${symbol}/signal`);
  return response.data;
};

export const compareStocks = async (symbols) => {
  const response = await api.post('/compare', { symbols });
  return response.data;
};
