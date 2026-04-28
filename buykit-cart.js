
// BuyKIT Cart
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productTeam, quantity, size, price) {
  const cart = getCart();
  let matchingitem;

  cart.forEach((item) => {
    if (item.productteam === productTeam && item.size === size) {
      matchingitem = item;
    }
  });

  if (matchingitem) {
    matchingitem.quantity += quantity;
  } else {
    cart.push({
      productteam: productTeam,
      quantity: quantity,
      size: size,
      price: price
    });
  }

  saveCart(cart);
}

function getCartQuantity() {
  const cart = getCart();
  let cartquantity = 0;
  cart.forEach((item) => {
    cartquantity += item.quantity;
  });
  return cartquantity;
}

// Export for use in other files
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.getCartQuantity = getCartQuantity;
