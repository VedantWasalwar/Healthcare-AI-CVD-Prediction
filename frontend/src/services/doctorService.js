import api from '../config/apiConfig';

export const getRecommendedDoctors = async (riskLevel = '', specialty = '') => {
  const params = {};
  if (riskLevel) params.risk_level = riskLevel;
  if (specialty) params.specialty = specialty;
  const res = await api.get('/doctors/', { params });
  return res.data;
};
