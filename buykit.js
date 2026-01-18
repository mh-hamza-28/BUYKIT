let buykit = '';
products.forEach((product) => {
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
                <span class="price"><u>$${(product.price / 100).toFixed(2)}</u></span>
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
        </div>
    `;
});

document.querySelector('#jersey-grid').innerHTML = buykit;

// ✅ Attach Add to Cart event listeners AFTER generating the HTML
document.querySelectorAll('.jsaddcart').forEach((button) => {
    button.addEventListener('click', () => {

        const productId = button.dataset.productId;

        const quantitySelect = button
            .closest('.jersey-card')
            .querySelector('.product-quantity-container select');

        const quantity = Number(quantitySelect.value);

        addToCart(productId, quantity);

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

   