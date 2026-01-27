document.addEventListener("DOMContentLoaded", () => {

  const order = JSON.parse(localStorage.getItem("activeOrder"));

  if (!order) {
    alert("No order selected!");
    window.location.href = "orders.html";
    return;
  }

  /* =========================
     RENDER PRODUCTS
     ========================= */

  const productsContainer = document.querySelector(".products-container");
  productsContainer.innerHTML = "";

  let subtotal = 0;

  order.products.forEach(product => {
    const productTotal = product.price * product.quantity;
    subtotal += productTotal;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `

       <div class="order-header">
       <div class="order-header-left-section" >
           EXPECTED DELIVERY ON </div>
                  
  <div class="delivery-date">${new Date(Date.now() + 4 * 86400000).toDateString()}</div>
  <div class="order-id">${order.id} | ${order.status}</div>

      <img src="${product.image}" class="product-image">
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <p><strong>Size:</strong> ${product.size}</p>
        <p><strong>Quantity:</strong> ${product.quantity}</p>
        <p><strong>$${productTotal.toFixed(2)}</strong></p>
        </div>

     <div class="info-section">
            <h4>Shipping Details</h4>
            <p>address:123street</p>
            <p>Carrier:<a href="https://www.indiapost.gov.in/"style="color:red;">India Post</a> </p>
            <p>Tracking Number: BK789456123</p>
            <p>Estimated Delivery: ${new Date(Date.now() + 4 * 86400000).toDateString()}</p>
          </div>
        </div>
      `;

    productsContainer.appendChild(card);
  });
  

  /* =========================
     ORDER SUMMARY CALCULATION
     ========================= */

  const shipping = subtotal > 500 ? 0 : 20;
  const tax = subtotal * 0.08; // 8% demo tax
  const total = subtotal + shipping + tax;

  document.querySelector(".order-summary").innerHTML = `
    <h4>Order Summary</h4>

    <div class="summary-row">
      <span>Subtotal (${order.products.length} items)</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>

    <div class="summary-row">
      <span>Shipping</span>
      <span class="free-shipping">
        ${shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
      </span>
    </div>

    <div class="summary-row">
      <span>Tax</span>
      <span>$${tax.toFixed(2)}</span>
    </div>

    <div class="summary-row total">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
});
