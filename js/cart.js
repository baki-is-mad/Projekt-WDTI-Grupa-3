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
}

function formatPrice(number) {
    return number.toFixed(2).replace('.', ',') + ' zł';
}

document.addEventListener('DOMContentLoaded', updateCartTotals);

document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }
});
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

    const inputs = [nameInput, emailInput, phoneInput, streetInput, zipInput, cityInput];
    inputs.forEach(input => {
        if (input) input.style.border = "";
    });

    const lettersOnlyRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/;
    const phoneRegex = /^\d{9}$/;
    const zipRegex = /^\d{2}-\d{3}$/;

    if (!lettersOnlyRegex.test(nameInput.value.trim())) {
        isValid = false;
        errorMessage += "- Imię i nazwisko może zawierać tylko litery i spacje.\n";
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

    if (!isValid) {
        alert("Popraw poniższe błędy:\n\n" + errorMessage);
    } else {
        alert('Dziękujemy za zamówienie! Wszystkie dane są poprawne.');
        closeCheckout();
    }
}
