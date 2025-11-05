function renderProductCard(p){
  return `
    <article class="card product-card">
      <div class="product-visual">
        <a href="product.html?id=${encodeURIComponent(p.id)}"><img src="${p.image}" alt="${p.name}"></a>
      </div>
      <div class="card-body">
        <a href="product.html?id=${encodeURIComponent(p.id)}"><h3>${p.name}</h3></a>
        <div class="meta">
          <span class="price">${formatPrice(p.price)}</span>
          <div class="card-actions">
            <button class="btn-primary" onclick="addToCart('${p.id}')">Ajouter</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = products
    .slice(0, 4)
    .map(renderProductCard)
    .join('');
}

function renderProductGrid(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = products
    .map(renderProductCard)
    .join('');
}

function renderProductDetail(product) {
  if (!product) return '';
  
  return `
    <div class="product-detail">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-info">
        <h1>${product.name}</h1>
        <div class="meta">
          <span class="badge">${product.brand}</span>
          <span class="price">${formatPrice(product.price)}</span>
        </div>
        <p class="description">${product.description || product.shortDesc || ""}</p>
        <div class="actions">
          <button class="btn-primary" onclick="addToCart('${product.id}')">Ajouter au panier</button>
          <button class="btn-secondary btn-compact" onclick="(function(){ addToCart('${product.id}'); window.location.href='commande.html'; })()">Commander</button>
        </div>
      </div>
    </div>
  `;
}

function renderCheckoutItem(item, product) {
  return `
    <div class="checkout-item">
      <span class="item-name">${product.name}</span>
      <span class="item-quantity">×${item.quantity}</span>
      <span class="item-price">${formatPrice(product.price * item.quantity)}</span>
    </div>
  `;
}
