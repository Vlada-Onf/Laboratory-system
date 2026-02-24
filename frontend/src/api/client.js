import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://laboratory-system.onrender.com',
});

let getToken = null;

export const setAuthToken = (tokenFn) => {
  getToken = tokenFn;
};

apiClient.interceptors.request.use(async (config) => {
  if (getToken) {
    try {
      const token = await getToken({ template: "default" });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('TOKEN з laboratory-api:', token.substring(0, 30) + '...');
        console.log('ЗАПИТ:', config.method?.toUpperCase(), config.url);
      }
    } catch (error) {
      console.error('TOKEN ERROR:', error);
    }
  }
  return config;
});


export default apiClient;
