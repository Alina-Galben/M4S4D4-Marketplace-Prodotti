const endpointAPI = "https://striveschool-api.herokuapp.com/api/product/";
const authentication = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JkZWIyZjFlMTQwNjAwMTUzMTRkMTkiLCJpYXQiOjE3NDA0OTk3NTksImV4cCI6MTc0MTcwOTM1OX0.iYeIiB-GigxtCBtwHEx-vVbX6szRTkUbi_AT3Vau7wI";

const resultBox = document.getElementById('tabeleProd');
const productCounter = document.createElement('p');
productCounter.id = "productCounter";
productCounter.classList.add("text-center", "fw-bold", "mt-3");
document.querySelector('.container-fluid.mt-4').insertBefore(productCounter, document.querySelector('.container-fluid.mt-4').children[1]);

let prodottiGlobal = [];

// Funzione per recuperare i prodotti dal database (GET)
async function fetchProdotti() {
    try {
        const response = await fetch(endpointAPI, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authentication}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        prodottiGlobal = data;
        renderProdotti(prodottiGlobal);
        updateProductCounter();
    } catch (error) {
        console.error("Errore nel recupero dei prodotti:", error);
    }
}

// Funzione per visualizzare i prodotti
function renderProdotti(prodotti) {
    resultBox.innerHTML = '';
    const postNodes = prodotti.map(prodotto => createRow(prodotto));
    resultBox.append(...postNodes);
}

// Funzione per creare una riga della tabella
function createRow({ _id, name, description, brand, imageUrl, price }) {
    const tableRow = document.createElement('tr');

    const celName = myTd(name);
    const celDescription = myTd(description);
    const celBrand = myTd(brand);

    const celImage = document.createElement('td');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = name;
    img.style.width = "40px";
    celImage.appendChild(img);

    const celPrice = myTd(price + " €");

    const celAction = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.innerText = "Modifica";
    editBtn.classList.add('btn', 'btn-warning', 'btn-sm');
    editBtn.onclick = () => window.location.href = `edit.html?id=${_id}`;

    celAction.append(editBtn);
    tableRow.append(celName, celDescription, celBrand, celImage, celPrice, celAction);

    return tableRow;
}

// Funzione per creare celle di tabella
function myTd(text) {
    const cell = document.createElement('td');
    cell.innerText = text || '-';
    return cell;
}

// Funzione per aggiornare il contatore dei prodotti
function updateProductCounter() {
    productCounter.innerText = `Numero totale di prodotti: ${prodottiGlobal.length}`;
}

// Funzione per ricerca interna della tabella
document.getElementById('searchBar').addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    const filtered = prodottiGlobal.filter(p =>
        p.name.toLowerCase().includes(searchText) ||
        p.description.toLowerCase().includes(searchText) ||
        p.brand.toLowerCase().includes(searchText)
    );
    renderProdotti(filtered);
});

// Caricamento iniziale dei prodotti
fetchProdotti();
