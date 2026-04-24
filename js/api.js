async function pobierzKaweZAPI() {
    const kontener = document.getElementById('api-single-product');
    if (!kontener) return; 

    try {
        const odpowiedz = await fetch("https://fake-coffee-api.vercel.app/api/1");
        
        if (!odpowiedz.ok) {
            throw new Error('HTTP Error ' + odpowiedz.status); 
        }
        
        let kawa = await odpowiedz.json();
        const produkt = Array.isArray(kawa) ? kawa[0] : kawa;

        const nazwa = produkt.name ? produkt.name.replace(/'/g, "") : "Kawa z API";
        const cena = produkt.price ? parseFloat(produkt.price) : 29.99;
        const zdjecie = produkt.image_url ? produkt.image_url : "jpg/kawa/brazil/jpg_kawa_3_.jpg";

        const kartaHTML = `
            <article class="product-card" style="max-width: 350px;">
                <img src="${zdjecie}" alt="${nazwa}" class="img-fluid" style="height: 250px; object-fit: cover;">
                <div class="product-info">
                    <h3>${nazwa}</h3>
                    <div class="price" style="text-align: center">${cena.toFixed(2).replace('.', ',')} zł</div>
                    <a href="#" class="btn" onclick="dodajDoKoszyka('${nazwa}', ${cena}, '${zdjecie}'); return false;">Do koszyka</a>
                </div>
            </article>
        `;

        kontener.innerHTML = kartaHTML;

    } 
    catch (error) {
        console.error("API nie odpowiada, ładuję produkt lokalny:", error.message);
        kontener.innerHTML = `
            <article class="product-card" style="max-width: 350px;">
                <img src="jpg/kawa/brazil/jpg_kawa_3_.jpg" alt="Kawa Brazil" class="img-fluid" style="height: 250px; object-fit: cover;">
                <div class="product-info">
                    <h3>Kawa Brazil (Polecana)</h3>
                    <div class="price" style="text-align: center">29,99 zł</div>
                    <a href="#" class="btn" onclick="dodajDoKoszyka('Kawa Brazil', 29.99, 'jpg/kawa/brazil/jpg_kawa_3_.jpg'); return false;">Do koszyka</a>
                </div>
            </article>
        `;
    }
}

async function pobierzHerbateZAPI() {
    const kontener = document.getElementById('api-tea-product');
    if (!kontener) return; 

    try {
        const odpowiedz = await fetch("https://tea-api-gules.vercel.app/api");
        
        if (!odpowiedz.ok) throw new Error('Błąd HTTP: ' + odpowiedz.status);
        
        const wszystkieHerbaty = await odpowiedz.json(); 
        const wybraneHerbaty = wszystkieHerbaty.slice(0, 3);
        kontener.innerHTML = '';
        
        wybraneHerbaty.forEach(produkt => {

            const nazwa = produkt.name ? produkt.name.replace(/'/g, "") : "Egzotyczna Herbata";
            const cena = produkt.price ? parseFloat(produkt.price) : 19.99;
            const zdjecie = produkt.image ? produkt.image : "jpg/herbata/herbata liściasta/czarna/jpg_herbata_lisc_1.jpg";

            const kartaHTML = `
                <article class="product-card">
                    <img src="${zdjecie}" alt="${nazwa}" class="img-fluid" style="height: 250px; object-fit: cover;">
                    <div class="product-info">
                        <h3>${nazwa}</h3>
                        <div class="price" style="text-align: center">${cena.toFixed(2).replace('.', ',')} zł</div>
                        <a href="#" class="btn" onclick="dodajDoKoszyka('${nazwa}', ${cena}, '${zdjecie}'); return false;">Do koszyka</a>
                    </div>
                </article>
            `;
            kontener.insertAdjacentHTML('beforeend', kartaHTML);
        });
    }
    
    catch (error) {
        console.error("Problem z API Herbat:", error.message);
    const awaryjneHerbaty = [
            {
                nazwa: "Herbata Czarna",
                cena: 15.99,
                zdjecie: "jpg/herbata/herbata liściasta/czarna/jpg_herbata_lisc_1.jpg"
            },
            {
                nazwa: "Herbata Zielona",
                cena: 16.99,
                zdjecie: "jpg/herbata/herbata liściasta/zielona/jpg_herbata_lisc_z_1.jpg"
            },
            {
                nazwa: "Earl Grey",
                cena: 17.99,
                zdjecie: "jpg/herbata/herbata liściasta/earlgrey/jpg_herbata_earlgrey_1.jpg"
            }
        ];

        kontener.innerHTML = '';
        awaryjneHerbaty.forEach(herbata => {
            kontener.insertAdjacentHTML('beforeend', `
                <article class="product-card">
                    <img src="${herbata.zdjecie}" alt="${herbata.nazwa}" class="img-fluid" style="height: 250px; object-fit: cover;">
                    <div class="product-info">
                        <h3>${herbata.nazwa}</h3>
                        <div class="price" style="text-align: center">${herbata.cena.toFixed(2).replace('.', ',')} zł</div>
                        <a href="#" class="btn" onclick="dodajDoKoszyka('${herbata.nazwa}', ${herbata.cena}, '${herbata.zdjecie}'); return false;">Do koszyka</a>
                    </div>
                </article>
            `);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    pobierzKaweZAPI();
    pobierzHerbateZAPI();
});
