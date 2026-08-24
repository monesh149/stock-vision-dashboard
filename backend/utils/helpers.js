const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

const formatPercent = (value) => {
  return parseFloat(value).toFixed(2) + '%';
};

const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

module.exports = { formatPrice, formatPercent, formatDate };
