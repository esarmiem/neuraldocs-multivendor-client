import axios from 'axios';
import { ChatRequest, ChatResponse, TokenResponse, AuthRequest, DocumentStats, Document } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autorización
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: AuthRequest): Promise<TokenResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await axios.post(`${API_BASE_URL}/auth/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};

export const chatAPI = {
  sendMessage: async (message: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post('/chat', message);
    return response.data;
  },
};

export const documentsAPI = {
  getStats: async (): Promise<DocumentStats> => {
    const response = await api.get('/documents/database/stats');
    return response.data;
  },
  
  getDocuments: async (): Promise<Document[]> => {
    const response = await api.get('/documents/list');
    return response.data;
  },
  
  uploadDocument: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    
    await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  clearDatabase: async (): Promise<void> => {
    await api.delete('/documents/database/clear');
  },
};

export default api; 