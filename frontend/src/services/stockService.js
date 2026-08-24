import api from './api';

export const getStock = async (symbol) => {
  const response = await api.get(`/stocks/${symbol}`);
  return response.data;
};

export const getStockHistory = async (symbol, period = '1M') => {
  const response = await api.get(`/stocks/${symbol}/history`, { params: { period } });
  return response.data;
};

export const searchStocks = async (query) => {
  const response = await api.get(`/stocks/search/${query}`);
  return response.data;
};
