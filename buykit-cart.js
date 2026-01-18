
// BuyKIT Cart
const cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productTeam, quantity,size) {
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
      size: size
    });
  }

  saveCart(cart);
}

function getCartQuantity() {
  let cartquantity = 0;
  cart.forEach((item) => {
    cartquantity += item.quantity;
  });
  return cartquantity;
}
