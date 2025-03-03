// Fare la GET al apiURL
// Fare la POST per aggiungere nuovi prodotti al apiURL
// Reindirizzare i prodotti e creare il tamplate della pagina home (index.html)
// Creare la funzione di ricerca del prodotto collegato con search della navbar
// Creare la pagina dettagli con query params
// Salvare il carrello in local storage per poterlo utilizzare su tutte le pagine del progetto

const apiURL = "https://striveschool-api.herokuapp.com/api/product/";
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JkZWIyZjFlMTQwNjAwMTUzMTRkMTkiLCJpYXQiOjE3NDA2NzI1NjcsImV4cCI6MTc0MTg4MjE2N30.qHsk9dZ-QSR9I1kRyr8uFOZzlQ0K38BbwwBZJojQRvY";

function updateCartUI() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCountElements = document.querySelectorAll("#cartCount");

    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountElements.forEach(element => {
        element.textContent = `(${totalItems})`;
    });
}

const mySpinner = document.getElementById('mySpinner');

// Funzione asincrona per ottenere i prodotti, Metodo GET con Async/Await
async function fetchProducts() {
    try {
        mySpinner.classList.remove('d-none');

        // Fetch Api per recuperare i prodotti dal server
        const response = await fetch(apiURL, {
            headers: { Authorization: token }
        });

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const apiProducts = await response.json();
        console.log("Prodotti ricevuti dal API:", apiProducts);

        // Array locale dei prodotti
        const localProducts = [
            {
                id: "p1",
                name: "Mouse Gaming",
                description: "Mouse ergonomico con sensore da 16000 DPI",
                brand: "Razer",
                imageUrl: "https://m.media-amazon.com/images/I/61lCLrCtuhL._AC_UF894,1000_QL80_.jpg",
                price: 89
            },
            {
                id: "p2",
                name: "Cuffie Over-Ear",
                description: "Cuffie con cancellazione attiva del rumore",
                brand: "Bose",
                imageUrl: "https://media-assets.wired.it/photos/66f6af4f85c2bd72a684eb1c/4:3/w_1600,h_1200,c_limit/cuffie%20over%20ear.jpg",
                price: 249
            },
            {
                id: "p3",
                name: "Sedia Gaming",
                description: "Sedia ergonomica con supporto lombare regolabile",
                brand: "DXRacer",
                imageUrl: "https://m.media-amazon.com/images/I/61lwK5dqbmL._AC_UF894,1000_QL80_.jpg",
                price: 329
            },
            {
                id: "p4",
                name: "Zaino per Laptop",
                description: "Zaino impermeabile con scomparto per laptop 15 pollici",
                brand: "Samsonite",
                imageUrl: "https://m.media-amazon.com/images/I/81Hh9zPCLwL.jpg",
                price: 69
            },
            {
                id: "p5",
                name: "Power Bank 20000mAh",
                description: "Caricabatterie portatile con ricarica rapida",
                brand: "Anker",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0hyHUF_xFr-gnxtdeuiAt-UnWMKIbVQfuLA&s",
                price: 49
            },
            {
                id: "p6",
                name: "Fotocamera Mirrorless",
                description: "Fotocamera professionale con obiettivo 18-55mm",
                brand: "Canon",
                imageUrl: "https://www.resetdigitale.it/118011-thickbox_default/fotocamera-mirrorless-canon-rp-24-240mm.jpg",
                price: 1299
            },
        ];

        // Evittare duplicazioni: bisogna filtrare i prodotti locali gia presenti
        const allProducts = [...apiProducts];
        localProducts.forEach(localProduct => {
            if (!allProducts.some(apiProduct => apiProduct.name === localProduct.name)) {
                allProducts.push(localProduct);
            }
        });
        console.log("Lista completta dei prodotti (senza duplicati):", allProducts);

        // Assicurarsi che ogni prodotto ha un ID univoco
        allProducts.forEach((product, index) => {
            if (!product.id) {
                product.id = `costum_${index + 1}`;
            }
        });

        // Salvare i prodotti in localStorage (utile per dettagli.js)
        localStorage.setItem("products", JSON.stringify(allProducts));

        // Visualizza i prodotti nella pagina
        displayProducts(allProducts);

        mySpinner.classList.add('d-none');

    } catch (error) {
        console.error("Errore nella fetch:", error);
        mySpinner.classList.add('d-none');
    }
}

if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
}
let cart = JSON.parse(localStorage.getItem("cart"));

// Chiamata alla funzione quando la pagina si carica
fetchProducts();

products.forEach(async (product) => {
    try {
        console.log("Inviando prodotto:", product);
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        console.log("Prodotto aggiunto con successo:", data);
        fetchProducts();
    } catch (err) {
        console.error("Errore nella richiesta POST:", err);
    }
});

function displayProducts(products) {
    console.log("Lista prodotti ricevuti da displayProducts():", products);
    const container = document.getElementById("productContainer");

    if (!container) {
        console.error("❌ Errore: #productContainer non trovato!");
        return;
    }

    if (!Array.isArray(products) || products.length === 0) {
        console.error("Nessun prodotto disponibile!");
        container.innerHTML = "<p>Nessun prodotto disponibile.</p>";
        return;
    }

    container.innerHTML = ""; // Svuotiamo il contenitore prima di popolarlo

    products.forEach(product => {
        console.log("Aggiungendo prodotto:", product.name);

        const colDiv = document.createElement("div");
        colDiv.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        if (cart.some(item => item.id === product.id)) {
            cardDiv.classList.add("highlight");
        }

        const img = document.createElement("img");
        img.src = product.imageUrl;
        img.alt = product.name;
        img.classList.add("card-img-top");

        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");

        const title = document.createElement("h6");
        title.classList.add("card-title");
        title.textContent = product.name;

        const price = document.createElement("p");
        price.classList.add("card-text");
        price.textContent = product.price + "€";

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("buttons-container");

        const cartButton = document.createElement("button");
        cartButton.classList.add("btn", "btn-sm", "btn-primary");
        cartButton.textContent = "Carrello";
        cartButton.onclick = () => addToCart(product);

        const detailsButton = document.createElement("button");
        detailsButton.classList.add("btn", "btn-info");
        detailsButton.textContent = "Dettagli";
        detailsButton.onclick = () => viewDetails(product.id);

        buttonContainer.append(cartButton, detailsButton);
        cardBodyDiv.append(title, price, buttonContainer);
        cardDiv.append(img, cardBodyDiv);
        colDiv.appendChild(cardDiv);
        container.appendChild(colDiv);
    });
}

// Funzione per reindirizzare alla pagina dei dettagli
function viewDetails(productId) {
    if (productId) {
        console.log("Reindirizzamento a dettagli.html con ID:", productId);
        window.location.href = `dettagli.html?id=${productId}`;
    } else {
        console.error("Errore: ID prodotto non definito.");
    }
}

// Funzione di ricerca
document.getElementById("searchInput").addEventListener("keyup", function () {
    let query = this.value.toLowerCase().trim();
    let productCards = document.querySelectorAll(".card");

    productCards.forEach(card => {
        let titleElement = card.querySelector(".card-title");
        let parentCol = card.closest(".col-lg-2, .col-md-3, .col-sm-6, .col-lg-3, .col-md-4");

        if (titleElement && parentCol) {
            let title = titleElement.innerText.toLowerCase();

            // Se il titolo contiene il testo cercato, mostra la card, altrimenti la nasconde
            if (query.length >= 2 && title.includes(query)) {
                parentCol.style.display = "block";
            } else {
                parentCol.style.display = "none";
            }
        }
    });
});


// Funzione per il carrello
// Aggiungere prodotto al carrello
function addToCart(product) {
    let productInCart = cart.find(p => p.id === product._id);

    if (productInCart) {
        productInCart.quantity++;
    } else {
        cart.push({
            id: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
    highlightProduct(product._id, true);
}

// Evidenziare la card quando il prodotto è nel carrello
function highlightProduct(productId, addHighlight) {
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        let title = card.querySelector(".card-title").textContent;
        let found = cart.find(p => p.name === title);
        if (found) {
            card.classList.add("highlight");
        } else {
            card.classList.remove("highlight");
        }
    });
}

// Aggiornare il carrello nell'interfaccia
function updateCartUI() {
    let cartContainer = document.getElementById("cartContainer");
    let cartCount = document.getElementById("cartCount");

    // Svuota il contenitore del carrello
    while (cartContainer.firstChild) {
        cartContainer.removeChild(cartContainer.firstChild);
    }

    if (cart.length === 0) {
        let emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Il carrello è vuoto.";
        cartContainer.appendChild(emptyMessage);
        cartCount.textContent = "0";
        return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(p => {
        totalItems += p.quantity;
        totalPrice += p.price * p.quantity;

        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        let itemText = document.createElement("span");
        itemText.textContent = p.name + " - " + p.price + "€ x " + p.quantity;

        let buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("cart-buttons");

        let decreaseButton = document.createElement("button");
        decreaseButton.textContent = "-";
        decreaseButton.onclick = () => decreaseQuantity(p.id);

        let increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.onclick = () => increaseQuantity(p.id);

        let removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.onclick = () => removeFromCart(p.id);

        // Costruzione degli elementi
        buttonsContainer.append(decreaseButton, increaseButton, removeButton);
        cartItem.append(itemText, buttonsContainer);
        cartContainer.appendChild(cartItem);
    });

    // Totale della spesa
    let totalDisplay = document.createElement("p");
    totalDisplay.textContent = "Totale: " + totalPrice.toFixed(2) + "€";
    totalDisplay.id = "cartTotal";

    // Bottone per svuotare il carrello
    let clearButton = document.createElement("button");
    clearButton.textContent = "Svuota Carrello";
    clearButton.onclick = clearCart;

    // Aggiungere elementi al carrello
    cartContainer.appendChild(totalDisplay);
    cartContainer.appendChild(clearButton);

    cartCount.textContent = totalItems;
}

// Rimuovere prodotto dal carrello
function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
    highlightProduct(id, false);
}

// Diminuire quantità
function decreaseQuantity(id) {
    let product = cart.find(p => p.id === id);
    if (product.quantity > 1) {
        product.quantity--;
    } else {
        removeFromCart(id);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

// Aumentare quantità
function increaseQuantity(id) {
    let product = cart.find(p => p.id === id);
    product.quantity++;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

// Svuotare completamente il carrello
function clearCart() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
    highlightProduct(null, false);
}

// Aggiornare UI all'avvio della pagina
window.onload = function () {
    updateCartUI();
}

