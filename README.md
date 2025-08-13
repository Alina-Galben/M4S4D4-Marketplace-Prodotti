# 🛒 Marketplace Prodotti


Un piccolo marketplace didattico sviluppato durante il corso EPICODE per esercitarsi con le **fetch API** e la gestione di operazioni **CRUD** verso l’endpoint protetto di Strive School.



## 🧾 Contenuti del progetto

* `index.html` + `script.js`: **catalogo prodotti** (lista/lettura)
* `dettagli.html` + `dettagli.js`: **scheda prodotto** (lettura di un singolo elemento)
* `backoffice.html` + `backoffice.js` (e cartella `backofficeJS/` se presente): **backoffice** per **creare, modificare, eliminare** prodotti
* `style.css`, `backoffice.css`: stili di base

I file elencati sono quelli presenti nella repository e rappresentano le 3 aree principali: **Catalogo**, **Dettaglio**, **Backoffice**.

----

## Funzionalità

* Visualizzazione **catalogo** con card dei prodotti
* Visualizzazione **dettaglio** con informazioni estese
* Backoffice: form per **creare**, **modificare** e **eliminare** prodotti
* Gestione **stati di caricamento** ed errori base

----

## Requisiti

* Browser moderno (Chrome/Edge/Firefox)
* Connessione Internet
* **Token JWT Strive School** valido

---

## **Nota importante (token richiesto)**
> - Per poter visualizzare e gestire i prodotti devi autenticarti su **Strive School** e usare il **token JWT** nelle pagine del progetto (vedi sezione **Dove inserire il token**).


## Come ottenere il token JWT da Strive School

> 1. Apri **[https://strive.school/studentlogin](https://strive.school/studentlogin)**
> 2. Effettua **il login** con le tue credenziali
> 3. Copia l’intero token (stringa lunga con puntini `xxx.yyy.zzz`)

---

## Come avviare in locale

1. **Clona** o **scarica** questa repository
2. Apri `index.html` direttamente nel browser (doppio clic) oppure servi il progetto con una estensione tipo *Live Server* (VS Code)
3. Inserisci il **token JWT** nei file elencati in **Dove inserire il token**

> Non è necessario un backend locale: il progetto chiama l’API remota di Strive School.


---

## Dove inserire il token

Il token va incluso nell’header **Authorization** delle fetch come `Bearer <IL_TUO_TOKEN>`.

Nel progetto, i punti tipici dove inserire/sostituire il token sono:

1. **`script.js`** (lista prodotti su `index.html`)
2. **`dettagli.js`** (dettaglio prodotto su `dettagli.html`)
3. **`backoffice.js`** (CRUD su `backoffice.html` e/o nella cartella `backofficeJS/`)

Cerca nei file le stringhe: `const token = "Bearer ....`, oppure blocchi `fetch(...)`.


### Esempio di inserimento

```js
// In cima al file (es. script.js / dettagli.js / backoffice.js)
const token = "Bearer INSERISCI_QUI_IL_TUO_TOKEN";

// E dentro le fetch
fetch(API_URL, {
  headers: {
    "Authorization": token,
  }
});
```

---

## Problemi comuni

* **401 Unauthorized** → token mancante/scaduto/sbagliato
* **404 Not Found** → URL o `id` errato
* **CORS** → apri via *Live Server* o estensione che serve i file su `http://localhost`

---

## Licenza

- Progetto open source, creato a scopo formativo.
- Sentiti libero di clonarlo, modificarlo o contribuire! 🌟

---

## Autore

**Alina Galben** – Frontend/Full‑stack Student @ EPICODE
