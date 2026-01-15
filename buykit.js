let buykit='';

products.forEach((product)=>{
    buykit+=`
      <div class="jersey-card grid">
                <div class="card-badge">${product.badge}</div>
                <div class="jersey-image">
    <div class="jersey-card card-gold">
     <div class="jersey-image">
     <img src="${product.image}"alt="${product.team}" style="width:100%; max-width:220px;">
      </div>

      <div class="card-content">
               <span class="team-league">${product.league}</span>
                    <h3>${product.team}</h3>
                    <p class="jersey-desc">${product.season}</p>
                    <div class="price-row">
                        <span class="price">$${((product.price)/100).toFixed(2)}</span>
                    </div>
                    <button class="button button-primary">Add to Cart</button>
                </div>
            </div>`;
});
document.querySelector('.grid').innerHTML=buykit;
