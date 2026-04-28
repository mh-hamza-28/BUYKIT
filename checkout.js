import { products } from "./data/product.js";
document.addEventListener('DOMContentLoaded', () => {

  // Always get fresh cart from localStorage
  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  // Function to save cart
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Calculate total quantity
  function getCartQuantity() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Calculate total price using stored cart price
  function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => {
      return sum + (item.price || 0) * item.quantity;
    }, 0).toFixed(2);
  }

  // Update cart quantity in navbar
  function updateCartQuantityDisplay() {
    const quantity = getCartQuantity();
    document.querySelectorAll('.jscartqtty').forEach(el => el.innerText = quantity);
  }

  // Render checkout cards
  function renderCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
      document.querySelector('.checkout-items').innerHTML = '<p style="text-align: center; padding: 40px;">Your cart is empty</p>';
      return;
    }

    let checkoutHTML = '';

    // GROUPED ORDER SUMMARY (all items together)
    let groupTotal = 0;
    let groupItems = '';

    cart.forEach((item, index) => {
      const product = products.find(p => p.team === item.productteam);
      if (!product) return;

      const itemPrice = item.price || product.price || 0;
      const itemTotal = itemPrice * item.quantity;
      groupTotal += itemTotal;

      groupItems += `
        <div class="group-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #eee;">
          <img src="${product.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
          <div style="flex: 1;">
            <p style="margin: 0; font-size: 13px; font-weight: 600;">${product.team}</p>
            <p style="margin: 0; font-size: 12px; color: #666;">Qty: ${item.quantity} • Size: ${item.size || 'M'}</p>
          </div>
          <span style="font-weight: 600;">₹${itemTotal.toFixed(0)}</span>
        </div>
      `;
    });

    checkoutHTML += `
      <div class="checkout-card group-order-card" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid var(--accent-emerald);">
        <h3 style="margin: 0 0 15px 0; color: var(--primary-dark);">📦 Order Summary (${cart.length} items)</h3>
        <div class="grouped-items" style="margin-bottom: 15px;">
          ${groupItems}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 2px solid var(--accent-emerald);">
          <span style="font-weight: 700; font-size: 16px;">Order Total:</span>
          <span style="font-weight: 700; font-size: 18px; color: var(--accent-emerald);">₹${groupTotal.toFixed(0)}</span>
        </div>
      </div>

      <hr style="margin: 25px 0; border: none; border-top: 2px dashed #ddd;">
      <h3 style="color: var(--primary-dark); margin-bottom: 15px;">Individual Items</h3>
    `;

    // INDIVIDUAL ITEM CARDS (each separate)
    cart.forEach((item, index) => {
      const product = products.find(p => p.team === item.productteam);
      if (!product) return;

      // Determine badge class
      let badgeClass = '';
      if (product.badge === 'BESTSELLER') badgeClass = 'bestseller';
      else if (product.badge === 'NEW') badgeClass = 'new';
      else if (product.badge === 'HOT') badgeClass = 'hot';

      const itemPrice = item.price || product.price || 0;
      const totalPrice = itemPrice * item.quantity;

      checkoutHTML += `
        <div class="checkout-card individual-card" style="border-left: 3px solid var(--accent-blue);">
          <div class="card-badge ${badgeClass}">${product.badge}</div>
          <div class="item-grid">
            <img src="${product.image}" class="product-image" alt="${product.team}">
            <div class="item-info">
              <p class="product-name"><u>${product.team}</u></p>
              <p><strong>Qty:</strong> <span class="item-quantity">${item.quantity}</span></p>
              <p><strong>Total:</strong> ₹${totalPrice.toFixed(0)}</p>
              <p><strong>Unit Price:</strong> ₹${itemPrice.toFixed(0)}</p>
              <p><strong>Season:</strong> ${product.season}</p>
              <p><strong>League:</strong> ${product.league}</p>
              <p><strong>Size:</strong> ${item.size || 'M'}</p>
              <p><strong>Delivery:</strong> ${new Date(Date.now() + 7 * 86400000).toDateString()}</p>
            </div>
          </div>

          <div class="card-buttons">
            <button class="btn-add" data-index="${index}">+ Add</button>
            <button class="btn-remove" data-index="${index}">- Remove</button>
          </div>
        </div>
      `;
    });

    document.querySelector('.checkout-items').innerHTML = checkoutHTML;

    const totalContainer = document.querySelector('.checkout-total');
    if (totalContainer) {
      totalContainer.innerText = `₹${getCartTotal()}`;
    }

    document.querySelectorAll('.btn-add').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        const cart = getCart();
        cart[index].quantity += 1;
        saveCart(cart);
        renderCheckout();
        updateCartQuantityDisplay();
      });
    });

    document.querySelectorAll('.btn-remove').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        const cart = getCart();
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart(cart);
        renderCheckout();
        updateCartQuantityDisplay();
      });
    });

    updateOrderSummary();
    updateCartQuantityDisplay();
  }

  // Update order summary
  function updateOrderSummary() {
    const cart = getCart();
    let itemsTotal = cart.reduce((sum, item) => {
      return sum + (item.price || 0) * item.quantity;
    }, 0);

    let deliveryFee = itemsTotal < 1500 && itemsTotal > 0 ? 80 : 0; // ₹80 delivery for orders under ₹1500
    let orderTotal = itemsTotal + deliveryFee;

    const summaryContainer = document.querySelector('.order-summary');
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div class="checkout-card summary-card">
          <h2 class="summary-title">Order Summary</h2>

          <div class="summary-row">
            <span>Items (${getCartQuantity()})</span>
            <span>₹${itemsTotal.toFixed(0)}</span>
          </div>

          <div class="summary-row">
            <span>Delivery</span>
            <span>${deliveryFee === 0 ? 'FREE' : '₹99'}</span>
          </div>

          <div class="summary-row total">
            <span>Order Total</span>
            <span>₹${orderTotal.toFixed(0)}</span>
          </div>

          <button class="place-order-btn">Place your order</button>
          <p class="secure-note">🔒 Safe & Secure Payments</p>
        </div>
      `;
    }
  }

  renderCheckout();
  updateCartQuantityDisplay();
  displayShippingDetails();

  // Function to display saved shipping details
  function displayShippingDetails() {
    const shippingInfoDiv = document.getElementById('shipping-info-display');
    if (!shippingInfoDiv) return;

    const savedDetails = localStorage.getItem('shippingDetails');
    if (savedDetails) {
      const details = JSON.parse(savedDetails);
      shippingInfoDiv.innerHTML = `
        <p><strong>${details.fullName}</strong></p>
        <p>${details.mobile}</p>
        <p>${details.street}</p>
        <p>${details.city}, ${details.state} - ${details.pincode}</p>
        ${details.landmark ? `<p>Landmark: ${details.landmark}</p>` : ''}
        <a href="shipping-form.html" class="edit-shipping-btn">Edit Address</a>
      `;
    }
  }

  // ✅ SINGLE place-order handler (appends orders)
  document.body.addEventListener('click', (e) => {
    if (!e.target.classList.contains('place-order-btn')) return;

    const cart = getCart();
    if (cart.length === 0) {
      // Show styled popup instead of alert
      const popup = document.getElementById('empty-cart-popup');
      if (popup) {
        popup.classList.add('show');
        setTimeout(() => {
          popup.classList.remove('show');
        }, 2000);
      }
      return;
    }

    // ALWAYS ask for shipping details before placing order
    // Save a flag to indicate we're in "placing order" mode
    localStorage.setItem('placingOrder', 'true');
    // Redirect to shipping form
    window.location.href = 'shipping-form.html?from=checkout';
    return;
  });

  // Function to complete order placement (called after shipping is filled)
  function completeOrderPlacement() {
    const cart = getCart();
    const shippingDetails = localStorage.getItem('shippingDetails');

    if (!shippingDetails) {
      alert('Shipping details required!');
      return;
    }

    const savedShipping = JSON.parse(shippingDetails);

    /* =========================
       CREATE ACTIVE ORDER
       (Used by tracking.html)
       ========================= */

    const itemsTotal = cart.reduce((sum, item) => {
      return sum + (item.price || 0) * item.quantity;
    }, 0);

    const deliveryFee = itemsTotal < 1500 && itemsTotal > 0 ? 80 : 0;
    const orderTotal = itemsTotal + deliveryFee;

    // Generate unique order ID
    const uniqueId = "BK" + Date.now() + Math.random().toString(36).substring(2, 8).toUpperCase();

    const activeOrder = {
      id: uniqueId,
      total: orderTotal,
      status: "Processing",
      progress: 1,
      shippingPartner: "India Post",
      indiaPostTracking: null,
      shipping: savedShipping,
      products: cart.map(item => {
        const product = products.find(p => p.team === item.productteam);
        return {
          name: product.team,
          size: item.size,
          player: "Custom",
          quantity: item.quantity,
          price: item.price || product.price,
          image: product.image
        };
      }),
      orderedAt: new Date().toISOString()
    };

    localStorage.setItem("activeOrder", JSON.stringify(activeOrder));
    /* =========================
        save TO ORDERS history
        ========================= */
    const cartForOrders = getCart();
    const newOrders = cartForOrders.map(item => {
      const product = products.find(p => p.team === item.productteam);
      return {
        team: product.team,
        image: product.image,
        season: product.season,
        league: product.league,
        price: item.price || product.price, // Use stored cart price
        quantity: item.quantity,
        size: item.size,
        orderedAt: new Date().toISOString(),
        shipping: savedShipping // Include shipping details with each order
      };
    });

    const previousOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const updatedOrders = [...previousOrders, ...newOrders];

    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    localStorage.removeItem('cart');
    localStorage.removeItem('placingOrder'); // Clear the placing order flag
    localStorage.removeItem('shippingDetails'); // Clear shipping so it asks again next time

    window.location.href = 'orders.html';
  }

  // Check if we're returning from shipping form (placing order mode)
  const placingOrder = localStorage.getItem('placingOrder');
  if (placingOrder === 'true') {
    // Complete the order placement
    completeOrderPlacement();
  }

});
