document.addEventListener("DOMContentLoaded", () => {
  // Met à jour le compteur du panier (nombre d’articles)
  updateCartCount();

  // IDs des produits best-sellers à afficher sur la home
  const bestIds = ["anthelios-spf50", "ordinary-niacinamide-zinc", "dralthea-345"];

  // On filtre la liste des produits pour ne garder que ceux-là
  const best = window.FD_PRODUCTS.filter(p => bestIds.includes(p.id));

  // On injecte les cartes produits dans la section #home-products (id présent dans index.html)
  const target = document.getElementById("home-products");
  if (target) {
    target.innerHTML = best.map(renderProductCard).join("");
  }

  // Bouton "Ajouter au panier" pour le Duo numbuz:n
  const duoBtn = document.querySelector("[data-add='duo-numbuzn']");
  if (duoBtn) {
    duoBtn.addEventListener("click", () => addToCart("numbuzn-duo"));
  }
});
 