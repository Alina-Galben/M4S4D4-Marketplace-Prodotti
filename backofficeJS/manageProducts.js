// Funzione per aggiungere un nuovo prodotto (POST)
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

        alert("Hai aggiunto con successo il prodotto!");
        this.reset();
    } catch (error) {
        console.error("Errore nell'aggiunta del prodotto:", error);
    }
});

// Funzione per eliminare un prodotto
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

// Funzione di ricerca nella navbar (LiveSearch)
document.getElementById('searchInput').addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    const filtered = prodottiGlobal.filter(p =>
        p.name.toLowerCase().includes(searchText) ||
        p.description.toLowerCase().includes(searchText) ||
        p.brand.toLowerCase().includes(searchText)
    );
    renderProdotti(filtered);
});
