const endpointAPI = "https://striveschool-api.herokuapp.com/api/product/";
const authentication = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JkZWIyZjFlMTQwNjAwMTUzMTRkMTkiLCJpYXQiOjE3NTQ3NTIwMDAsImV4cCI6MTc1NTk2MTYwMH0.oM2PCRb6ADi_J984CYSrKBTAlpa9tOFjaHNMbUqYLpo";

const resultBox = document.getElementById('tabeleProd');
const mainContainer = document.querySelector('.container-fluid.mt-4');

let prodottiGlobal = [];

// Creazione del contatore dinamico sopra la tabella
const productCounter = document.createElement('p');
productCounter.id = "productCounter";
productCounter.classList.add("text-center", "fw-bold", "mt-3");
mainContainer.insertBefore(productCounter, mainContainer.children[1]);

// Creazione del messaggio di conferma per l'aggiunta di un prodotto
const successMessage = document.createElement('p');
successMessage.id = "successMessage";
successMessage.classList.add("text-center", "text-success", "fw-bold", "d-none");
mainContainer.insertBefore(successMessage, mainContainer.children[1]);

// Funzione per recuperare i prodotti dal database
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

// Funzione per creare le righe nella tabella con i prodotti
function createRow({ _id, name, description, brand, imageUrl, price }) {
    const tableRow = document.createElement('tr');

    const celName = myTd(name);
    const celDescription = myTd(description);
    const celBrand = myTd(brand);

    // Inserisco l'immagine nella cella
    const celImage = document.createElement('td');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = name;
    img.style.width = "50px"; // Imposto la dimensione dell'immagine
    celImage.appendChild(img);

    const celPrice = myTd(price + " €");

    // Creazione pulsanti di azione
    const celAction = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.innerText = "Modifica";
    editBtn.classList.add('btn', 'btn-warning', 'btn-sm');
    editBtn.onclick = () => window.location.href = `edit.html?id=${_id}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Elimina";
    deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
    deleteBtn.onclick = () => deleteProduct(_id);

    celAction.append(editBtn, deleteBtn);
    tableRow.append(celName, celDescription, celBrand, celImage, celPrice, celAction);

    return tableRow;
}

// Funzione per creare più velocemente le celle della tabella
function myTd(text) {
    const cell = document.createElement('td');
    cell.innerText = text || '-'; // Evita celle vuote
    return cell;
}

// Funzione per aggiornare il contatore dei prodotti
function updateProductCounter() {
    productCounter.innerText = `Numero totale di prodotti: ${prodottiGlobal.length}`;
}

// Funzione per mostrare un messaggio di conferma temporaneo
function showSuccessMessage(message) {
    successMessage.innerText = message;
    successMessage.classList.remove('d-none');

    setTimeout(() => {
        successMessage.classList.add('d-none');
    }, 4000);
}

// Funzione di ricerca in tempo reale nel search input
document.getElementById('searchBar').addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    if (searchText.length >= 2) {
        const filtered = prodottiGlobal.filter(p =>
            p.name.toLowerCase().includes(searchText) ||
            p.description.toLowerCase().includes(searchText) ||
            p.brand.toLowerCase().includes(searchText)
        );
        renderProdotti(filtered);
    } else {
        renderProdotti(prodottiGlobal);
    }
});

// LiveSearch nella Navbar
document.getElementById('searchInput').addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    if (searchText.length >= 2) {
        const filtered = prodottiGlobal.filter(p =>
            p.name.toLowerCase().includes(searchText) ||
            p.description.toLowerCase().includes(searchText) ||
            p.brand.toLowerCase().includes(searchText)
        );
        renderProdotti(filtered);
    } else {
        renderProdotti(prodottiGlobal);
    }
});

// Aggiunta di un nuovo prodotto al database
document.getElementById('addProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const newProduct = {
        name: document.getElementById('newName').value.trim(),
        description: document.getElementById('newDescription').value.trim(),
        brand: document.getElementById('newBrand').value.trim(),
        imageUrl: document.getElementById('newImageUrl').value.trim(),
        price: parseFloat(document.getElementById('newPrice').value)
    };

    try {
        const response = await fetch(endpointAPI, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authentication}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const addedProduct = await response.json();
        prodottiGlobal.unshift(addedProduct);
        renderProdotti(prodottiGlobal);
        updateProductCounter();
        showSuccessMessage("Hai aggiunto con successo il prodotto!");

        this.reset(); // Pulisce il form
    } catch (error) {
        console.error("Errore nell'aggiunta del prodotto:", error);
    }
});

// Eliminazione di un prodotto
async function deleteProduct(productId) {
    if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
        try {
            const response = await fetch(`${endpointAPI}/${productId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${authentication}`
                }
            });

            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            prodottiGlobal = prodottiGlobal.filter(product => product._id !== productId);
            renderProdotti(prodottiGlobal);
            updateProductCounter();
        } catch (error) {
            console.error("Errore durante l'eliminazione del prodotto:", error);
        }
    }
}

// Caricamento iniziale dei prodotti dal database
fetchProdotti();
