// Reset cart on page refresh
localStorage.removeItem('buykit-cart');

// BuyKIT Cart
const cart = [];

function saveCart() {
  localStorage.setItem('buykit-cart', JSON.stringify(cart));
}

function addToCart(productTeam, quantity) {
  let matchingitem;

  cart.forEach((item) => {
    if (item.productteam === productTeam) {
      matchingitem = item;
    }
  });

  if (matchingitem) {
    matchingitem.quantity += quantity;
  } else {
    cart.push({
      productteam: productTeam,
      quantity: quantity
    });
  }

  saveCart();
}

function getCartQuantity() {
  let cartquantity = 0;
  cart.forEach((item) => {
    cartquantity += item.quantity;
  });
  return cartquantity;
}
