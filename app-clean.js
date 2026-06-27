document.addEventListener("DOMContentLoaded", function () {
  var sezioni = {
    dashboard: document.getElementById("section-dashboard"),
    merchandise: document.getElementById("section-merchandise"),
    menu: document.getElementById("section-menu"),
    report: document.getElementById("section-report"),
    invoices: document.getElementById("section-invoices"),
    waste: document.getElementById("section-waste"),
    orders: document.getElementById("section-orders")
  };

  var bottoni = {
    dashboard: document.getElementById("nav-dashboard"),
    merchandise: document.getElementById("nav-merchandise"),
    menu: document.getElementById("nav-menu"),
    report: document.getElementById("nav-report"),
    invoices: document.getElementById("nav-invoices"),
    waste: document.getElementById("nav-waste"),
    orders: document.getElementById("nav-orders")
  };

  function leggiMerce() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerce(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function mostra(nome) {
    Object.keys(sezioni).forEach(function (chiave) {
      if (sezioni[chiave]) {
        sezioni[chiave].style.display = "none";
        sezioni[chiave].classList.remove("active");
        sezioni[chiave].classList.add("hidden");
      }
    });

    if (sezioni[nome]) {
      sezioni[nome].style.display = "block";
      sezioni[nome].classList.remove("hidden");
      sezioni[nome].classList.add("active");
    }

    Object.keys(bottoni).forEach(function (chiave) {
      if (bottoni[chiave]) {
        bottoni[chiave].classList.remove("active");
      }
    });

    if (bottoni[nome]) {
      bottoni[nome].classList.add("active");
    }

    if (nome === "merchandise") {
      renderMerce();
    }

    window.scrollTo(0, 0);
  }

  window.showSection = mostra;

  function creaRiga(label, valore) {
    var box = document.createElement("div");

    var span = document.createElement("span");
    span.textContent = label;

    var strong = document.createElement("strong");
    strong.textContent = valore;

    box.appendChild(span);
    box.appendChild(strong);

    return box;
  }

  function mostraVuoto(lista) {
    lista.innerHTML = "";

    var vuoto = document.createElement("div");
    vuoto.className = "empty-state";

    var titolo = document.createElement("strong");
    titolo.textContent = "Nessun prodotto inserito";

    var testo = document.createElement("div");
    testo.textContent = "Premi + Aggiungi merce per iniziare a catalogare il magazzino.";

    vuoto.appendChild(titolo);
    vuoto.appendChild(document.createElement("br"));
    vuoto.appendChild(testo);

    lista.appendChild(vuoto);
  }

  function renderMerce() {
    var lista = document.getElementById("merce-list");
    if (!lista) return;

    var merce = leggiMerce();
    lista.innerHTML = "";

    if (merce.length === 0) {
      mostraVuoto(lista);
      return;
    }

    merce.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "product-card";

      var header = document.createElement("div");
      header.className = "product-card-header";

      var left = document.createElement("div");

      var titolo = document.createElement("h3");
      titolo.textContent = item.nome || "Prodotto senza nome";

      var fornitore = document.createElement("small");
      fornitore.textContent = item.fornitore || "Fornitore non indicato";

      left.appendChild(titolo);
      left.appendChild(fornitore);

      var status = document.createElement("span");
      status.className = "status-dot status-ok";
      status.textContent = "OK";

      header.appendChild(left);
      header.appendChild(status);

      var meta = document.createElement("div");
      meta.className = "product-meta";

      meta.appendChild(creaRiga("Quantità", (item.quantita || "0") + " " + (item.unita || "")));
      meta.appendChild(creaRiga("Scadenza", item.scadenza || "Non indicata"));
      meta.appendChild(creaRiga("Soglia", (item.soglia || "0") + " " + (item.unita || "")));
      meta.appendChild(creaRiga("Posizione", item.posizione || "Non indicata"));

      card.appendChild(header);
      card.appendChild(meta);

      lista.appendChild(card);
    });
  }

  function aggiungiMerce() {
    var nome = prompt("Nome merce:");
    if (!nome) return;

    var quantita = prompt("Quantità:") || "0";
    var unita = prompt("Unità di misura: kg, g, l, pz...") || "";
    var scadenza = prompt("Scadenza formato AAAA-MM-GG oppure lascia vuoto:") || "";
    var soglia = prompt("Soglia minima:") || "0";
    var fornitore = prompt("Fornitore:") || "";
    var posizione = prompt("Posizione: frigo, freezer, scaffale...") || "";

    var merce = leggiMerce();

    merce.push({
      nome: nome,
      quantita: quantita,
      unita: unita,
      scadenza: scadenza,
      soglia: soglia,
      fornitore: fornitore,
      posizione: posizione
    });

    salvaMerce(merce);
    renderMerce();
  }

  Object.keys(bottoni).forEach(function (chiave) {
    if (bottoni[chiave]) {
      bottoni[chiave].addEventListener("click", function () {
        mostra(chiave);
      });
    }
  });

  var addMerceBtn = document.getElementById("add-merce-btn");
  if (addMerceBtn) {
    addMerceBtn.addEventListener("click", aggiungiMerce);
  }

  mostra("dashboard");
});
