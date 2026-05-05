import { cartApi, orderApi, paymentApi, requireAuth } from './frontend/api/client.js';
import { showMessage, money, setButtonLoading } from './frontend/utils/ui.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  let latestCart = null;
  const checkoutItems = document.querySelector('.checkout-items');
  const orderSummary = document.querySelector('.order-summary');

  function getShippingDetails() {
    const saved = localStorage.getItem('shippingDetails');
    return saved ? JSON.parse(saved) : null;
  }

  function renderShipping(details) {
    if (!details) {
      return `
        <div class="shipping-details-section">
          <h3>Shipping Address</h3>
          <p style="color:#666;font-size:14px;">No shipping address added yet.</p>
          <a href="shipping-form.html" class="add-shipping-btn">+ Add Shipping Details</a>
        </div>`;
    }
    return `
      <div class="shipping-details-section">
        <h3>Shipping Address</h3>
        <div class="shipping-info-display">
          <p><strong>${details.fullName}</strong></p>
          <p>${details.mobile}</p>
          <p>${details.street}</p>
          <p>${details.city}, ${details.state} - ${details.pincode}</p>
          ${details.landmark ? `<p>Landmark: ${details.landmark}</p>` : ''}
          <a href="shipping-form.html" class="edit-shipping-btn">Edit Address</a>
        </div>
      </div>`;
  }

  function renderCart(cart) {
    latestCart = cart;
    document.querySelectorAll('.jscartqtty').forEach((el) => (el.innerText = cart.summary.itemCount));

    if (!cart.items.length) {
      checkoutItems.innerHTML = '<p style="text-align:center;padding:40px;">Your cart is empty</p>';
      orderSummary.innerHTML = renderShipping(getShippingDetails());
      return;
    }

    checkoutItems.innerHTML = `
      <div class="checkout-card group-order-card" style="background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);border-left:4px solid var(--accent-emerald);">
        <h3 style="margin:0 0 15px 0;color:var(--primary-dark);">Order Summary (${cart.items.length} items)</h3>
        ${cart.items.map((item) => `
          <div class="group-item" style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #eee;">
            <img src="${item.image}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;" alt="${item.name}">
            <div style="flex:1;">
              <p style="margin:0;font-size:13px;font-weight:600;">${item.name}</p>
              <p style="margin:0;font-size:12px;color:#666;">Qty: ${item.quantity} • Size: ${item.size}</p>
            </div>
            <span style="font-weight:600;">${money(item.lineTotal)}</span>
          </div>`).join('')}
      </div>
      <hr style="margin:25px 0;border:none;border-top:2px dashed #ddd;">
      <h3 style="color:var(--primary-dark);margin-bottom:15px;">Individual Items</h3>
      ${cart.items.map((item) => `
        <div class="checkout-card individual-card" style="border-left:3px solid var(--accent-blue);">
          <div class="item-grid">
            <img src="${item.image}" class="product-image" alt="${item.name}">
            <div class="item-info">
              <p class="product-name"><u>${item.name}</u></p>
              <p><strong>Qty:</strong> <span class="item-quantity">${item.quantity}</span></p>
              <p><strong>Total:</strong> ${money(item.lineTotal)}</p>
              <p><strong>Unit Price:</strong> ${money(item.unitPrice)}</p>
              <p><strong>Season:</strong> ${item.season}</p>
              <p><strong>League:</strong> ${item.league}</p>
              <p><strong>Size:</strong> ${item.size}</p>
            </div>
          </div>
          <div class="card-buttons">
            <button class="btn-add" data-product-id="${item.productId}" data-size="${item.size}" data-quantity="${item.quantity + 1}">+ Add</button>
            <button class="btn-remove" data-product-id="${item.productId}" data-size="${item.size}" data-quantity="${item.quantity - 1}">- Remove</button>
          </div>
        </div>`).join('')}`;

    orderSummary.innerHTML = `
      ${renderShipping(getShippingDetails())}
      <div class="checkout-card summary-card">
        <h2 class="summary-title">Order Summary</h2>
        <div class="summary-row"><span>Items (${cart.summary.itemCount})</span><span>${money(cart.summary.itemsTotal)}</span></div>
        <div class="summary-row"><span>Delivery</span><span>${cart.summary.deliveryFee === 0 ? 'FREE' : money(cart.summary.deliveryFee)}</span></div>
        <div class="summary-row total"><span>Order Total</span><span>${money(cart.summary.orderTotal)}</span></div>
        <button class="place-order-btn" data-payment="cod">Place order</button>
        <button class="place-order-btn" data-payment="stripe" style="margin-top:10px;">Pay with Stripe</button>
        <p class="secure-note">Safe & Secure Payments</p>
      </div>`;
  }

  async function loadCart() {
    try {
      renderCart(await cartApi.get());
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }

  document.body.addEventListener('click', async (event) => {
    if (event.target.classList.contains('btn-add') || event.target.classList.contains('btn-remove')) {
      const button = event.target;
      const quantity = Number(button.dataset.quantity);
      setButtonLoading(button, true);
      try {
        const cart = quantity < 1
          ? await cartApi.remove(button.dataset.productId, button.dataset.size)
          : await cartApi.update(button.dataset.productId, { size: button.dataset.size, quantity });
        renderCart(cart);
      } catch (error) {
        showMessage(error.message, 'error');
      } finally {
        setButtonLoading(button, false);
      }
    }

    if (event.target.classList.contains('place-order-btn')) {
      if (!latestCart?.items.length) return showMessage('Your cart is empty', 'error');
      const shippingDetails = getShippingDetails();
      if (!shippingDetails) {
        window.location.href = 'shipping-form.html?from=checkout';
        return;
      }

      const button = event.target;
      setButtonLoading(button, true, button.dataset.payment === 'stripe' ? 'Preparing payment...' : 'Placing order...');
      try {
        if (button.dataset.payment === 'stripe') {
          const payment = await paymentApi.createCheckoutIntent({ shippingAddress: shippingDetails });
          localStorage.setItem('lastPaymentIntent', JSON.stringify(payment));
          showMessage('Stripe payment intent created. Add Stripe.js confirmation next.');
        } else {
          await orderApi.create({ shippingAddress: shippingDetails });
          localStorage.removeItem('shippingDetails');
          window.location.href = 'orders.html';
        }
      } catch (error) {
        showMessage(error.message, 'error');
      } finally {
        setButtonLoading(button, false);
      }
    }
  });

  loadCart();
});
