document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Small helper to render a list of products into a grid container
  function renderProductsList(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = products.map(p => `
      <div class="product-card card">
        <div class="product-visual">
          <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
        </div>
        <div class="card-body">
          <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
          <div class="meta">
            <span class="price">${formatPrice(p.price)}</span>
            <button onclick="addToCart('${p.id}')" class="btn-primary">Ajouter</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 1) Nos routines complètes (packs)
  const routines = window.FD_PRODUCTS.filter(p => p.type === 'pack');
  renderProductsList(routines, 'routines-grid');

  // 2) Gammes haut de gamme — top 4 by price
  const expensive = window.FD_PRODUCTS.slice().sort((a,b) => b.price - a.price).slice(0, 4);
  renderProductsList(expensive, 'expensive-grid');

  // 3) Duos
  const duos = window.FD_PRODUCTS.filter(p => p.type === 'duo');
  renderProductsList(duos, 'duo-grid');

  // 4) Produits populaires — reuse first 4 items for simplicity
  const popular = window.FD_PRODUCTS.slice(0,4);
  renderProductsList(popular, 'popular-grid');

  // Newsletter submit (local feedback only)
  const nlForm = document.getElementById('newsletter-form');
  const nlResult = document.getElementById('newsletter-result');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = nlForm.email.value;
      nlResult.textContent = 'Merci — vous êtes inscrit(e) !';
      nlForm.reset();
      setTimeout(()=> nlResult.textContent = '', 5000);
    });
  }
});
