document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    const cart = JSON.parse(localStorage.getItem('fd_cart')) || [];

    // Si le panier est vide, afficher un message convivial au lieu de rediriger
    if (cart.length === 0) {
        const summaryContainer = document.getElementById('checkout-summary');
        const formEl = document.getElementById('checkout-form');
        if (summaryContainer) {
            summaryContainer.innerHTML = '<p style="padding:18px; color:var(--muted)">Votre panier est vide pour le moment. <a href="catalog.html">Retourner à la boutique</a></p>';
        }
        if (formEl) {
            formEl.style.display = 'none';
        }
        // stop initialization
        return;
    }

    // Helper: get authoritative subtotal (prefer cartSubtotal if available)
    function getSubtotalValue(){
        if (typeof cartSubtotal === 'function'){
            try{ return Number(cartSubtotal()) || 0; } catch(e){ /* fallthrough */ }
        }
        // Fallback: parse DOM value
        const el = document.getElementById('co-subtotal');
        if (el) return parseFloat((el.textContent||'').replace(/[^0-9.-]+/g,'')) || 0;
        return 0;
    }

    function computeDeliveryFeeForCommune(commune){
        // Prefer external FD_DELIVERY map if present
        if (window && window.FD_DELIVERY && typeof window.FD_DELIVERY[commune] !== 'undefined') {
            return window.FD_DELIVERY[commune] || 0;
        }
        // Fallback hard-coded map
        const fees = {
            'Gombe': 5,
            'Lingwala': 5,
            'Barumbu': 5,
            'Kinshasa': 5,
            'Kintambo': 7,
            'Ngaliema': 7,
            'Mont-Ngafula': 10,
            'Selembao': 8,
            'Bandalungwa': 7,
            'Kasa-Vubu': 7,
            'Kalamu': 7,
            'Lemba': 8,
            'Limete': 8,
            'Matete': 8,
            'Ngiri-Ngiri': 7,
            'Makala': 8,
            'Bumbu': 8,
            'Ngaba': 8,
            'Kisenso': 10,
            'Masina': 10,
            'Ndjili': 10,
            'Kimbanseke': 12,
            'Maluku': 15,
            'Nsele': 15
        };
        return fees[commune] || 0;
    }

    // Render summary and delivery values
    function renderSummary(){
        const container = document.getElementById('checkout-items');
        let subtotal = 0;

        const itemsHtml = cart.map(item => {
            const product = FD_PRODUCTS.find(p => p.id === item.id);
            if (!product) return '';
            const itemTotal = product.price * item.qty;
            subtotal += itemTotal;
            return `
                <div class="checkout-item" style="display: flex; justify-content: space-between; padding: 10px 0;">
                    <div>
                        <strong>${product.name}</strong> × ${item.qty}
                    </div>
                    <div>${formatPrice(itemTotal)}</div>
                </div>
            `;
        }).join('');

        if(container) container.innerHTML = itemsHtml;
        // Write subtotal using authoritative value (subtotal variable)
        document.getElementById('co-subtotal').textContent = formatPrice(subtotal);

        // Re-evaluate delivery based on selected commune
        const communeSelect = document.getElementById('commune');
        const selected = communeSelect ? communeSelect.value : '';
        updateDeliveryDisplay(selected);
    }

    // Update delivery DOM values based on commune (or none)
    function updateDeliveryDisplay(commune){
        const subtotal = getSubtotalValue();
        let fee = 0;
        if (typeof FREE_SHIPPING_THRESHOLD !== 'undefined' && subtotal >= FREE_SHIPPING_THRESHOLD){
            fee = 0;
        } else if (commune){
            fee = computeDeliveryFeeForCommune(commune);
        } else {
            fee = 0;
        }
        document.getElementById('co-delivery').textContent = formatPrice(fee);
        document.getElementById('co-total').textContent = formatPrice(subtotal + fee);
    }

    // Met à jour les frais de livraison quand la commune change
    const communeEl = document.getElementById('commune');
    if (communeEl) {
        communeEl.addEventListener('change', function(e) {
            updateDeliveryDisplay(e.target.value);
        });
    }

    // Affichage court de la date (jour + mois) et synchronisation du champ caché
    const dateInput = document.getElementById('delivery-date');
    const dateDisplay = document.getElementById('delivery-date-display');
    const dateShort = document.getElementById('delivery-date-short');
    const timeInput = document.getElementById('delivery-time');

    // Normalise une chaîne de temps en format 24h HH:MM
    function normalizeTo24(timeStr){
        if(!timeStr) return '';
        timeStr = timeStr.trim();
        // If already in HH:MM (24h) format
        const m24 = timeStr.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
        if(m24) {
            // pad hours
            const hh = m24[1].padStart(2,'0');
            return `${hh}:${m24[2]}`;
        }
        // Match 12-hour with AM/PM like 2:30 PM or 02:30pm
        const m12 = timeStr.match(/^(0?\d|1[0-2]):([0-5]\d)\s*([AaPp][Mm])$/);
        if(m12){
            let hh = parseInt(m12[1],10);
            const mm = m12[2];
            const ampm = m12[3].toLowerCase();
            if(ampm === 'pm' && hh !== 12) hh += 12;
            if(ampm === 'am' && hh === 12) hh = 0;
            return `${String(hh).padStart(2,'0')}:${mm}`;
        }
        // Try permissive parse like "2 PM" or "2pm"
        const m12b = timeStr.match(/^([0-9]{1,2})\s*([AaPp][Mm])$/);
        if(m12b){
            let hh = parseInt(m12b[1],10);
            const ampm = m12b[2].toLowerCase();
            if(ampm === 'pm' && hh !== 12) hh += 12;
            if(ampm === 'am' && hh === 12) hh = 0;
            return `${String(hh).padStart(2,'0')}:00`;
        }
        // If nothing matches, return original trimmed string (browser will validate)
        return timeStr;
    }

    // If there's a time input, ensure it's normalized on change/blur and provide a hint
    if(timeInput){
        // Ensure step and inputmode for numeric keyboards
        timeInput.setAttribute('step','60');
        timeInput.setAttribute('inputmode','numeric');
        timeInput.addEventListener('blur', function(){
            const v = normalizeTo24(this.value || this.valueAsNumber ? this.value : '');
            if(v) this.value = v;
        });
        timeInput.addEventListener('change', function(){
            const v = normalizeTo24(this.value || '');
            if(v) this.value = v;
        });
    }

    function formatDayMonth(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        try {
            return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' });
        } catch (err) {
            return iso;
        }
    }

    if (dateInput) {
        dateInput.addEventListener('change', function(e) {
            const short = formatDayMonth(this.value);
            if (dateDisplay) dateDisplay.textContent = short;
            if (dateShort) dateShort.value = short;
        });
        // initialize if value preset
        if (dateInput.value) {
            const short = formatDayMonth(dateInput.value);
            if (dateDisplay) dateDisplay.textContent = short;
            if (dateShort) dateShort.value = short;
        }
    }

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Normalize delivery time to 24h before submission
        const timeEl = form.querySelector('[name="delivery_time"]');
        if(timeEl){
            timeEl.value = normalizeTo24(timeEl.value || '');
        }

        // Recompute delivery before submitting to ensure free-shipping is applied
        const communeVal = (form.commune && form.commune.value) ? form.commune.value : '';
        try { updateDeliveryDisplay(communeVal); } catch (err) { /* ignore */ }

        // Prépare le résumé de la commande
        const cartSummary = cart.map(item => {
            const product = FD_PRODUCTS.find(p => p.id === item.id);
            return `${product.name} (${item.qty}x) - ${formatPrice(product.price * item.qty)}`;
        }).join('\n');

        // Ajoute le résumé au formulaire
        const orderDetails = document.createElement('input');
        orderDetails.type = 'hidden';
        orderDetails.name = 'message';
    orderDetails.value = `
RÉSUMÉ DE LA COMMANDE

${cartSummary}

Sous-total: ${document.getElementById('co-subtotal').textContent}
Livraison: ${document.getElementById('co-delivery').textContent}
TOTAL: ${document.getElementById('co-total').textContent}

Informations client :
Nom: ${form.name.value}
Téléphone: ${form.phone.value}
Date de livraison: ${form.delivery_date.value}
Date (jour+mois): ${document.getElementById('delivery-date-short') ? document.getElementById('delivery-date-short').value : ''}
Heure de livraison: ${form.delivery_time.value}
Adresse: ${form.address.value}
Commune: ${form.commune.value}
`;
        form.appendChild(orderDetails);

        // Soumet le formulaire via AJAX pour forcer la redirection vers notre page de remerciement
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const fd = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: fd,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                // rediriger vers la page de remerciement locale (utilise _next si présent)
                const next = form.querySelector('input[name="_next"]') ? form.querySelector('input[name="_next"]').value : '/merci.html';
                window.location.href = next;
            } else {
                return response.json().then(data => {
                    console.error('Formspree error', data);
                    alert("Erreur lors de l'envoi de la commande. Veuillez réessayer.");
                    if (submitBtn) submitBtn.disabled = false;
                });
            }
        }).catch(err => {
            console.error('Network error while sending order', err);
            alert("Problème réseau — impossible d'envoyer la commande pour le moment.");
            if (submitBtn) submitBtn.disabled = false;
        });
    });

    // Initialise l'affichage
    renderSummary();
});