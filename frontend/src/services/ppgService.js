import api from '../config/apiConfig';

export const estimatePpgHeartRate = async (redSignals, fps = 30.0) => {
  const res = await api.post('/ppg/estimate/', { red_signals: redSignals, fps });
  return res.data;
};
