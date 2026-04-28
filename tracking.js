document.addEventListener("DOMContentLoaded", () => {

  // Function to get group index from URL
  function getGroupIndexFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const groupIndex = urlParams.get('group');
    return groupIndex ? parseInt(groupIndex) : null;
  }

  // Function to group orders by time (same as order.js)
  function groupOrdersByTime(orders) {
    const groups = [];
    let currentGroup = [];
    let currentTime = null;

    const sortedOrders = [...orders].sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));

    sortedOrders.forEach((order) => {
      const orderTime = new Date(order.orderedAt).getTime();

      if (currentGroup.length === 0 || Math.abs(orderTime - currentTime) < 5000) {
        currentGroup.push(order);
        currentTime = orderTime;
      } else {
        groups.push(currentGroup);
        currentGroup = [order];
        currentTime = orderTime;
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }

  let order;
  const groupIndex = getGroupIndexFromURL();

  if (groupIndex !== null) {
    // Get specific order group from orders list
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderGroups = groupOrdersByTime(orders);

    if (orderGroups[groupIndex]) {
      const group = orderGroups[groupIndex];
      const firstOrder = group[0];
      const groupTotal = group.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

      order = {
        id: "BK" + new Date(firstOrder.orderedAt).getTime(),
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
    } else {
      alert("Order not found!");
      window.location.href = "orders.html";
      return;
    }
  } else {
    // Fallback to activeOrder from localStorage
    order = JSON.parse(localStorage.getItem("activeOrder"));

    if (!order) {
      alert("No order selected!");
      window.location.href = "orders.html";
      return;
    }
  }

  /* =========================
     RENDER GROUPED ORDER SUMMARY
     ========================= */

  const isGroup = order.products.length > 1;
  const productsContainer = document.querySelector(".products-container");
  productsContainer.innerHTML = "";

  let subtotal = 0;

  // Calculate subtotal
  order.products.forEach(product => {
    subtotal += product.price * product.quantity;
  });

  // Show grouped summary if multiple items
  if (isGroup) {
    const summaryCard = document.createElement("div");
    summaryCard.className = "group-summary-card";
    summaryCard.style.cssText = "background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid var(--accent-emerald);";

    let groupItemsHTML = '';
    order.products.forEach(product => {
      const itemTotal = product.price * product.quantity;
      groupItemsHTML += `
        <div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #ddd;">
          <img src="${product.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
          <div style="flex: 1;">
            <p style="margin: 0; font-size: 14px; font-weight: 700;">${product.name}</p>
            <p style="margin: 0; font-size: 12px; color: #666;">Size: ${product.size} • Qty: ${product.quantity}</p>
          </div>
          <span style="font-weight: 700; font-size: 14px;">₹${itemTotal.toFixed(0)}</span>
        </div>
      `;
    });

    summaryCard.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: var(--primary-dark);">📦 Order Group (${order.products.length} items)</h3>
      <div class="grouped-items">${groupItemsHTML}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 2px solid var(--accent-emerald);">
        <span style="font-size: 16px; font-weight: 700;">Group Total:</span>
        <span style="font-size: 20px; font-weight: 800; color: var(--accent-emerald);">₹${subtotal.toFixed(0)}</span>
      </div>
    `;
    productsContainer.appendChild(summaryCard);
  } else {
    /* =========================
       RENDER INDIVIDUAL PRODUCT ONLY
       ========================= */
    const product = order.products[0];
    const productTotal = product.price * product.quantity;

    const card = document.createElement("div");
    card.className = "product-card individual-item";
    card.style.cssText = "flex-direction: column; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-left: 4px solid var(--accent-emerald); padding: 25px;";

    card.innerHTML = `
      <div class="product-header" style="width: 100%; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid var(--light-gray);">
        <div class="delivery-date" style="font-size: 24px; font-weight: 700; color: var(--primary-dark); margin-bottom: 10px;">
          Expected: ${new Date(Date.now() + 7 * 86400000).toDateString()}
        </div>
        <div class="order-id" style="font-size: 14px; color: var(--dark-gray); font-weight: 600; background: var(--light-gray); padding: 10px 16px; border-radius: 8px; display: inline-block;">
          ${order.id} | ${order.status}
        </div>
      </div>

      <div style="display: flex; gap: 25px; width: 100%; align-items: flex-start;">
        <img src="${product.image}" class="product-image" style="width: 160px; height: 160px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); margin-right: 0;">
        <div class="product-details" style="flex: 1; padding-top: 5px;">
          <div class="product-name" style="font-size: 22px; font-weight: 700; color: var(--primary-dark); margin-bottom: 15px; font-family: 'Montserrat', Arial, sans-serif; line-height: 1.3;">${product.name}</div>
          <div class="product-specs" style="margin-bottom: 18px;">
            <p style="margin: 8px 0; font-size: 15px; color: var(--text-dark);"><strong>Size:</strong> ${product.size}</p>
            <p style="margin: 8px 0; font-size: 15px; color: var(--text-dark);"><strong>Quantity:</strong> ${product.quantity}</p>
            <p style="margin: 8px 0; font-size: 15px; color: var(--text-dark);"><strong>Player:</strong> Custom</p>
          </div>
          <div class="product-price" style="font-size: 26px; color: var(--accent-emerald); font-weight: 800; margin-top: 10px;">
            ₹${productTotal.toFixed(0)}
          </div>
        </div>
      </div>
    `;

    productsContainer.appendChild(card);
  }

  // Shipping Info Section (shown once for group, or with each individual)
  const shippingSection = document.createElement("div");
  shippingSection.className = "shipping-info-section";
  shippingSection.style.cssText = "background: #f8f9fa; padding: 20px; border-radius: 12px; margin-top: 20px; border-left: 4px solid var(--accent-emerald);";
  shippingSection.innerHTML = `
    <h4 style="margin: 0 0 15px 0; color: var(--primary-dark);">📍 Shipping Details</h4>
    ${order.shipping ? `
      <p style="margin: 5px 0; font-size: 15px;"><strong>${order.shipping.fullName || 'N/A'}</strong></p>
      <p style="margin: 5px 0; font-size: 14px; color: #555;">${order.shipping.mobile || 'N/A'}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #555;">${order.shipping.street || 'N/A'}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #555;">${order.shipping.city || 'N/A'}, ${order.shipping.state || 'N/A'} - ${order.shipping.pincode || 'N/A'}</p>
      ${order.shipping.landmark ? `<p style="margin: 5px 0; font-size: 14px; color: #555;">Landmark: ${order.shipping.landmark}</p>` : ''}
    ` : '<p>No shipping details available</p>'}
    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
      <a href="tracking-detail.html" style="color: #e74c3c; font-weight: 700; text-decoration: none; padding: 10px 20px; background: #fff0f0; border-radius: 6px; display: inline-block; transition: all 0.3s;">📦 Track your shipment</a>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Estimated Delivery:</strong> ${new Date(Date.now() + 4 * 86400000).toDateString()}</p>
    </div>
  `;
  productsContainer.appendChild(shippingSection);
  

  /* =========================
     ORDER SUMMARY CALCULATION
     ========================= */

  const shipping = subtotal > 1500 ? 0 : 80; // ₹80 delivery for orders under ₹1500
  const total = subtotal + shipping;

  // Update invoice link - pass group index to identify the correct order
  const invoiceLink = document.querySelector('a[href="invoice.html"]');
  if (invoiceLink) {
    if (groupIndex !== null) {
      // For grouped orders, pass group index
      invoiceLink.href = `invoice.html?group=${groupIndex}`;
    } else if (order && order.id) {
      // For single orders, pass order ID
      invoiceLink.href = `invoice.html?order=${order.id}`;
    }
  }

  document.querySelector(".order-summary").innerHTML = `
    <h4>Order Summary</h4>

    <div class="summary-row">
      <span>Subtotal (${order.products.length} items)</span>
      <span>₹${subtotal.toFixed(0)}</span>
    </div>

    <div class="summary-row">
      <span>Shipping</span>
      <span class="free-shipping">
        ${shipping === 0 ? "FREE" : `₹${shipping.toFixed(0)}`}
      </span>
    </div>

    <div class="summary-row total">
      <span>Total</span>
      <span>₹${total.toFixed(0)}</span>
    </div>
  `;
});
