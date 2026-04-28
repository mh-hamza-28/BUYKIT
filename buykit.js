import { products } from "./data/product.js";

// Wait for DOM to be fully loaded before running
document.addEventListener('DOMContentLoaded', () => {

// Generate random prices for products (400-1000 rupees)
products.forEach(product => {
    product.price = Math.floor(Math.random() * 601) + 400;
});

let currentFilter = 'All';
let currentSearch = '';

function renderProducts() {
    let buykit = '';
    const filteredProducts = products.filter(product => {
        const matchesCategory = currentFilter === 'All' || product.league === currentFilter;
        const matchesSearch = product.team.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              product.league.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    
    if (filteredProducts.length === 0) {
        buykit = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><h3>No jerseys found</h3></div>';
    } else {
        filteredProducts.forEach((product) => {
            // Determine badge class
            let badgeClass = '';
            if (product.badge === 'BESTSELLER') badgeClass = 'bestseller';
            else if (product.badge === 'NEW') badgeClass = 'new';
            else if (product.badge === 'HOT') badgeClass = 'hot';

            buykit += `
                <div class="jersey-card">
                    <div class="card-badge ${badgeClass}">${product.badge}</div>
                    <div class="jersey-image">
                        <img src="${product.image}" alt="${product.team}" style="width:100%; max-width:220px;">
                    </div>
                    <div class="card-content">
                        <span class="team-league">${product.league}</span>
                        <h3>${product.team}</h3>
                        <p class="jersey-desc">${product.season}</p>
                        <span class="price"><u>₹${product.price}</u></span>
                    </div>
                    <div class="productcontainer">
                        <div class="size">
                            <select>
                                <option selected value="S">SMALL</option>
                                <option value="M">MEDIUM</option>
                                <option value="L">LARGE</option>
                                <option value="XL">XTRA LARGE</option>
                                <option value="XXL">2XTRA LARGE</option>
                            </select>
                        </div>
                        <div class="product-quantity-container">
                            <select>
                                <option selected value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                    </div>
                    <div class="product-spacer"></div>
                    <button class="button button-primary jsaddcart" data-product-id="${product.team}">Add to Cart</button>
                </div>`
        });
    }
    document.querySelector('#jersey-grid').innerHTML = buykit;
    attachCartListeners();
}

function attachCartListeners() {
    document.querySelectorAll('.jsaddcart').forEach((button) => {
        button.addEventListener('click', () => {

            const productId = button.dataset.productId;

            const quantitySelect = button
                .closest('.jersey-card')
                .querySelector('.product-quantity-container select');

            const quantity = Number(quantitySelect.value);
            const sizeSelect = button.closest('.jersey-card').querySelector('.size select');
            const size = sizeSelect ? sizeSelect.value : 'M';

            // Get price from the product data
            const product = products.find(p => p.team === productId);
            const price = product ? product.price : 0;

            addToCart(productId, quantity, size, price);

            document.querySelector('.jscartqtty').innerText = getCartQuantity();

            // Show popup
            const popup = document.getElementById('cart-popup');
            popup.innerText = `${productId} added to cart!`;
            popup.classList.add('show');

            // Debug: check if popup exists
            if (!popup) console.error('Popup element not found!');

            // Hide popup after 2 seconds
            setTimeout(() => {
                popup.classList.remove('show');
            }, 2000);
        });
    });
}

renderProducts();

// Initialize cart quantity on page load
document.querySelector('.jscartqtty').innerText = getCartQuantity();

// Category tab filtering
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderProducts();
    });
});

// Search functionality (case-insensitive)
const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');

function handleSearch() {
    currentSearch = searchBar.value.trim();
    renderProducts();
}

searchBar.addEventListener('input', handleSearch);
searchButton.addEventListener('click', handleSearch);
searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

/*MOBILE MENU*/

const menuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

// Safety check (important for debugging)
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });

    // Optional: close menu when a link is clicked
    document.querySelectorAll(".mobile-nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
        });
    });
} else {
    console.error("Mobile menu elements not found");
}

}); // End DOMContentLoaded