let buykit='';
products.forEach((product) => {
    // Determine badge class
    let badgeClass = '';
    if (product.badge==='BESTSELLER'){
        badgeClass='bestseller'
    }

    else if (product.badge === 'NEW') {
        badgeClass = 'new';
    } else if (product.badge === 'HOT') {
        badgeClass = 'hot';
    }
 
    
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
                <button class="button button-primary">Add to Cart</button>
            </div>
        </div>`;
});

document.querySelector('#jersey-grid').innerHTML = buykit;
