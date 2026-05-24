import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

export const getConversations = () => api.get('/conversations');
export const getConversation  = (id) => api.get(`/conversation/${id}`);
export const deleteConversation = (id) => api.delete(`/conversation/${id}`);
export const sendMessage = (data) => api.post('/chat', data);
export const getMetrics = () => api.get('/metrics');
export const getLogs = (limit = 50, conversationId = '') => api.get(`/logs?limit=${limit}&conversationId=${conversationId}`);
export default api;
