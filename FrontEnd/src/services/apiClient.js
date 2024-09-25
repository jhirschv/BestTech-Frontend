import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://besttech-backend-6154a0cdbf1c.herokuapp.com/',
});

apiClient.interceptors.request.use(config => {
  const rawTokens = localStorage.getItem('authTokens');
  if (rawTokens) {
    const { access_token } = JSON.parse(rawTokens);
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;