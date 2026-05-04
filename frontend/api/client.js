const API_BASE_URL = localStorage.getItem('buykitApiUrl') || `${window.location.origin}/api`;
const TOKEN_KEY = 'buykitToken';
const USER_KEY = 'buykitUser';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function setSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function requireAuth() {
  if (!getToken()) {
    window.location.href = `auth.html?next=${encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html')}`;
    return false;
  }
  return true;
}

export async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data.data || data;
}

export const authApi = {
  register: (payload) => apiFetch('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiFetch('/auth/login', { method: 'POST', body: payload }),
  me: () => apiFetch('/auth/me')
};

export const productApi = {
  list: (params = {}) => apiFetch(`/products?${new URLSearchParams(params).toString()}`)
};

export const cartApi = {
  get: () => apiFetch('/cart'),
  add: (payload) => apiFetch('/cart/items', { method: 'POST', body: payload }),
  update: (productId, payload) => apiFetch(`/cart/items/${productId}`, { method: 'PATCH', body: payload }),
  remove: (productId, size) => apiFetch(`/cart/items/${productId}?${new URLSearchParams({ size })}`, { method: 'DELETE' })
};

export const orderApi = {
  create: (payload) => apiFetch('/orders', { method: 'POST', body: payload }),
  list: () => apiFetch('/orders'),
  get: (orderId) => apiFetch(`/orders/${orderId}`),
  cancel: (orderId) => apiFetch(`/orders/${orderId}/cancel`, { method: 'PATCH' })
};

export const paymentApi = {
  createCheckoutIntent: (payload) => apiFetch('/payments/checkout-intent', { method: 'POST', body: payload })
};

export const contactApi = {
  send: (payload) => apiFetch('/contact', { method: 'POST', body: payload })
};
