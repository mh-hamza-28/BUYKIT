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
          cart.splice(index, 1); // Remove item if quantity reaches 0
        }
        saveCart();
        renderCheckout();
        updateCartQuantityDisplay();
      });
    });
    updateOrderSummary();
    updateCartQuantityDisplay();
  }
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

          <div class="summary-row subtotal">
            <span>Subtotal</span>
            <span>$${itemsTotal.toFixed(2)}</span>
          </div>

          <div class="summary-row total">
            <span>Order Total</span>
            <span>$${orderTotal.toFixed(2)}</span>
          </div>

          <a href="orders.html"><button class="place-order-btn">Place your order</button></a>
          <p class="secure-note">🔒 Safe & Secure Payments</p>
        </div>`;
      }
    }

  // Initial render and update
  renderCheckout();
  updateCartQuantityDisplay();
});

// // Sample products array for reference
// const products = [
//   { team: 'Team A', price: 2500, image: 'team-a.jpg', season: '2022', league: 'League 1' },
//   { team: 'Team B', price: 3000, image: 'team-b.jpg', season: '2022', league: 'League 1' },
//   // Add more products as needed
// ];
// Get the orders container
const ordersGrid = document.getElementById('orders-grid');

// Retrieve orders from localStorage or your cart system
// Example: assuming you store cart items as JSON in localStorage
let orders = JSON.parse(localStorage.getItem('cartItems')) || [];

// Check if there are any orders
if (orders.length === 0) {
  // Display a "No orders" message
  ordersGrid.innerHTML = `
    <div class="no-orders-message">
      <p>Your cart is empty. Add some jerseys to see them here!</p>
      <a href="index.html" class="button button-primary">Shop Now</a>
    </div>
  `;
} else {
  // Render the orders normally
  orders.forEach(order => {
    ordersGrid.innerHTML += `
      <div class="order-container">
        <!-- Order details like product, quantity, total -->
      </div>
    `;
  });
}
