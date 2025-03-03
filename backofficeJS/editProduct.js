let editingProductId = null; // Variabile per tenere traccia del prodotto in modifica

// Funzione per caricare i dati del prodotto nel form di modifica
function loadProductForEdit(product) {
    document.getElementById('newName').value = product.name;
    document.getElementById('newDescription').value = product.description;
    document.getElementById('newBrand').value = product.brand;
    document.getElementById('newImageUrl').value = product.imageUrl;
    document.getElementById('newPrice').value = product.price;

    editingProductId = product._id; // Salviamo l'ID del prodotto in modifica

    // Cambiamo il testo del pulsante per indicare che si sta modificando un prodotto
    document.querySelector("#addProductForm button[type='submit']").innerText = "Modifica Prodotto";
}

// Modifica la funzione `createRow` in `fetchAndDisplay.js` per usare questa funzione:
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
    editBtn.onclick = () => {
        const productToEdit = prodottiGlobal.find(p => p._id === _id);
        loadProductForEdit(productToEdit);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Elimina";
    deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
    deleteBtn.onclick = () => deleteProduct(_id);

    celAction.append(editBtn, deleteBtn);
    tableRow.append(celName, celDescription, celBrand, celImage, celPrice, celAction);

    return tableRow;
}

// Funzione per modificare un prodotto esistente
document.getElementById('addProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const updatedProduct = {
        name: document.getElementById('newName').value.trim(),
        description: document.getElementById('newDescription').value.trim(),
        brand: document.getElementById('newBrand').value.trim(),
        imageUrl: document.getElementById('newImageUrl').value.trim(),
        price: parseFloat(document.getElementById('newPrice').value)
    };

    if (editingProductId) {
        // Se esiste un prodotto in modifica, facciamo una PUT per aggiornarlo
        try {
            const response = await fetch(`${endpointAPI}/${editingProductId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${authentication}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            // Aggiorniamo localmente l'array con il nuovo valore modificato
            prodottiGlobal = prodottiGlobal.map(p => 
                p._id === editingProductId ? { ...p, ...updatedProduct } : p
            );

            renderProdotti(prodottiGlobal);
            updateProductCounter();

            showSuccessMessage("Prodotto modificato con successo!");

            // Resettiamo il form e il pulsante
            this.reset();
            document.querySelector("#addProductForm button[type='submit']").innerText = "Aggiungi";
            editingProductId = null;
        } catch (error) {
            console.error("Errore nella modifica del prodotto:", error);
        }
    }
});

// Funzione per mostrare un messaggio di conferma temporaneo
function showSuccessMessage(message) {
    const successMessage = document.createElement('p');
    successMessage.classList.add("text-center", "text-success", "fw-bold");
    successMessage.innerText = message;
    document.querySelector('.container-fluid.mt-4').insertBefore(successMessage, document.querySelector('.container-fluid.mt-4').children[1]);

    setTimeout(() => {
        successMessage.remove();
    }, 4000);
}
