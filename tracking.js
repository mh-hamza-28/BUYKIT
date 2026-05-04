import { orderApi, requireAuth } from './frontend/api/client.js';
import { money } from './frontend/utils/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const orderId = new URLSearchParams(window.location.search).get('order');
  if (!orderId) {
    window.location.href = 'orders.html';
    return;
  }

  const productsContainer = document.querySelector('.products-container');
  const orderSummary = document.querySelector('.order-summary');

  try {
    const { order } = await orderApi.get(orderId);
    document.querySelector('.delivery-date').textContent = `Expected: ${new Date(Date.now() + 7 * 86400000).toDateString()}`;
    document.querySelector('.order-id').textContent = `${order._id} | ${order.status}`;

    productsContainer.innerHTML = `
      <div class="group-summary-card" style="background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);padding:20px;border-radius:12px;margin-bottom:25px;border-left:5px solid var(--accent-emerald);">
        <h3 style="margin:0 0 15px 0;color:var(--primary-dark);">Order (${order.items.length} items)</h3>
        ${order.items.map((item) => `
          <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #ddd;">
            <img src="${item.image}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;" alt="${item.name}">
            <div style="flex:1;">
              <p style="margin:0;font-size:14px;font-weight:700;">${item.name}</p>
              <p style="margin:0;font-size:12px;color:#666;">Size: ${item.size} • Qty: ${item.quantity}</p>
            </div>
            <span style="font-weight:700;font-size:14px;">${money(item.lineTotal)}</span>
          </div>`).join('')}
      </div>
      <div class="shipping-info-section" style="background:#f8f9fa;padding:20px;border-radius:12px;margin-top:20px;border-left:4px solid var(--accent-emerald);">
        <h4 style="margin:0 0 15px 0;color:var(--primary-dark);">Shipping Details</h4>
        <p style="margin:5px 0;font-size:15px;"><strong>${order.shippingAddress?.fullName || 'N/A'}</strong></p>
        <p style="margin:5px 0;font-size:14px;color:#555;">${order.shippingAddress?.mobile || 'N/A'}</p>
        <p style="margin:5px 0;font-size:14px;color:#555;">${order.shippingAddress?.street || 'N/A'}</p>
        <p style="margin:5px 0;font-size:14px;color:#555;">${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'} - ${order.shippingAddress?.pincode || 'N/A'}</p>
        <p style="margin:12px 0 0;font-size:14px;"><strong>Tracking:</strong> ${order.trackingNumber || 'Tracking number will appear after shipment'}</p>
      </div>`;

    orderSummary.innerHTML = `
      <h4>Order Summary</h4>
      <div class="summary-row"><span>Subtotal</span><span>${money(order.itemsTotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span class="free-shipping">${order.deliveryFee === 0 ? 'FREE' : money(order.deliveryFee)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${money(order.orderTotal)}</span></div>`;
  } catch (error) {
    productsContainer.innerHTML = `<p style="text-align:center;padding:40px;">${error.message}</p>`;
  }
});
