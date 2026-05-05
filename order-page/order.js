import { orderApi, requireAuth } from './frontend/api/client.js';
import { showMessage, money, setButtonLoading } from './frontend/utils/ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const ordersGrid = document.getElementById('orders-grid');
  if (!ordersGrid) return;
  if (!requireAuth()) return;

  async function renderOrders() {
    ordersGrid.innerHTML = '<p style="text-align:center;padding:40px;">Loading orders...</p>';
    try {
      const { orders } = await orderApi.list();
      if (!orders.length) {
        ordersGrid.innerHTML = `
          <div class="no-orders-message" style="text-align:center;">
            <p>No orders placed yet.</p>
            <a href="index.html" class="button button-primary">Shop Now</a>
          </div>`;
        return;
      }

      ordersGrid.innerHTML = orders.map((order) => `
        <div class="order-container" data-order-id="${order._id}">
          <div class="order-header">
            <div class="order-header-left-section">
              <span class="order-header-label">Order placed</span>
              <span class="order-date">${new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div class="order-header-right-section">
              <span class="order-header-label">Total</span>
              <span class="order-total">${money(order.orderTotal)}</span>
            </div>
          </div>

          <div class="group-summary" style="background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);padding:15px;border-radius:8px;margin-bottom:15px;border-left:4px solid var(--accent-emerald);">
            <h4 style="margin:0 0 10px 0;color:var(--primary-dark);">Status: ${order.status}</h4>
            ${order.items.map((item) => `
              <div class="summary-item" style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #ddd;">
                <img src="${item.image}" style="width:35px;height:35px;object-fit:cover;border-radius:4px;" alt="${item.name}">
                <div style="flex:1;">
                  <p style="margin:0;font-size:13px;font-weight:600;">${item.name}</p>
                  <p style="margin:0;font-size:11px;color:#666;">Qty: ${item.quantity} • Size: ${item.size}</p>
                </div>
                <span style="font-weight:600;font-size:13px;">${money(item.lineTotal)}</span>
              </div>`).join('')}
          </div>

          ${order.shippingAddress?.fullName ? `
            <div class="shipping-info" style="margin-top:15px;padding:15px;background:#f8f9fa;border-radius:8px;font-size:13px;border-left:3px solid var(--accent-blue);">
              <p style="margin:2px 0;font-weight:600;"><strong>Shipping Address</strong></p>
              <p style="margin:4px 0;">${order.shippingAddress.fullName}</p>
              <p style="margin:2px 0;color:#666;">${order.shippingAddress.mobile}</p>
              <p style="margin:2px 0;color:#666;">${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
              <p style="margin:2px 0;color:#666;">${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
            </div>` : ''}

          <div class="order-actions" style="display:flex;gap:10px;margin-top:15px;flex-wrap:wrap;">
            <a href="index.html" class="buy-again-button">Buy again</a>
            <a href="tracking.html?order=${order._id}" class="track-package-button">Track package</a>
            <a href="invoice.html?order=${order._id}" class="invoice-button">Invoice</a>
            ${['processing', 'paid', 'pending_payment'].includes(order.status) ? `<button class="cancel-order-btn" data-order-id="${order._id}">Cancel Order</button>` : ''}
          </div>
        </div>`).join('');
    } catch (error) {
      ordersGrid.innerHTML = `<p style="text-align:center;padding:40px;">${error.message}</p>`;
    }
  }

  ordersGrid.addEventListener('click', async (event) => {
    if (!event.target.classList.contains('cancel-order-btn')) return;
    if (!confirm('Are you sure you want to cancel this order?')) return;
    const button = event.target;
    setButtonLoading(button, true, 'Cancelling...');
    try {
      await orderApi.cancel(button.dataset.orderId);
      showMessage('Order cancelled');
      renderOrders();
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setButtonLoading(button, false);
    }
  });

  renderOrders();
});
