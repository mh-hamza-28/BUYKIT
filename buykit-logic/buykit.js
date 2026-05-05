// Local product data - standalone mode
const localProducts = [
    { image: "images/jersey/r-madrid.png", team: "REAL MADRID", price: 899, league: "LA LIGA", season: "2025/26", badge: "BESTSELLER" },
    { image: "images/jersey/barca.png", team: "FC BARCELONA", price: 849, league: "LA LIGA", season: "2025/26", badge: "NEW" },
    { image: "images/jersey/amadrid2004.png", team: "ATLÉTICO MADRID 2004/05", price: 799, league: "LA LIGA", season: "2004/05", badge: "HOT" },
    { image: "images/jersey/manu.png", team: "MANCHESTER UNITED", price: 899, league: "PREMIER LEAGUE", season: "2025/26", badge: "NEW" },
    { image: "images/jersey/arsenal.png", team: "ARSENAL FC - 3rd KIT", price: 949, league: "PREMIER LEAGUE", season: "2025/26", badge: "BESTSELLER" },
    { image: "images/jersey/mancity.png", team: "MANCHESTER CITY - AWAY", price: 899, league: "PREMIER LEAGUE", season: "2025/26", badge: "BESTSELLER" },
    { image: "images/jersey/mancity3rd.png", team: "MANCHESTER CITY - 3rd KIT", price: 999, league: "PREMIER LEAGUE", season: "2025/26", badge: "NEW" },
    { image: "images/jersey/chelsea.png", team: "CHELSEA - HOME KIT", price: 799, league: "PREMIER LEAGUE", season: "2025/26", badge: "NEW" },
    { image: "images/jersey/juventus.png", team: "JUVENTUS - HOME KIT", price: 749, league: "SERIE A", season: "2025/26", badge: "HOT" },
    { image: "images/jersey/milan.png", team: "AC MILAN - HOME KIT", price: 899, league: "SERIE A", season: "2025/26", badge: "NEW" },
    { image: "images/jersey/inter.png", team: "INTER MILAN - AWAY", price: 849, league: "SERIE A", season: "2025/26", badge: "NEW" },
    { image: "images/jersey/bayern.png", team: "BAYERN MUNICH - HOME", price: 799, league: "BUNDESLIGA", season: "2025/26", badge: "BESTSELLER" },
    { image: "images/jersey/dortmund.png", team: "BORUSSIA DORTMUND", price: 999, league: "BUNDESLIGA", season: "2025/26", badge: "HOT" },
    { image: "images/jersey/intermiami.png", team: "INTER MIAMI CF", price: 749, league: "MLS", season: "2025/26", badge: "HOT" },
    { image: "images/jersey/lafc.png", team: "LOS ANGELES FC", price: 699, league: "MLS", season: "2025/26", badge: "NEW" },
    { image: "images/jersey/alhilal.png", team: "AL HILAL", price: 999, league: "SAUDI PRO LEAGUE", season: "2025/26", badge: "BESTSELLER" },
    { image: "images/jersey/alnassr.png", team: "AL NASSR", price: 899, league: "SAUDI PRO LEAGUE", season: "2025/26", badge: "HOT" },
    { image: "images/jersey/ittihad.png", team: "AL ITTIHAD", price: 849, league: "SAUDI PRO LEAGUE", season: "2025/26", badge: "NEW" }
];

// Utility functions
const money = (amount) => `₹${amount}`;
const showMessage = (msg, type = 'success') => {
    const popup = document.getElementById('cart-popup') || document.createElement('div');
    popup.id = 'cart-popup';
    popup.className = `cart-popup ${type}`;
    popup.textContent = msg;
    document.body.appendChild(popup);
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3000);
};

document.addEventListener('DOMContentLoaded', () => {
  let currentFilter = 'All';
  let currentSearch = '';
  let currentPage = 1;
  const limit = 12;

  const grid = document.querySelector('#jersey-grid');
  const quantityBadges = document.querySelectorAll('.jscartqtty');
  const fallbackProducts = localProducts.map((product, index) => ({
    _id: `local-${index}`,
    name: product.team,
    image: product.image,
    price: product.price,
    league: product.league,
    season: product.season,
    badge: product.badge,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isLocalFallback: false
  }));

  function updateCartQuantityDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    quantityBadges.forEach((el) => (el.innerText = totalQty));
  }

  function renderPagination(pagination) {
    if (!pagination || pagination.pages <= 1) return '';
    return `
      <div style="grid-column:1/-1;display:flex;justify-content:center;gap:10px;margin-top:18px;">
        <button class="button button-outline js-page-prev" ${pagination.page <= 1 ? 'disabled' : ''}>Previous</button>
        <span style="align-self:center;font-weight:700;">Page ${pagination.page} of ${pagination.pages}</span>
        <button class="button button-outline js-page-next" ${pagination.page >= pagination.pages ? 'disabled' : ''}>Next</button>
      </div>`;
  }

  function renderProducts() {
    if (!grid) return;
    const { products, pagination } = loadProducts();

      if (!products.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;"><h3>No jerseys found</h3></div>';
        return;
      }

    grid.innerHTML = products
      .map((product) => {
        const badgeClass = product.badge === 'BESTSELLER' ? 'bestseller' : product.badge === 'HOT' ? 'hot' : 'new';
        return `
          <div class="jersey-card">
            <div class="card-badge ${badgeClass}">${product.badge}</div>
            <div class="jersey-image">
              <img src="${product.image}" alt="${product.name}" style="width:100%; max-width:220px;">
            </div>
            <div class="card-content">
              <span class="team-league">${product.league}</span>
              <h3>${product.name}</h3>
              <p class="jersey-desc">${product.season}</p>
              <span class="price"><u>${money(product.price)}</u></span>
            </div>
            <div class="productcontainer">
              <div class="size">
                <select aria-label="Size">
                  ${(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => `<option value="${size}">${size}</option>`).join('')}
                </select>
              </div>
              <div class="product-quantity-container">
                <select aria-label="Quantity">
                  ${[1,2,3,4,5,6,7,8,9,10].map((qty) => `<option value="${qty}">${qty}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="product-spacer"></div>
            <button class="button button-primary jsaddcart" data-product-id="${product._id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">Add to Cart</button>
          </div>`;
      })
      .join('') + renderPagination(pagination);

    attachProductActions();
  }

  function loadProducts() {
    const filteredProducts = fallbackProducts.filter((product) => {
      const matchesCategory = currentFilter === 'All' || product.league === currentFilter;
      const search = currentSearch.toLowerCase();
      const matchesSearch = !search || product.name.toLowerCase().includes(search) || product.league.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
    const start = (currentPage - 1) * limit;
    const products = filteredProducts.slice(start, start + limit);
    return {
      products,
      pagination: {
        page: currentPage,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit) || 1
      }
    };
  }

  function attachProductActions() {
    document.querySelectorAll('.jsaddcart').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.jersey-card');
        const quantity = Number(card.querySelector('.product-quantity-container select').value);
        const size = card.querySelector('.size select').value;
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = Number(button.dataset.productPrice);
        const productImage = button.dataset.productImage;
        
        // Add to localStorage cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === productId && item.size === size);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({ productId, name: productName, price: productPrice, image: productImage, size, quantity });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartQuantityDisplay();
        showMessage(`${productName} added to cart!`);
      });
    });

    document.querySelector('.js-page-prev')?.addEventListener('click', () => {
      currentPage -= 1;
      renderProducts();
    });
    document.querySelector('.js-page-next')?.addEventListener('click', () => {
      currentPage += 1;
      renderProducts();
    });
  }

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.category;
      currentPage = 1;
      renderProducts();
    });
  });

  const searchBar = document.querySelector('.search-bar');
  const searchButton = document.querySelector('.search-button');
  const handleSearch = () => {
    currentSearch = searchBar?.value.trim() || '';
    currentPage = 1;
    renderProducts();
  };
  searchBar?.addEventListener('input', handleSearch);
  searchButton?.addEventListener('click', handleSearch);
  searchBar?.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleSearch();
  });

  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn?.addEventListener('click', () => mobileMenu?.classList.toggle('active'));
  document.querySelectorAll('.mobile-nav-links a').forEach((link) => {
    link.addEventListener('click', () => mobileMenu?.classList.remove('active'));
  });

  renderProducts();
  updateCartQuantityDisplay();
});

// Cart helper functions
function getCartQuantity() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}
