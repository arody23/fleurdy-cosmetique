document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    if (!form) {
        console.warn('checkout.page.js: form with id "checkout-form" not found — aborting checkout script');
        return;
    }
    // Mode test local: ajouter `?local_test=1` à l'URL pour simuler une soumission sans appeler Formspree
    const isLocalTest = (typeof window !== 'undefined') && (new URLSearchParams(window.location.search).get('local_test') === '1');
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
    console.info('checkout: submit start', { action: form.action, cartLength: cart.length, isLocalTest });

        // Normalize delivery time to 24h before submission
        const timeEl = form.querySelector('[name="delivery_time"]');
        if(timeEl){
            timeEl.value = normalizeTo24(timeEl.value || '');
        }

        // Recompute delivery before submitting to ensure free-shipping is applied
        const communeVal = (form.commune && form.commune.value) ? form.commune.value : '';
        try { updateDeliveryDisplay(communeVal); } catch (err) { /* ignore */ }

        // Quick validation: required fields
        if (!form.name || !form.phone || !form.address) {
            console.warn('checkout: required fields missing on the form element (name/phone/address)');
        }

        // Prépare le résumé de la commande
        const cartSummary = cart.map(item => {
            const product = FD_PRODUCTS.find(p => p.id === item.id);
            return `${product.name} (${item.qty}x) - ${formatPrice(product.price * item.qty)}`;
        }).join('\n');

        // Ajoute le résumé au formulaire (accès sûr aux champs optionnels)
        const orderDetails = document.createElement('input');
        orderDetails.type = 'hidden';
        orderDetails.name = 'message';

        // Helpers pour accéder aux champs qui peuvent ne pas exister
        const safe = (field) => {
            try { return field && typeof field.value !== 'undefined' ? field.value : ''; } catch (e) { return ''; }
        };
        const getText = (id) => {
            const el = document.getElementById(id);
            return el ? el.textContent : '';
        };

        const deliveryDateShort = (document.getElementById('delivery-date-short') && typeof document.getElementById('delivery-date-short').value !== 'undefined') ? document.getElementById('delivery-date-short').value : '';

        orderDetails.value = `\nRÉSUMÉ DE LA COMMANDE\n\n${cartSummary}\n\nSous-total: ${getText('co-subtotal')}\nLivraison: ${getText('co-delivery')}\nTOTAL: ${getText('co-total')}\n\nInformations client :\nNom: ${safe(form.name)}\nTéléphone: ${safe(form.phone)}\nDate de livraison: ${safe(form.delivery_date)}\nDate (jour+mois): ${deliveryDateShort}\nHeure de livraison: ${safe(form.delivery_time)}\nAdresse: ${safe(form.address)}\nCommune: ${safe(form.commune)}\n`;
        form.appendChild(orderDetails);

        // Soumet le formulaire via AJAX pour forcer la redirection vers notre page de remerciement
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const fd = new FormData(form);
        // Si on est en mode test local, simuler une réponse réussie sans réseau
        if (isLocalTest) {
            console.info('Local test mode: simulating successful submission');
            setTimeout(() => {
                // Vider le panier et rediriger comme si la soumission avait réussi
                localStorage.removeItem('fd_cart');
                const next = form.querySelector('input[name="_next"]') ? form.querySelector('input[name="_next"]').value : 'merci.html';
                // réactiver le bouton juste avant la redirection (pour UX)
                if (submitBtn) submitBtn.disabled = false;
                window.location.href = next;
            }, 400);
            return;
        }

        console.info('checkout: sending fetch to', form.action);
        fetch(form.action, {
            method: 'POST',
            body: fd,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                // rediriger vers la page de remerciement
                const next = form.querySelector('input[name="_next"]') ? form.querySelector('input[name="_next"]').value : 'merci.html';
                // Vider le panier avant la redirection
                localStorage.removeItem('fd_cart');
                window.location.href = next;
            } else {
                console.warn('checkout: fetch returned non-ok status', response.status);
                // Si la réponse n'est pas OK, tenter de récupérer le JSON pour debug,
                // puis utiliser une soumission native comme fallback (cela permettra
                // à Formspree de traiter la redirection `_next` côté serveur).
                return response.json().then(data => {
                    console.error('Formspree error', data);
                }).catch(() => {
                    console.error('Formspree returned non-OK status and body could not be parsed');
                }).finally(() => {
                    // fallback: soumission native (ne déclenche pas l'événement submit)
                    if (submitBtn) submitBtn.disabled = false;
                    try { form.submit(); } catch (err) { console.error('Fallback form.submit failed', err); }
                });
            }
        }).catch(err => {
            console.error('Network error while sending order', err);
            // En cas d'erreur réseau (CORS, file://, offline...), tenter une soumission
            // native comme fallback pour que la redirection `_next` fonctionne.
            if (submitBtn) submitBtn.disabled = false;
            try { form.submit(); } catch (err2) {
                console.error('Fallback native submit failed', err2);
                alert("Problème réseau — impossible d'envoyer la commande pour le moment.");
            }
        });
    });

    // Initialise l'affichage (protéger contre erreurs dans renderSummary)
    try {
        renderSummary();
    } catch (err) {
        console.error('Error rendering checkout summary:', err);
        // Ne pas interrompre la logique de soumission si le rendu échoue
    }
});
