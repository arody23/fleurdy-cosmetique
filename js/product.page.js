document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const container = document.getElementById("product-container");
  const params = new URLSearchParams(window.location.search);
  // product IDs are strings (e.g. "anthelios-spf50"). Use the raw param.
  const id = params.get("id");

  const product = window.FD_PRODUCTS.find(p => p.id === id);

  if (!product) {
    container.innerHTML = `<p>Produit introuvable.</p>`;
    return;
  }

  // Use shared renderer so markup matches home/catalog styles
  if (typeof renderProductDetail === 'function') {
    container.innerHTML = renderProductDetail(product);
  } else {
    // fallback simple layout
    container.innerHTML = `
      <div class="product-detail">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <h1>${product.name}</h1>
          <p class="brand">${product.brand}</p>
          <p class="description">${product.description || "Description à venir."}</p>
          <p class="price">Prix : ${formatPrice(product.price)}</p>
          <button class="btn-primary" onclick="addToCart('${product.id}')">Ajouter au panier</button>
        </div>
      </div>
    `;
  }
});
