import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_DOMAIN_API,
  timeout: 30000
});

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

export async function apiPost(route, data) {
  try {
    return await api.post(route, data, {
      headers
    });
  } catch (error) {
    throw error;
  }
}
