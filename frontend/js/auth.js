import { authApi, setSession, clearSession, getUser } from '../api/client.js';
import { showMessage, setButtonLoading } from '../utils/ui.js';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutButton = document.getElementById('logout-button');
const currentUser = document.getElementById('current-user');
const next = new URLSearchParams(window.location.search).get('next') || 'index.html';

const user = getUser();
if (currentUser) currentUser.textContent = user ? `Signed in as ${user.name}` : 'Not signed in';

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector('button');
  setButtonLoading(button, true, 'Signing in...');
  try {
    const result = await authApi.login(Object.fromEntries(new FormData(loginForm)));
    setSession(result);
    showMessage('Login successful');
    window.location.href = next;
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonLoading(button, false);
  }
});

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = registerForm.querySelector('button');
  setButtonLoading(button, true, 'Creating account...');
  try {
    const result = await authApi.register(Object.fromEntries(new FormData(registerForm)));
    setSession(result);
    showMessage('Account created');
    window.location.href = next;
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonLoading(button, false);
  }
});

logoutButton?.addEventListener('click', () => {
  clearSession();
  showMessage('Logged out');
  window.location.reload();
});
