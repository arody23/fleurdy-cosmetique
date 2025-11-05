function $(sel, scope=document){ return scope.querySelector(sel); }
function formatPrice(n){ return `$${n}`; }
function getParam(name){ const url = new URL(window.location.href); return url.searchParams.get(name); }
