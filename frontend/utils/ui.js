export function showMessage(message, type = 'success') {
  let popup = document.getElementById('cart-popup') || document.getElementById('empty-cart-popup') || document.getElementById('error-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'cart-popup';
    popup.className = 'cart-popup';
    document.body.appendChild(popup);
  }
  popup.textContent = message;
  popup.style.backgroundColor = type === 'error' ? '#e74c3c' : '#2ecc71';
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 2500);
}

export function money(value) {
  return `₹${Number(value || 0).toFixed(0)}`;
}

export function setButtonLoading(button, isLoading, label = 'Loading...') {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = label;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
}
