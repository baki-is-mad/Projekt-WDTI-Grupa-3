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

    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const zipInput = document.getElementById('checkout-zip');
    const cityInput = document.getElementById('checkout-city');

    const blockNumbersAndSpecial = function(e) {
        this.value = this.value.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]/g, '');
    };
    
    if(nameInput) nameInput.addEventListener('input', blockNumbersAndSpecial);
    if(cityInput) cityInput.addEventListener('input', blockNumbersAndSpecial);

    if(phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d]/g, '');
        });
    }

    if(zipInput) {
        zipInput.addEventListener('input', function(e) {
            let val = this.value.replace(/[^\d]/g, '');
            if (val.length > 2) {
                this.value = val.slice(0, 2) + '-' + val.slice(2, 5);
            } else {
                this.value = val;
            }
        });
    }

    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const detailsBlik = document.getElementById('payment-details-blik');
    const detailsCard = document.getElementById('payment-details-card');
    const detailsTransfer = document.getElementById('payment-details-transfer');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if(detailsBlik) detailsBlik.style.display = 'none';
            if(detailsCard) detailsCard.style.display = 'none';
            if(detailsTransfer) detailsTransfer.style.display = 'none';

            if (this.value === 'blik' && detailsBlik) detailsBlik.style.display = 'block';
            if (this.value === 'card' && detailsCard) detailsCard.style.display = 'block';
            if (this.value === 'transfer' && detailsTransfer) detailsTransfer.style.display = 'block';
        });
    });

    const blikCode = document.getElementById('blik-code');
    if (blikCode) {
        blikCode.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
        });
    }

    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
        });
    }

    const cardCvv = document.getElementById('card-cvv');
    if (cardCvv) {
        cardCvv.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
        });
    }

    const cardName = document.getElementById('card-name');
    if (cardName) cardName.addEventListener('input', blockNumbersAndSpecial);

    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let val = this.value.replace(/[^\d]/g, '');
            if (val.length > 2) {
                this.value = val.slice(0, 2) + '/' + val.slice(2, 4);
            } else {
                this.value = val;
            }
        });
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

    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');
    const phoneInput = document.getElementById('checkout-phone');
    const streetInput = document.getElementById('checkout-street');
    const zipInput = document.getElementById('checkout-zip');
    const cityInput = document.getElementById('checkout-city');

    let isValid = true;
    let errorMessage = "";

    const inputs = [nameInput, emailInput, phoneInput, streetInput, zipInput, cityInput, 
                    document.getElementById('blik-code'), document.getElementById('card-name'), 
                    document.getElementById('card-number'), document.getElementById('card-expiry'), 
                    document.getElementById('card-cvv'), document.getElementById('transfer-bank')];
    
    inputs.forEach(input => {
        if (input) input.style.border = "";
    });

    const lettersOnlyRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/;
    const phoneRegex = /^\d{9}$/;
    const zipRegex = /^\d{2}-\d{3}$/;

    if (!lettersOnlyRegex.test(nameInput.value.trim())) {
        isValid = false;
        errorMessage += "- Imię i nazwisko dostawy może zawierać tylko litery i spacje.\n";
        nameInput.style.border = "2px solid red";
    }

    if (!emailInput.value.includes('@')) {
        isValid = false;
        errorMessage += "- Podaj poprawny adres e-mail (musi zawierać znak @).\n";
        emailInput.style.border = "2px solid red";
    }

    if (!phoneRegex.test(phoneInput.value.trim())) {
        isValid = false;
        errorMessage += "- Numer telefonu musi składać się z dokładnie 9 cyfr.\n";
        phoneInput.style.border = "2px solid red";
    }

    if (streetInput.value.trim() === "") {
        isValid = false;
        errorMessage += "- Pole 'Ulica i numer' nie może być puste.\n";
        streetInput.style.border = "2px solid red";
    }

    if (!zipRegex.test(zipInput.value.trim())) {
        isValid = false;
        errorMessage += "- Kod pocztowy musi być w formacie 00-000.\n";
        zipInput.style.border = "2px solid red";
    }

    if (!lettersOnlyRegex.test(cityInput.value.trim())) {
        isValid = false;
        errorMessage += "- Miasto może zawierać tylko litery i spacje.\n";
        cityInput.style.border = "2px solid red";
    }

    const selectedPaymentRadio = document.querySelector('input[name="payment"]:checked');
    
    if (!selectedPaymentRadio) {
        isValid = false;
        errorMessage += "- Wybierz metodę płatności.\n";
    } else {
        const selectedPayment = selectedPaymentRadio.value;

        if (selectedPayment === 'blik') {
            const blikInput = document.getElementById('blik-code');
            if (blikInput && !/^\d{6}$/.test(blikInput.value)) {
                isValid = false;
                errorMessage += "- Kod BLIK musi składać się z dokładnie 6 cyfr.\n";
                blikInput.style.border = "2px solid red";
            }
        } else if (selectedPayment === 'card') {
            const cName = document.getElementById('card-name');
            const cNum = document.getElementById('card-number');
            const cExp = document.getElementById('card-expiry');
            const cCvv = document.getElementById('card-cvv');

            if (cName && cName.value.trim().length === 0) {
                isValid = false;
                errorMessage += "- Podaj imię i nazwisko właściciela karty.\n";
                cName.style.border = "2px solid red";
            }
            if (cNum && !/^\d{16}$/.test(cNum.value)) {
                isValid = false;
                errorMessage += "- Numer karty musi mieć 16 cyfr.\n";
                cNum.style.border = "2px solid red";
            }
            if (cExp && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cExp.value)) {
                isValid = false;
                errorMessage += "- Data ważności karty musi być w formacie MM/YY.\n";
                cExp.style.border = "2px solid red";
            }
            if (cCvv && !/^\d{3}$/.test(cCvv.value)) {
                isValid = false;
                errorMessage += "- Kod CVV musi mieć 3 cyfry.\n";
                cCvv.style.border = "2px solid red";
            }
        } else if (selectedPayment === 'transfer') {
            const tBank = document.getElementById('transfer-bank');
            if (tBank && tBank.value === "") {
                isValid = false;
                errorMessage += "- Wybierz bank do przelewu z listy.\n";
                tBank.style.border = "2px solid red";
            }
        }
    }
    if (!isValid) {
        alert("Popraw poniższe błędy:\n\n" + errorMessage);
    } else {
        alert('Dziękujemy za zamówienie! Wszystkie dane są poprawne.');
        zapiszKoszyk([]);
        renderujWizualnyKoszyk();
        updateCartTotals();
        closeCheckout();
    }
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

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    if (document.getElementById('cart-items-container')) {
        renderujWizualnyKoszyk();
        updateCartTotals();
    }
});
