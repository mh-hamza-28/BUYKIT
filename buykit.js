import { productApi, cartApi, getUser } from './frontend/api/client.js';
import { showMessage, money, setButtonLoading } from './frontend/utils/ui.js';
import { products as localProducts } from './data/product.js';

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
    price: [899, 849, 799, 899, 949, 899, 999, 799, 749, 899, 849, 799, 999, 749, 699, 999, 899, 849][index] || 799,
    league: product.league,
    season: product.season,
    badge: product.badge,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isLocalFallback: true
  }));

  async function updateCartQuantityDisplay() {
    try {
      const user = getUser();
      if (!user) {
        quantityBadges.forEach((el) => (el.innerText = '0'));
        return;
      }
      const cart = await cartApi.get();
      quantityBadges.forEach((el) => (el.innerText = cart.summary.itemCount));
    } catch {
      quantityBadges.forEach((el) => (el.innerText = '0'));
    }
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

  async function renderProducts() {
    if (!grid) return;
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;"><h3>Loading jerseys...</h3></div>';
    try {
      const { products, pagination } = await loadProducts();

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
              <button class="button button-primary jsaddcart" data-product-id="${product._id}" ${product.isLocalFallback ? 'data-local-fallback="true"' : ''}>Add to Cart</button>
            </div>`;
        })
        .join('') + renderPagination(pagination);

      attachProductActions();
    } catch (error) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;"><h3>${error.message}</h3></div>`;
    }
  }

  async function loadProducts() {
    const params = { page: currentPage, limit };
    if (currentFilter !== 'All') params.league = currentFilter;
    if (currentSearch) params.search = currentSearch;

    try {
      return await productApi.list(params);
    } catch (error) {
      console.warn('Product API unavailable, using local fallback products:', error.message);
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
  }

  function attachProductActions() {
    document.querySelectorAll('.jsaddcart').forEach((button) => {
      button.addEventListener('click', async () => {
        const user = getUser();
        if (button.dataset.localFallback === 'true') {
          showMessage('Backend products are unavailable. Start the server and seed MongoDB to enable cart.', 'error');
          return;
        }
        if (!user) {
          window.location.href = 'auth.html?next=index.html';
          return;
        }
        const card = button.closest('.jersey-card');
        const quantity = Number(card.querySelector('.product-quantity-container select').value);
        const size = card.querySelector('.size select').value;
        setButtonLoading(button, true, 'Adding...');
        try {
          const cart = await cartApi.add({ productId: button.dataset.productId, quantity, size });
          quantityBadges.forEach((el) => (el.innerText = cart.summary.itemCount));
          showMessage('Jersey added to cart');
        } catch (error) {
          showMessage(error.message, 'error');
        } finally {
          setButtonLoading(button, false);
        }
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
