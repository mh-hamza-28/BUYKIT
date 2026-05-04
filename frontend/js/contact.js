import { contactApi } from '../api/client.js';
import { showMessage, setButtonLoading } from '../utils/ui.js';

const form = document.querySelector('.contact-form');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  setButtonLoading(button, true, 'Sending...');

  try {
    await contactApi.send(Object.fromEntries(new FormData(form)));
    form.reset();
    showMessage('Message sent successfully');
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonLoading(button, false);
  }
});
