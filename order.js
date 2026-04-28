document.addEventListener('DOMContentLoaded', () => {
  const ordersGrid = document.getElementById('orders-grid');
  if (!ordersGrid) return;

  // Function to group orders by timestamp (orders placed together)
  function groupOrdersByTime(orders) {
    const groups = [];
    let currentGroup = [];
    let currentTime = null;

    // Sort by orderedAt descending (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));

    sortedOrders.forEach((order, index) => {
      const orderTime = new Date(order.orderedAt).getTime();

      // If this is first order or within 5 seconds of current group, add to group
      if (currentGroup.length === 0 || Math.abs(orderTime - currentTime) < 5000) {
        currentGroup.push({ ...order, originalIndex: orders.indexOf(order) });
        currentTime = orderTime;
      } else {
        // Start new group
        groups.push(currentGroup);
        currentGroup = [{ ...order, originalIndex: orders.indexOf(order) }];
        currentTime = orderTime;
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }

  // Function to render orders
  function renderOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
      ordersGrid.innerHTML = `
        <div class="no-orders-message" style="text-align:centre;">
          <p>No orders placed yet.</p>
          <a href="index.html" class="button button-primary">Shop Now</a>
        </div>
      `;
      return;
    }

    // Group orders by time (orders placed together)
    const orderGroups = groupOrdersByTime(orders);
    let ordersHTML = '';

    orderGroups.forEach((group, groupIndex) => {
      const isGroup = group.length > 1;
      const firstOrder = group[0];
      const shipping = firstOrder.shipping || {};
      const groupTotal = group.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

      ordersHTML += `
        <div class="order-container ${isGroup ? 'grouped-order' : 'individual-order'}" data-group-index="${groupIndex}">
          <div class="order-header">
            <div class="order-header-left-section">
              <span class="order-header-label">${isGroup ? '📦 Order Group' : 'Order placed'}</span>
              <span class="order-date">${new Date(firstOrder.orderedAt).toLocaleString()} ${isGroup ? `(${group.length} items)` : ''}</span>
            </div>
            <div class="order-header-right-section">
              <span class="order-header-label">Total</span>
              <span class="order-total">₹${groupTotal.toFixed(0)}</span>
            </div>
          </div>

          ${isGroup ? `
          <!-- Group Summary ONLY (no individual cards) -->
          <div class="group-summary" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid var(--accent-emerald);">
            <h4 style="margin: 0 0 10px 0; color: var(--primary-dark);">Order Summary</h4>
            ${group.map(item => `
              <div class="summary-item" style="display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #ddd;">
                <img src="${item.image}" style="width: 35px; height: 35px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1;">
                  <p style="margin: 0; font-size: 13px; font-weight: 600;">${item.team}</p>
                  <p style="margin: 0; font-size: 11px; color: #666;">Qty: ${item.quantity} • Size: ${item.size}</p>
                </div>
                <span style="font-weight: 600; font-size: 13px;">₹${((item.price || 0) * item.quantity).toFixed(0)}</span>
              </div>
            `).join('')}
          </div>
          ` : `
          <!-- Individual Item ONLY (for single orders) -->
          <div class="order-details-grid">
            ${group.map(item => {
              const itemTotal = (item.price || 0) * item.quantity;
              const itemShipping = item.shipping || {};
              return `
                <div class="product-card single-item">
                  <div class="product-image-container">
                    <img src="${item.image}" alt="${item.team}">
                  </div>

                  <div class="product-name">${item.team}</div>
                  <div class="product-quantity">
                    Qty: ${item.quantity} • Size: ${item.size}
                  </div>
                  <div class="product-delivery-date">
                    ${item.league} • ${item.season}
                  </div>
                  <div class="product-price" style="font-weight: 700; color: var(--accent-emerald); margin-top: 5px;">
                    ₹${itemTotal.toFixed(0)}
                  </div>

                  ${itemShipping.fullName ? `
                  <div class="shipping-info" style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 6px; font-size: 13px;">
                    <p style="margin: 2px 0;"><strong>Ship to:</strong> ${itemShipping.fullName}</p>
                    <p style="margin: 2px 0; color: #666;">${itemShipping.mobile}</p>
                    <p style="margin: 2px 0; color: #666;">${itemShipping.street}, ${itemShipping.city}</p>
                    <p style="margin: 2px 0; color: #666;">${itemShipping.state} - ${itemShipping.pincode}</p>
                  </div>
                  ` : ''}

                  <a href="invoice.html?item=${item.originalIndex}" class="invoice-button" style="margin-top: 10px; display: inline-block; width: auto; padding: 6px 12px; font-size: 13px;">🧾 Item Invoice</a>
                </div>
              `;
            }).join('')}
          </div>
          `}

          ${isGroup && shipping.fullName ? `
          <div class="shipping-info" style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 13px; border-left: 3px solid var(--accent-blue);">
            <p style="margin: 2px 0; font-weight: 600;"><strong>📍 Shipping Address</strong></p>
            <p style="margin: 4px 0;">${shipping.fullName}</p>
            <p style="margin: 2px 0; color: #666;">${shipping.mobile}</p>
            <p style="margin: 2px 0; color: #666;">${shipping.street}, ${shipping.city}</p>
            <p style="margin: 2px 0; color: #666;">${shipping.state} - ${shipping.pincode}</p>
            ${shipping.landmark ? `<p style="margin: 2px 0; color: #666;">Landmark: ${shipping.landmark}</p>` : ''}
          </div>
          ` : ''}

          <div class="order-actions" style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
            <a href="index.html" class="buy-again-button">Buy again</a>
            <a href="tracking.html?group=${groupIndex}" class="track-package-button">Track package</a>
            <a href="invoice.html?order=${firstOrder.id || 'BK' + Date.now()}" class="invoice-button">🧾 Invoice</a>
            ${group.map((item, idx) => `
              <button class="cancel-order-btn" data-index="${item.originalIndex}" style="${idx > 0 ? 'display: none;' : ''}">Cancel Order</button>
            `).join('')}
          </div>
        </div>
      `;
    });

    ordersGrid.innerHTML = ordersHTML;
  }

  renderOrders();

  // Event delegation for Cancel Order buttons
  ordersGrid.addEventListener('click', (e) => {
    if (!e.target.classList.contains('cancel-order-btn')) return;

    // Show confirmation popup
    const confirmed = confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;

    const index = Number(e.target.dataset.index);
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Remove the order at the clicked index
    orders.splice(index, 1);

    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(orders));

    // Re-render orders
    renderOrders();

    // Show success message
    alert('Order has been cancelled successfully!');
  });

  // Track order group
  window.trackOrderGroup = function(groupIndex) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderGroups = groupOrdersByTime(orders);
    const group = orderGroups[groupIndex];

    if (group && group.length > 0) {
      const firstOrder = group[0];
      const groupTotal = group.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

      const activeOrder = {
        id: "BK" + Date.now(),
        total: groupTotal,
        status: "Shipped",
        progress: 3,
        shipping: firstOrder.shipping || {},
        products: group.map(item => ({
          name: item.team,
          size: item.size,
          player: "Custom",
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        orderedAt: firstOrder.orderedAt
      };

      localStorage.setItem("activeOrder", JSON.stringify(activeOrder));
      window.location.href = "tracking.html";
    }
  };
});
function trackOrder(order) {
  localStorage.setItem("activeOrder", JSON.stringify(order));
  window.location.href = "tracking.html";
}
