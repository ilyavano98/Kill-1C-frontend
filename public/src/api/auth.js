import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const API_BASE_URL = apiUrl + '/api/auth';

export const login = async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data;
};

export const register = async (username, password, name) => {
    const response = await axios.post(`${API_BASE_URL}/register`, { username, password, name });
    return response.data;
};

export const getCurrentUser = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};