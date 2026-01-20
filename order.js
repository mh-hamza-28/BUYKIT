document.addEventListener('DOMContentLoaded', () => {
  const ordersGrid = document.getElementById('orders-grid');
  if (!ordersGrid) return;

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

    let ordersHTML = '';

    orders.forEach((item, index) => {
      ordersHTML += `
        <div class="order-container" data-index="${index}">
          <div class="order-header">
            <div class="order-header-left-section">
              <span class="order-header-label">Order placed</span>
              <span class="order-date">${new Date(item.orderedAt).toLocaleString()}</span>
            </div>
            <div class="order-header-right-section">
              <span class="order-header-label">Total</span>
              <span class="order-total">$${((item.price / 100) * item.quantity).toFixed(2)}</span>
            </div>
          </div>

          <div class="order-details-grid">
            <div class="product-card">
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

              <a href="index.html" class="buy-again-button">Buy again</a>
             <a href="tracking.html?order=${index}" class="track-package-button">Track package</a>


              <!-- Cancel Order Button -->
              <button class="cancel-order-btn" data-index="${index}">Cancel Order</button>
            </div>
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

    const index = Number(e.target.dataset.index);
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Remove the order at the clicked index
    orders.splice(index, 1);

    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(orders));

    // Re-render orders
    renderOrders();
  });
});
function trackOrder(order) {
  localStorage.setItem("activeOrder", JSON.stringify(order));
  window.location.href = "tracking.html";
}
