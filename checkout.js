import { products } from "./product.js";
document.addEventListener('DOMContentLoaded', () => {

  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Function to save cart
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Calculate total quantity
  function getCartQuantity() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Calculate total price
  function getCartTotal() {
    return cart.reduce((sum, item) => {
      const product = products.find(p => p.team === item.productteam);
      return product ? sum + (product.price / 100) * item.quantity : sum;
    }, 0).toFixed(2);
  }

  // Update cart quantity in navbar
  function updateCartQuantityDisplay() {
    const quantity = getCartQuantity();
    document.querySelectorAll('.jscartqtty').forEach(el => el.innerText = quantity);
  }

  // Render checkout cards
  function renderCheckout() {
    let checkoutHTML = '';

    cart.forEach((item, index) => {
      const product = products.find(p => p.team === item.productteam);
      if (!product) return;

      checkoutHTML += `
        <div class="checkout-card">
          <div class="item-grid">
            <img src="${product.image}" class="product-image">
            <div class="item-info">
              <p class="product-name"><u>${product.team}</u></p>
              <p>Qty: <span class="item-quantity">${item.quantity}</span></p>
              <p>Price: $${(((product.price)/100) * item.quantity).toFixed(2)}</p>
              <p>Season: ${product.season}</p>
              <p>League: ${product.league}</p>
              <p>Size: ${item.size}</p>
            </div>
          </div>

          <div class="card-buttons">
            <button class="btn-add" data-index="${index}">Add</button>
            <button class="btn-remove" data-index="${index}">Remove</button>
          </div>
        </div>
      `;
    });

    document.querySelector('.checkout-items').innerHTML = checkoutHTML;

    const totalContainer = document.querySelector('.checkout-total');
    if (totalContainer) {
      totalContainer.innerText = `$${getCartTotal()}`;
    }

    document.querySelectorAll('.btn-add').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        cart[index].quantity += 1;
        saveCart();
        renderCheckout();
        updateCartQuantityDisplay();
      });
    });

    document.querySelectorAll('.btn-remove').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
        renderCheckout();
        updateCartQuantityDisplay();
      });
    });

    updateOrderSummary();
    updateCartQuantityDisplay();
  }

  // Update order summary
  function updateOrderSummary() {
    let itemsTotal = cart.reduce((sum, item) => {
      const product = products.find(p => p.team === item.productteam);
      return product ? sum + (product.price / 100) * item.quantity : sum;
    }, 0);

    let deliveryFee = itemsTotal < 500 && itemsTotal > 0 ? 20 : 0;
    let orderTotal = itemsTotal + deliveryFee;

    const summaryContainer = document.querySelector('.order-summary');
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div class="checkout-card">
          <h2 class="summary-title">Order Summary</h2>

          <div class="summary-row">
            <span>Items (${getCartQuantity()})</span>
            <span>$${itemsTotal.toFixed(2)}</span>
          </div>

          <div class="summary-row">
            <span>Delivery</span>
            <span>${deliveryFee === 0 ? 'FREE' : '$20'}</span>
          </div>

          <div class="summary-row total">
            <span>Order Total</span>
            <span>$${orderTotal.toFixed(2)}</span>
          </div>

          <button class="place-order-btn">Place your order</button>
          <p class="secure-note">🔒 Safe & Secure Payments</p>
        </div>
      `;
    }
  }

  renderCheckout();
  updateCartQuantityDisplay();

  // ✅ SINGLE place-order handler (appends orders)
  document.body.addEventListener('click', (e) => {
    if (!e.target.classList.contains('place-order-btn')) return;

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
      /* =========================
       CREATE ACTIVE ORDER
       (Used by tracking.html)
       ========================= */

    const itemsTotal = cart.reduce((sum, item) => {
      const product = products.find(p => p.team === item.productteam);
      return product ? sum + (product.price / 100) * item.quantity : sum;
    }, 0);

    const deliveryFee = itemsTotal < 500 && itemsTotal > 0 ? 20 : 0;
    const orderTotal = itemsTotal + deliveryFee;

    const activeOrder = {
      id: "BK" + Date.now(),
      total: orderTotal,
      status: "Shipped",
      progress: 3,
      products: cart.map(item => {
        const product = products.find(p => p.team === item.productteam);
        return {
          name: product.team,
          size: item.size,
          player: "Custom",
          quantity: item.quantity,
          price: product.price / 100,
          image: product.image
        };
      })
    };

    localStorage.setItem("activeOrder", JSON.stringify(activeOrder));
    /* =========================
        save TO ORDERS history
        ========================= */
    const newOrders = cart.map(item => {
      const product = products.find(p => p.team === item.productteam);
      return {
        team: product.team,
        image: product.image,
        season: product.season,
        league: product.league,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        orderedAt: new Date().toISOString()
      };
    });

    const previousOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const updatedOrders = [...previousOrders, ...newOrders];

    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    localStorage.removeItem('cart');

    window.location.href = 'orders.html';
  });

});
