const originalOrders = new Map();

document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', performSort);
    }
});

function performSort() {
    const sortSelect = document.getElementById('sort-select');
    const sortBy = sortSelect ? sortSelect.value : 'default';

    const grids = document.querySelectorAll('.products-grid');

    grids.forEach(grid => {
        let products = Array.from(grid.querySelectorAll('.product-card'));
        
        if (products.length === 0) return;

        if (!originalOrders.has(grid)) {
            originalOrders.set(grid, [...products]);
        }

        if (sortBy === 'default') {
            products = [...originalOrders.get(grid)];
        } else {
            products.sort((a, b) => {
                const nameA = a.querySelector('h3').innerText.toLowerCase();
                const nameB = b.querySelector('h3').innerText.toLowerCase();

                const priceTextA = a.querySelector('.price').innerText.replace(',', '.');
                const priceTextB = b.querySelector('.price').innerText.replace(',', '.');
              
                const priceMatchA = priceTextA.match(/\d+\.\d+/);
                const priceMatchB = priceTextB.match(/\d+\.\d+/);
                
                const priceA = priceMatchA ? parseFloat(priceMatchA[0]) : 0;
                const priceB = priceMatchB ? parseFloat(priceMatchB[0]) : 0;

                if (sortBy === 'alpha-asc') return nameA.localeCompare(nameB);
                if (sortBy === 'alpha-desc') return nameB.localeCompare(nameA);
                if (sortBy === 'price-asc') return priceA - priceB;
                if (sortBy === 'price-desc') return priceB - priceA;
            });
        }

        products.forEach(product => grid.appendChild(product));
    });
}
