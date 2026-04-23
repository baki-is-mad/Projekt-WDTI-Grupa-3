let productToRemoveId = null;

const deliveryCost = 15.00;

function changeQuantity(productId, delta) {
    const productRow = document.getElementById(productId);
    if (!productRow) return;

    const input = productRow.querySelector('.qty-input');
    let currentQty = parseInt(input.value);

    if (delta === -1 && currentQty === 1) {
        showModal(productId);
        return;
    }

    let newQty = currentQty + delta;
    if (newQty < 1) newQty = 1; 
    
    input.value = newQty;
    updateCartTotals(); 
}

function removeProduct(productId) {
    showModal(productId);
}

function showModal(productId) {
    productToRemoveId = productId;
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.style.display = 'flex'; 
    }
}

function hideModal() {
    productToRemoveId = null;
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

const confirmBtn = document.getElementById('confirm-btn');
if (confirmBtn) {
    confirmBtn.addEventListener('click', function() {
        if (productToRemoveId) {
            const productRow = document.getElementById(productToRemoveId);
            if (productRow) {
                productRow.remove(); 
            }
            updateCartTotals(); 
            hideModal(); 
        }
    });
}

const cancelBtn = document.getElementById('cancel-btn');
if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
        hideModal();
    });
}

const deleteModal = document.getElementById('delete-modal');
if (deleteModal) {
    deleteModal.addEventListener('click', function(event) {
        if (event.target === this) {
            hideModal();
        }
    });
}

function updateCartTotals() {
    let subtotal = 0;
    let totalItemsCount = 0;
    
    const productRows = document.querySelectorAll('.cart-product-row');
    const cartContainer = document.getElementById('cart-items-container');
    const summaryBox = document.querySelector('.cart-summary-box');

    if (productRows.length === 0) {
        if (cartContainer) {
            cartContainer.innerHTML = '<p class="empty-cart-msg">Brak produktów w koszyku</p>';
        }
        
        if (summaryBox) {
            summaryBox.style.display = 'none';
        }
        
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.innerText = '0';
        saveDOMToLocalStorage();
        return; 
    }

    if (summaryBox) {
        summaryBox.style.display = 'block';
    }

    productRows.forEach(row => {
        const qtyInput = row.querySelector('.qty-input');
        const unitPriceSpan = row.querySelector('.unit-price');
        
        if (qtyInput && unitPriceSpan) {
            const qty = parseInt(qtyInput.value);
            const price = parseFloat(unitPriceSpan.getAttribute('data-price'));
            
            subtotal += (qty * price);
            totalItemsCount += qty;
        }
    });

    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = totalItemsCount;
    
    const subtotalVal = document.getElementById('subtotal-val');
    if (subtotalVal) subtotalVal.innerText = formatPrice(subtotal);

    let currentDeliveryCost = 0;
    const deliveryVal = document.getElementById('delivery-val');
    
    if (totalItemsCount > 0) {
        currentDeliveryCost = deliveryCost;
        if (deliveryVal) deliveryVal.innerText = formatPrice(currentDeliveryCost);
    } else {
        if (deliveryVal) deliveryVal.innerText = formatPrice(0);
    }

    const total = subtotal + currentDeliveryCost;
    const totalVal = document.getElementById('total-val');
    if (totalVal) totalVal.innerText = formatPrice(total);
    saveDOMToLocalStorage();
}

function formatPrice(number) {
    return number.toFixed(2).replace('.', ',') + ' zł';
}

document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }
});

function openCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    const finalTotal = document.getElementById('final-total');
    const totalVal = document.getElementById('total-val');
    
    if (checkoutModal && finalTotal && totalVal) {
        finalTotal.innerText = totalVal.innerText;
        checkoutModal.style.display = 'block';
    }
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
    }
}

window.addEventListener('click', function(event) {
    const checkoutModal = document.getElementById('checkoutModal');
    if (event.target === checkoutModal) {
        closeCheckout();
    }
});

function processOrder(event) {
    event.preventDefault();
    alert('Dziękujemy za zamówienie!');
    zapiszKoszyk([]);
    renderujWizualnyKoszyk();
    updateCartTotals();
    closeCheckout();
}

function pobierzKoszyk() {
    const koszyk = localStorage.getItem('aromalab_koszyk');
    return koszyk ? JSON.parse(koszyk) : [];
}

function zapiszKoszyk(koszyk) {
    localStorage.setItem('aromalab_koszyk', JSON.stringify(koszyk));
    updateCartBadge(); 
}

function dodajDoKoszyka(nazwa, cena, zdjecie) {
    const koszyk = pobierzKoszyk();
    const istniejacy = koszyk.find(item => item.nazwa === nazwa);
    
    if (istniejacy) {
        istniejacy.ilosc += 1;
    } else {
        const unikalneId = 'prod-' + Date.now();
        koszyk.push({ id: unikalneId, nazwa: nazwa, cena: cena, zdjecie: zdjecie, ilosc: 1 });
    }
    zapiszKoszyk(koszyk);
    alert('Dodano: ' + nazwa + ' do koszyka!');
}

function updateCartBadge() {
    const koszyk = pobierzKoszyk();
    const totalItems = koszyk.reduce((suma, p) => suma + p.ilosc, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = totalItems;
}

function renderujWizualnyKoszyk() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const koszyk = pobierzKoszyk();
    container.innerHTML = '';

    koszyk.forEach(produkt => {
        const row = document.createElement('div');
        row.className = 'cart-product-row';
        row.id = produkt.id;

        row.innerHTML = `
            <img src="${produkt.zdjecie}" alt="${produkt.nazwa}" class="cart-img">
            <div class="cart-details">
                <h4>${produkt.nazwa}</h4>
                <span class="unit-price" data-price="${produkt.cena}">${formatPrice(produkt.cena)}</span>
            </div>
            <div class="quantity-wrapper">
                <button class="qty-btn" onclick="changeQuantity('${produkt.id}', -1)">-</button>
                <input type="number" value="${produkt.ilosc}" readonly class="qty-input">
                <button class="qty-btn" onclick="changeQuantity('${produkt.id}', 1)">+</button>
            </div>
            <div class="remove-item">
                <i class="fa-solid fa-trash-can" onclick="removeProduct('${produkt.id}')"></i>
            </div>
        `;
        container.appendChild(row);
    });
}

function saveDOMToLocalStorage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const rows = document.querySelectorAll('.cart-product-row');
    const nowyKoszyk = [];
    
    rows.forEach(row => {
        const id = row.id;
        const nazwa = row.querySelector('h4').innerText;
        const zdjecie = row.querySelector('.cart-img').getAttribute('src');
        const cena = parseFloat(row.querySelector('.unit-price').getAttribute('data-price'));
        const ilosc = parseInt(row.querySelector('.qty-input').value);
        
        nowyKoszyk.push({ id: id, nazwa: nazwa, cena: cena, zdjecie: zdjecie, ilosc: ilosc });
    });
    
    zapiszKoszyk(nowyKoszyk);
}

// test api
async function pobierzKaweZAPI() {
    // Szukamy naszego kontenera w HTML
    const kontener = document.getElementById('api-single-product');
    if (!kontener) return; // Przerywamy, jeśli jesteśmy na stronie, która go nie ma

    try {
        // Zgodnie z Twoim screenem - pobieramy jeden produkt
        const odpowiedz = await fetch("https://fake-coffee-api.vercel.app/api/1");
        
        // Zawsze sprawdzamy, czy odpowiedź jest prawidłowa (status 200-299)
        if (!odpowiedz.ok) {
            throw new Error(`Błąd HTTP: ${odpowiedz.status}`); 
        }
        
        // Zmieniamy odpowiedź z serwera na obiekt JavaScript
        let kawa = await odpowiedz.json();
        
        // Niektóre API przy zapytaniu o ID zwracają obiekt w tablicy (np. [{...}]). 
        // Poniższa linijka upewnia się, że pracujemy na samym obiekcie produktu.
        const produkt = Array.isArray(kawa) ? kawa[0] : kawa;

        // Wyciągamy dane z API (nazwę, cenę, zdjęcie)
        // Używamy replace() aby usunąć apostrofy, które mogłyby popsuć przycisk
        const nazwa = produkt.name ? produkt.name.replace(/'/g, "") : "Kawa Specialty z API";
        const cena = produkt.price ? parseFloat(produkt.price) : 29.99;
        const zdjecie = produkt.image_url ? produkt.image_url : "jpg/kawa/brazil/jpg_kawa_3_.jpg";

        // Budujemy kafelek używając Twoich klas CSS i funkcji koszyka
        const kartaHTML = `
            <article class="product-card" style="max-width: 350px;">
                <img src="${zdjecie}" alt="${nazwa}" class="img-fluid" style="height: 250px; object-fit: cover;">
                <div class="product-info">
                    <h3>${nazwa}</h3>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">${produkt.description ? produkt.description.substring(0, 50) + '...' : 'Świeżo palona kawa'}</p>
                    <div class="price" style="text-align: center">${cena.toFixed(2).replace('.', ',')} zł</div>
                    <a href="#" class="btn" onclick="dodajDoKoszyka('${nazwa}', ${cena}, '${zdjecie}'); return false;">Do koszyka</a>
                </div>
            </article>
        `;

        // Podmieniamy tekst "Pobieranie..." na gotowy kafelek
        kontener.innerHTML = kartaHTML;

    } 
    catch (error) {
        // Logujemy prawdziwy błąd tylko dla nas do konsoli (dla debugowania)
        console.error("Błąd API, używam planu awaryjnego:", error.message);
        
        // W razie błędu "ratujemy" układ strony i wyświetlamy lokalny produkt!
        kontener.innerHTML = `
            <article class="product-card" style="max-width: 350px;">
                <img src="jpg/kawa/brazil/jpg_kawa_3_.jpg" alt="Kawa Brazil" class="img-fluid" style="height: 250px; object-fit: cover;">
                <div class="product-info">
                    <h3>Kawa Brazil (Polecana)</h3>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">Najlepsza jakość prosto z naszej palarni.</p>
                    <div class="price" style="text-align: center">29,99 zł</div>
                    <a href="#" class="btn" onclick="dodajDoKoszyka('Kawa Brazil', 29.99, 'jpg/kawa/brazil/jpg_kawa_3_.jpg'); return false;">Do koszyka</a>
                </div>
            </article>
        `;
    }
}
    
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    if (document.getElementById('cart-items-container')) {
        renderujWizualnyKoszyk();
        updateCartTotals();
    }
    pobierzKaweZAPI();
});
