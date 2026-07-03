import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  InjectionCreate,
  InjectionResponse,
  HistoryResponse,
  UserStats,
  User,
} from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    this.client.interceptors.request.use((config) => {
      const initData = window.Telegram?.WebApp?.initData;
      if (initData) {
        config.headers['X-Telegram-Init-Data'] = initData;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 429) {
          const data = error.response.data as { message?: string; minutes_remaining?: number };
          console.warn('Rate limit:', data.message);
        }
        if (error.response?.status === 401) {
          console.error('Authentication failed');
        }
        return Promise.reject(error);
      }
    );
  }

  async getUser(): Promise<User> {
    const { data } = await this.client.get('/me');
    return data;
  }

  async getStats(): Promise<UserStats> {
    const { data } = await this.client.get('/stats');
    return data;
  }

  async createInjection(payload: InjectionCreate): Promise<InjectionResponse> {
    const { data } = await this.client.post('/inject', payload);
    return data;
  }

  async getHistory(cursor?: string, limit = 50): Promise<HistoryResponse> {
    const { data } = await this.client.get('/history', {
      params: { cursor, limit },
    });
    return data;
  }

  async cancelInjection(id: number, reason?: string): Promise<void> {
    await this.client.post(`/injections/${id}/cancel`, { reason });
  }
}

export const api = new ApiClient();
