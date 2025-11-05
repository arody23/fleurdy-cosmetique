document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const grid = document.getElementById("catalog-grid");
  const brandSel = document.getElementById("filter-brand");
  const cateSel = document.getElementById("filter-category");

  function render(){
    const brand = brandSel.value;
    const type = cateSel.value;

    const list = window.FD_PRODUCTS.filter(p => {
      const brandOk = !brand || p.brand === brand;
      const typeOk = !type || p.type === type;
      return brandOk && typeOk;
    });

    grid.innerHTML = list.map(renderProductCard).join("");
  }

  brandSel.addEventListener("change", render);
  cateSel.addEventListener("change", render);
  render();
});
