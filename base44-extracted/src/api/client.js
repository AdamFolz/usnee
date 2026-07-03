import { API_BASE_URL } from '@/lib/constants';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

function getInitData() {
  return localStorage.getItem('tg_init_data') || '';
}

async function request(endpoint, options) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': getInitData(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message;
    try {
      const error = await response.json();
      if (Array.isArray(error.detail)) {
        message = error.detail.map((e) => e.msg).join(', ');
      } else {
        message = error.detail || error.message || 'Ошибка запроса';
      }
    } catch {
      message = 'Ошибка запроса';
    }

    if (response.status === 401 || response.status === 503) {
      window.dispatchEvent(
        new CustomEvent('api-error', {
          detail: { status: response.status, message },
        })
      );
    }

    throw new ApiError(response.status, message);
  }

  return response.json();
}

export const api = {
  createInjection: (data) =>
    request('/api/inject', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStats: () => request('/api/stats'),

  getHistory: (cursor, limit = 50) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    return request(`/api/history?${params.toString()}`);
  },

  cancelInjection: (id, reason) =>
    request(`/api/inject/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(reason ? { reason } : {}),
    }),

  updateInjection: (id, data) =>
    request(`/api/inject/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};