import api from '../config/apiConfig';

export const sendTextMessage = async (message) => {
  const res = await api.post('/chat/text/', { message });
  return res.data;
};

export const sendVoiceQuery = async (queryText, language = 'en') => {
  const res = await api.post('/chat/voice/', { query_text: queryText, language });
  return res.data;
};

export const analyzeMedicalImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/chat/medical-image/analyze/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
