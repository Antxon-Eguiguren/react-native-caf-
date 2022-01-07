import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://192.168.1.40:8080/api';

const api = axios.create({baseURL});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');

  // TODO: check what happens if token expires --> user will not be able to create products

  if (token) {
    config.headers!['x-token'] = token;
  }

  return config;
});

export default api;
