// test api
async function pobierzKaweZAPI() {
    const kontener = document.getElementById('api-single-product');
    if (!kontener) return; 

    try {
        const odpowiedz = await fetch("https://fake-coffee-api.vercel.app/api/1");
        
        // Zabezpieczenie z Wykładu 4: Zawsze sprawdzamy response.ok!
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
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">${produkt.description ? produkt.description.substring(0, 50) + '...' : 'Świeżo palona kawa z importu'}</p>
                    <div class="price" style="text-align: center">${cena.toFixed(2).replace('.', ',')} zł</div>
                    <a href="#" class="btn" onclick="dodajDoKoszyka('${nazwa}', ${cena}, '${zdjecie}'); return false;">Do koszyka</a>
                </div>
            </article>
        `;

        kontener.innerHTML = kartaHTML;

    } catch (error) {
        // Blok catch uruchomi się, gdy wystąpi błąd HTTP (np. 500) lub błąd sieci
        console.error("API nie odpowiada, ładuję produkt lokalny:", error.message);
        
        // PLAN AWARYJNY: Podmieniamy zawartość na Twój działający produkt z dysku
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

async function pobierzHerbateZAPI() {
    const kontener = document.getElementById('api-tea-product');
    if (!kontener) return; 

    try {
        // UWAGA: Upewnij się, że podajesz dokładny link do danych! 
        // Czasami trzeba dopisać np. /api/teas na końcu.
        const odpowiedz = await fetch("https://corsproxy.io/?https://teaapi.netlify.app/api");
        
        if (!odpowiedz.ok) throw new Error('Błąd HTTP: ' + odpowiedz.status);
        
        const wszystkieHerbaty = await odpowiedz.json(); 
        
        // PODPOWIEDŹ DEBUGOWANIA: Odznacz poniższą linijkę, żeby zobaczyć w konsoli (F12) 
        // jak dokładnie nazywają się pola (name, price, image) w tym API!
        // console.log("Dane z API Herbaty:", wszystkieHerbaty);

        // Wybieramy 3 pierwsze herbaty
        const wybraneHerbaty = wszystkieHerbaty.slice(0, 3);
        kontener.innerHTML = '';

        wybraneHerbaty.forEach(produkt => {
            // Tutaj musisz dopasować 'produkt.name', 'produkt.price' do tego, co zwraca API
            const nazwa = produkt.name ? produkt.name.replace(/'/g, "") : "Egzotyczna Herbata";
            const cena = produkt.price ? parseFloat(produkt.price) : 19.99;
            
            // Jesli API nie ma zdjęć, dajemy Twoje awaryjne zdjęcie herbaty
            const zdjecie = produkt.image ? produkt.image : "jpg/herbata/herbata liściasta/czarna/jpg_herbata_lisc_1.jpg";

            const kartaHTML = `
                <article class="product-card">
                    <img src="${zdjecie}" alt="${nazwa}" class="img-fluid" style="height: 250px; object-fit: cover;">
                    <div class="product-info">
                        <h3>${nazwa}</h3>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">${produkt.description ? produkt.description.substring(0, 50) + '...' : 'Świeżo sprowadzana herbata liściasta'}</p>
                        <div class="price" style="text-align: center">${cena.toFixed(2).replace('.', ',')} zł</div>
                        <a href="#" class="btn" onclick="dodajDoKoszyka('${nazwa}', ${cena}, '${zdjecie}'); return false;">Do koszyka</a>
                    </div>
                </article>
            `;

            kontener.insertAdjacentHTML('beforeend', kartaHTML);
        });

    } catch (error) {
        console.error("Problem z API Herbat:", error.message);
        
        // PLAN AWARYJNY: 3 lokalne herbaty w razie awarii API
        kontener.innerHTML = '';
        for(let i=0; i<3; i++) {
             kontener.insertAdjacentHTML('beforeend', `
                <article class="product-card">
                    <img src="jpg/herbata/herbata liściasta/czarna/jpg_herbata_lisc_1.jpg" alt="Herbata Czarna" class="img-fluid" style="height: 250px; object-fit: cover;">
                    <div class="product-info">
                        <h3>Herbata Czarna (Awaryjna)</h3>
                        <div class="price" style="text-align: center">15,99 zł</div>
                        <a href="#" class="btn" onclick="dodajDoKoszyka('Herbata Czarna (Awaryjna)', 15.99, 'jpg/herbata/herbata liściasta/czarna/jpg_herbata_lisc_1.jpg'); return false;">Do koszyka</a>
                    </div>
                </article>
            `);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    pobierzKaweZAPI();
    pobierzHerbateZAPI();
});
