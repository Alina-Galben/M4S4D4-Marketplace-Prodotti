// Funzione per aggiornare il numero di elementi nel carrello nella navbar
function updateCartUI() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCountElements = document.querySelectorAll("#cartCount");

    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountElements.forEach(element => {
        element.textContent = `(${totalItems})`;
    });
}

// Quando la pagina si carica, aggiorna subito il carrello
window.onload = function() {
    updateCartUI();

    // Ottieni il prodotto dall'URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        console.error("Errore: Nessun ID prodotto trovato nell'URL.");
        document.body.innerHTML = "<h2>Errore: Prodotto non trovato.</h2>";
        return;
    }

    // Recupera i prodotti da localStorage
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error("Errore: Prodotto non trovato.");
        document.body.innerHTML = "<h2>Errore: Prodotto non trovato.</h2>";
        return;
    }

    // Popola la pagina con i dettagli del prodotto
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productImage").src = product.imageUrl;
    document.getElementById("productPrice").textContent = product.price + "€";
    document.getElementById("productDescription").textContent = product.description;
    document.getElementById("productBrand").textContent = product.brand || "Sconosciuto";

    // Aggiungi evento per il pulsante "Aggiungi al carrello"
    document.getElementById("addToCartButton").addEventListener("click", function() {
        addToCart(product);
        alert("Prodotto aggiunto al carrello!");
        updateCartUI(); // ✅ Aggiorna subito il carrello nella navbar
    });
};

// Funzione per aggiungere un prodotto al carrello
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(p => p.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartUI(); // ✅ Aggiorna subito il carrello dopo l'aggiunta
}
