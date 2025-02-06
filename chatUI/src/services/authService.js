import axios from 'axios';
import { chatService } from './chatService';


const API_URL = import.meta.env.VITE_BASE_URL + '/api/users' || 'http://localhost:3001/api/users'; // 后端API基础URL

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加token到请求头
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 用户注册
export const register = async (username, password, email) => {
  try {
    const response = await api.post('/register', {
      username,
      password,
      email
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 用户登录
export const login = async (username, password) => {
  try {
    // 先重置聊天状态
    chatService.resetChatState();
    
    const response = await api.post('/login', {
      username,
      password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 获取用户信息
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 更新用户信息
export const updateProfile = async (updateData) => {
  try {
    const response = await api.put('/profile', updateData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 退出登录
export const logout = () => {
  chatService.resetChatState();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// 获取当前用户
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// 检查是否已登录
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};