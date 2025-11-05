const CART_KEY = "fd_cart";

function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch{ return []; } }
function saveCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); }
function updateCartCount(){
  const el = $("#cart-count"); if(!el) return;
  const total = getCart().reduce((s,i)=>s+i.qty,0);
  el.textContent = total;
}
function updateQuantity(id, newQty) {
  const cart = getCart();
  const i = cart.findIndex(x => x.id === id);
  if (i >= 0) {
    if (newQty <= 0) {
      cart.splice(i, 1);
    } else {
      cart[i].qty = newQty;
    }
    saveCart(cart);
    updateCartCount();
    if (document.getElementById('cart-list')) {
      try { renderCartPage(); } catch(e) { }
    }
  }
}

function addToCart(id, qty=1){
  const cart = getCart();
  const i = cart.findIndex(x=>x.id===id);
  if(i>=0) cart[i].qty += qty; else cart.push({id, qty});
  saveCart(cart); updateCartCount();
  // If we're on the cart page, re-render so the UI updates immediately
  if (document.getElementById('cart-list')) {
    try{ renderCartPage(); } catch(e){ /* ignore if render not available yet */ }
  }
}

function removeFromCart(id){
  saveCart(getCart().filter(x=>x.id!==id)); updateCartCount();
  if (document.getElementById('cart-list')) {
    try{ renderCartPage(); } catch(e){ }
  }
}
function cartSubtotal(){
  return getCart().reduce((sum,i)=>{
    const p = FD_PRODUCTS.find(pr=>pr.id===i.id);
    return p ? sum + p.price * i.qty : sum;
  },0);
}
// Free shipping threshold (in same currency used across the site)
const FREE_SHIPPING_THRESHOLD = 100;

function freeShippingInfo(){
  const subtotal = cartSubtotal();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  return { subtotal, remaining, percent };
}

function renderFreeShippingBar(){
  const el = document.getElementById('free-shipping');
  if(!el) return;
  const info = freeShippingInfo();
  if(info.subtotal >= FREE_SHIPPING_THRESHOLD){
    el.innerHTML = `
      <div class="free-shipping-bar success">
        <div class="free-shipping-text">Vous avez atteint la livraison gratuite 🎉 — total ${formatPrice(info.subtotal)}</div>
      </div>
    `;
  } else {
    el.innerHTML = `
      <div class="free-shipping-bar">
        <div class="free-shipping-text">Ajoutez ${formatPrice(info.remaining)} de plus pour obtenir la livraison gratuite.</div>
        <div class="free-shipping-progress"><div class="free-shipping-fill" style="width:${info.percent}%;"></div></div>
      </div>
    `;
  }
}
function renderCartPage(){
  updateCartCount();
  const listEl = $("#cart-list");
  const cart = getCart();
  console.log("Cart contents:", cart);
  console.log("FD_PRODUCTS:", FD_PRODUCTS);
  if(cart.length === 0){
    listEl.innerHTML = "<p>Votre panier est vide.</p>";
    $("#subtotal").textContent = "$0";
    // Render free shipping bar (in case it exists on the page)
    try{ renderFreeShippingBar(); } catch(e) { }
    return;
  }
  listEl.innerHTML = cart.map(i => {
    const p = FD_PRODUCTS.find(pr => pr.id === i.id);
    if(!p) return "";
    return `
      <div class="card product-row">
        <img src="${p.image}" alt="${p.name}" style="width:80px;height:80px;object-fit:cover;border:1px solid var(--border)"/>
        <div class="product-info">
          <h3 style="margin:0">${p.name}</h3>
          <p style="margin:4px 0">Marque: ${p.brand}</p>
          <div class="quantity-controls">
            <button onclick="updateQuantity('${p.id}', ${i.qty - 1})">-</button>
            <span class="quantity">${i.qty}</span>
            <button onclick="updateQuantity('${p.id}', ${i.qty + 1})">+</button>
          </div>
          <p class="price">${formatPrice(p.price)} × ${i.qty} = ${formatPrice(p.price * i.qty)}</p>
          <button class="btn-secondary" onclick="removeFromCart('${p.id}');">
            <i class="fas fa-trash-alt"></i> Supprimer
          </button>
        </div>
      </div>
    `;
  }).join("");
  $("#subtotal").textContent = formatPrice(cartSubtotal());
  // Render free shipping bar (progress / call-to-action)
  try{ renderFreeShippingBar(); } catch(e) { }
}

// If we're on the cart page, render the cart on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-list")) {
    renderCartPage();
  }
});
