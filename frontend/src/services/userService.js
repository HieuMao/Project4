import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const sendContactMessage = async (data) => {
  const response = await axios.post(`${API_URL}/contact`, data);
  return response.data;
};