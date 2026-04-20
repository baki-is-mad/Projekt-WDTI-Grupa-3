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
    modal.style.display = 'flex'; 
}

function hideModal() {
    productToRemoveId = null;
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
}

document.getElementById('confirm-btn').addEventListener('click', function() {
    if (productToRemoveId) {
        const productRow = document.getElementById(productToRemoveId);
        if (productRow) {
            productRow.remove(); 
        }
        updateCartTotals(); 
        hideModal(); 
    }
});

document.getElementById('cancel-btn').addEventListener('click', function() {
    hideModal();
});

document.getElementById('delete-modal').addEventListener('click', function(event) {
    if (event.target === this) {
        hideModal();
    }
});

function updateCartTotals() {
    let subtotal = 0;
    let totalItemsCount = 0;
    
    const productRows = document.querySelectorAll('.cart-product-row');
    const cartContainer = document.getElementById('cart-items-container');
    const summaryBox = document.querySelector('.cart-summary-box');

    if (productRows.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-msg">Brak produktów w koszyku</p>';
        
        if (summaryBox) {
            summaryBox.style.display = 'none';
        }
        
        document.getElementById('cart-count').innerText = '0';
        return; 
    }

    if (summaryBox) {
        summaryBox.style.display = 'block';
    }

    productRows.forEach(row => {
        const qty = parseInt(row.querySelector('.qty-input').value);
        const price = parseFloat(row.querySelector('.unit-price').getAttribute('data-price'));
        
        subtotal += (qty * price);
        totalItemsCount += qty;
    });

    document.getElementById('cart-count').innerText = totalItemsCount;
    document.getElementById('subtotal-val').innerText = formatPrice(subtotal);

    let currentDeliveryCost = 0;
    if (totalItemsCount > 0) {
        currentDeliveryCost = deliveryCost;
        document.getElementById('delivery-val').innerText = formatPrice(currentDeliveryCost);
    } else {
        document.getElementById('delivery-val').innerText = formatPrice(0);
    }

    const total = subtotal + currentDeliveryCost;
    document.getElementById('total-val').innerText = formatPrice(total);
}

function formatPrice(number) {
    return number.toFixed(2).replace('.', ',') + ' zł';
}

document.addEventListener('DOMContentLoaded', updateCartTotals);
