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
document.addEventListener("DOMContentLoaded", function () {
  function vaiAllaSezione(idSezione, idBottone) {
    var sezione = document.getElementById(idSezione);
    if (sezione) {
      sezione.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    document.querySelectorAll("nav button").forEach(function (btn) {
      btn.classList.remove("active");
    });

    var bottone = document.getElementById(idBottone);
    if (bottone) {
      bottone.classList.add("active");
    }
  }

  var dashboard = document.getElementById("nav-dashboard");
  var merce = document.getElementById("nav-merchandise");
  var menu = document.getElementById("nav-menu");
  var report = document.getElementById("nav-report");
  var invoices = document.getElementById("nav-invoices");
  var waste = document.getElementById("nav-waste");
  var orders = document.getElementById("nav-orders");

  if (dashboard) {
    dashboard.addEventListener("click", function () {
      vaiAllaSezione("section-dashboard", "nav-dashboard");
    });
  }

  if (merce) {
    merce.addEventListener("click", function () {
      vaiAllaSezione("section-merchandise", "nav-merchandise");
    });
  }

  if (menu) {
    menu.addEventListener("click", function () {
      vaiAllaSezione("section-menu", "nav-menu");
    });
  }

  if (report) {
    report.addEventListener("click", function () {
      vaiAllaSezione("section-report", "nav-report");
    });
  }

  if (invoices) {
    invoices.addEventListener("click", function () {
      vaiAllaSezione("section-invoices", "nav-invoices");
    });
  }

  if (waste) {
    waste.addEventListener("click", function () {
      vaiAllaSezione("section-waste", "nav-waste");
    });
  }

  if (orders) {
    orders.addEventListener("click", function () {
      vaiAllaSezione("section-orders", "nav-orders");
    });
  }

  window.showSection = function (nome) {
    var mappa = {
      dashboard: ["section-dashboard", "nav-dashboard"],
      merchandise: ["section-merchandise", "nav-merchandise"],
      menu: ["section-menu", "nav-menu"],
      report: ["section-report", "nav-report"],
      invoices: ["section-invoices", "nav-invoices"],
      waste: ["section-waste", "nav-waste"],
      orders: ["section-orders", "nav-orders"]
    };

    if (mappa[nome]) {
      vaiAllaSezione(mappa[nome][0], mappa[nome][1]);
    }
  };
});
document.addEventListener("DOMContentLoaded", function () {
  var addBtn = document.getElementById("add-merce-btn");
  var cancelBtn = document.getElementById("cancel-merce-btn");
  var form = document.getElementById("merce-form");
  var list = document.getElementById("merce-list");

  function leggiMerceForm() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceForm(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function creaRiga(label, valore) {
    var box = document.createElement("div");
    var span = document.createElement("span");
    var strong = document.createElement("strong");

    span.textContent = label;
    strong.textContent = valore;

    box.appendChild(span);
    box.appendChild(strong);

    return box;
  }

  function renderMerceForm() {
    if (!list) return;

    var merce = leggiMerceForm();
    list.innerHTML = "";

    if (merce.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<strong>Nessun prodotto inserito</strong><br>Premi + Aggiungi merce per iniziare a catalogare il magazzino.";
      list.appendChild(empty);
      return;
    }

    merce.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "product-card";

      var header = document.createElement("div");
      header.className = "product-card-header";

      var left = document.createElement("div");
      var title = document.createElement("h3");
      var supplier = document.createElement("small");

      title.textContent = item.nome || "Prodotto senza nome";
      supplier.textContent = item.fornitore || "Fornitore non indicato";

      left.appendChild(title);
      left.appendChild(supplier);

      var badge = document.createElement("span");
      badge.className = "status-dot status-ok";
      badge.textContent = "OK";

      header.appendChild(left);
      header.appendChild(badge);

      var meta = document.createElement("div");
      meta.className = "product-meta";

      meta.appendChild(creaRiga("Quantità", (item.quantita || "0") + " " + (item.unita || "")));
      meta.appendChild(creaRiga("Scadenza", item.scadenza || "Non indicata"));
      meta.appendChild(creaRiga("Soglia", (item.soglia || "0") + " " + (item.unita || "")));
      meta.appendChild(creaRiga("Posizione", item.posizione || "Non indicata"));

      card.appendChild(header);
      card.appendChild(meta);
      list.appendChild(card);
    });
  }

  if (addBtn && form) {
    addBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      form.classList.remove("hidden-form");
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }, true);
  }

  if (cancelBtn && form) {
    cancelBtn.addEventListener("click", function () {
      form.reset();
      form.classList.add("hidden-form");
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var merce = leggiMerceForm();

      merce.push({
        nome: document.getElementById("merce-nome").value,
        quantita: document.getElementById("merce-quantita").value || "0",
        unita: document.getElementById("merce-unita").value || "",
        scadenza: document.getElementById("merce-scadenza").value || "",
        soglia: document.getElementById("merce-soglia").value || "0",
        fornitore: document.getElementById("merce-fornitore").value || "",
        posizione: document.getElementById("merce-posizione").value || ""
      });

      salvaMerceForm(merce);
      form.reset();
      form.classList.add("hidden-form");
      renderMerceForm();
    });
  }

  renderMerceForm();
});
document.addEventListener("DOMContentLoaded", function () {
  var list = document.getElementById("merce-list");
  var form = document.getElementById("merce-form");
  var search = document.getElementById("merce-search");

  function leggiMerceAvanzata() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceAvanzata(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function giorniAllaScadenza(data) {
    if (!data) return null;
    var oggi = new Date();
    var scadenza = new Date(data);
    var differenza = scadenza - oggi;
    return Math.ceil(differenza / (1000 * 60 * 60 * 24));
  }

  function statoProdotto(item) {
    var quantita = Number(item.quantita || 0);
    var soglia = Number(item.soglia || 0);
    var giorni = giorniAllaScadenza(item.scadenza);

    if (giorni !== null && giorni <= 3) {
      return {
        testo: "In scadenza",
        classe: "status-expiring"
      };
    }

    if (soglia > 0 && quantita <= soglia) {
      return {
        testo: "Sotto soglia",
        classe: "status-low"
      };
    }

    return {
      testo: "OK",
      classe: "status-ok"
    };
  }

  function creaRigaCard(label, valore) {
    var box = document.createElement("div");

    var span = document.createElement("span");
    span.textContent = label;

    var strong = document.createElement("strong");
    strong.textContent = valore;

    box.appendChild(span);
    box.appendChild(strong);

    return box;
  }

  function renderMerceAvanzata() {
    if (!list) return;

    var merce = leggiMerceAvanzata();
    var query = search ? search.value.toLowerCase().trim() : "";

    if (query) {
      merce = merce.filter(function (item) {
        var testo = [
          item.nome,
          item.fornitore,
          item.posizione,
          item.unita
        ].join(" ").toLowerCase();

        return testo.includes(query);
      });
    }

    list.innerHTML = "";

    if (merce.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<strong>Nessun prodotto trovato</strong><br>Aggiungi merce o modifica la ricerca.";
      list.appendChild(empty);
      return;
    }

    merce.forEach(function (item) {
      var stato = statoProdotto(item);

      var card = document.createElement("div");
      card.className = "product-card";

      var header = document.createElement("div");
      header.className = "product-card-header";

      var left = document.createElement("div");

      var title = document.createElement("h3");
      title.textContent = item.nome || "Prodotto senza nome";

      var supplier = document.createElement("small");
      supplier.textContent = item.fornitore || "Fornitore non indicato";

      left.appendChild(title);
      left.appendChild(supplier);

      var badge = document.createElement("span");
      badge.className = "status-dot " + stato.classe;
      badge.textContent = stato.testo;

      header.appendChild(left);
      header.appendChild(badge);

      var meta = document.createElement("div");
      meta.className = "product-meta";

      meta.appendChild(creaRigaCard("Quantità", (item.quantita || "0") + " " + (item.unita || "")));
      meta.appendChild(creaRigaCard("Scadenza", item.scadenza || "Non indicata"));
      meta.appendChild(creaRigaCard("Soglia", (item.soglia || "0") + " " + (item.unita || "")));
      meta.appendChild(creaRigaCard("Posizione", item.posizione || "Non indicata"));

      card.appendChild(header);
      card.appendChild(meta);

      list.appendChild(card);
    });
  }

  if (form) {
    form.addEventListener("submit", function () {
      setTimeout(renderMerceAvanzata, 100);
    });
  }

  if (search) {
    search.addEventListener("input", renderMerceAvanzata);
  }

  renderMerceAvanzata();
});
document.addEventListener("DOMContentLoaded", function () {
  function leggiMerceBadge() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function numero(valore) {
    if (!valore) return 0;
    return Number(String(valore).replace(",", "."));
  }

  function giorniAllaScadenza(data) {
    if (!data) return null;

    var oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    var scadenza = new Date(data);
    scadenza.setHours(0, 0, 0, 0);

    var differenza = scadenza - oggi;
    return Math.ceil(differenza / (1000 * 60 * 60 * 24));
  }

  function statoMerce(item) {
    var quantita = numero(item.quantita);
    var soglia = numero(item.soglia);
    var giorni = giorniAllaScadenza(item.scadenza);

    if (giorni !== null && giorni < 0) {
      return {
        testo: "Scaduto",
        classe: "status-expiring"
      };
    }

    if (giorni !== null && giorni <= 3) {
      return {
        testo: "In scadenza",
        classe: "status-expiring"
      };
    }

    if (soglia > 0 && quantita <= soglia) {
      return {
        testo: "Sotto soglia",
        classe: "status-low"
      };
    }

    return {
      testo: "OK",
      classe: "status-ok"
    };
  }

  function aggiornaBadgeMerce() {
    var merce = leggiMerceBadge();
    var cards = document.querySelectorAll("#merce-list .product-card");

    cards.forEach(function (card, index) {
      var titolo = card.querySelector("h3");
      var badge = card.querySelector(".status-dot");

      if (!titolo || !badge) return;

      var nomeCard = titolo.textContent.trim();

      var item = merce.find(function (prodotto) {
        return String(prodotto.nome || "").trim() === nomeCard;
      }) || merce[index];

      if (!item) return;

      var stato = statoMerce(item);

      badge.textContent = stato.testo;
      badge.className = "status-dot " + stato.classe;
    });
  }

  var lista = document.getElementById("merce-list");

  if (lista) {
    var osservatore = new MutationObserver(function () {
      aggiornaBadgeMerce();
    });

    osservatore.observe(lista, {
      childList: true
    });
  }

  var form = document.getElementById("merce-form");
  if (form) {
    form.addEventListener("submit", function () {
      setTimeout(aggiornaBadgeMerce, 300);
    });
  }

  var navMerce = document.getElementById("nav-merchandise");
  if (navMerce) {
    navMerce.addEventListener("click", function () {
      setTimeout(aggiornaBadgeMerce, 300);
    });
  }

  setTimeout(aggiornaBadgeMerce, 300);
  setTimeout(aggiornaBadgeMerce, 1000);
});
document.addEventListener("DOMContentLoaded", function () {
  function leggiMerceElimina() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceElimina(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function aggiungiPulsantiElimina() {
    var cards = document.querySelectorAll("#merce-list .product-card");

    cards.forEach(function (card) {
      if (card.querySelector(".card-actions")) return;

      var titolo = card.querySelector("h3");
      if (!titolo) return;

      var actions = document.createElement("div");
      actions.className = "card-actions";

      var elimina = document.createElement("button");
      elimina.type = "button";
      elimina.className = "danger-btn";
      elimina.textContent = "Elimina";

      elimina.addEventListener("click", function () {
        var nome = titolo.textContent.trim();

        var conferma = confirm("Vuoi eliminare " + nome + "?");
        if (!conferma) return;

        var merce = leggiMerceElimina();

        var nuovaLista = merce.filter(function (item) {
          return String(item.nome || "").trim() !== nome;
        });

        salvaMerceElimina(nuovaLista);
        card.remove();

        if (nuovaLista.length === 0) {
          var lista = document.getElementById("merce-list");
          if (lista) {
            lista.innerHTML = '<div class="empty-state"><strong>Nessun prodotto inserito</strong><br>Premi + Aggiungi merce per iniziare a catalogare il magazzino.</div>';
          }
        }
      });

      actions.appendChild(elimina);
      card.appendChild(actions);
    });
  }

  var lista = document.getElementById("merce-list");

  if (lista) {
    var osservatore = new MutationObserver(function () {
      aggiungiPulsantiElimina();
    });

    osservatore.observe(lista, {
      childList: true,
      subtree: true
    });
  }

  setTimeout(aggiungiPulsantiElimina, 500);
  setTimeout(aggiungiPulsantiElimina, 1500);
});
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("merce-form");
  var list = document.getElementById("merce-list");

  function leggiMerceEdit() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceEdit(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function numeroEdit(valore) {
    if (!valore) return 0;
    return Number(String(valore).replace(",", "."));
  }

  function giorniAllaScadenzaEdit(data) {
    if (!data) return null;

    var oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    var scadenza = new Date(data);
    scadenza.setHours(0, 0, 0, 0);

    return Math.ceil((scadenza - oggi) / (1000 * 60 * 60 * 24));
  }

  function statoEdit(item) {
    var quantita = numeroEdit(item.quantita);
    var soglia = numeroEdit(item.soglia);
    var giorni = giorniAllaScadenzaEdit(item.scadenza);

    if (giorni !== null && giorni < 0) {
      return {
        testo: "Scaduto",
        classe: "status-expiring"
      };
    }

    if (giorni !== null && giorni <= 3) {
      return {
        testo: "In scadenza",
        classe: "status-expiring"
      };
    }

    if (soglia > 0 && quantita <= soglia) {
      return {
        testo: "Sotto soglia",
        classe: "status-low"
      };
    }

    return {
      testo: "OK",
      classe: "status-ok"
    };
  }

  function rigaEdit(label, valore) {
    var box = document.createElement("div");

    var span = document.createElement("span");
    span.textContent = label;

    var strong = document.createElement("strong");
    strong.textContent = valore;

    box.appendChild(span);
    box.appendChild(strong);

    return box;
  }

  function renderMerceEdit() {
    if (!list) return;

    var merce = leggiMerceEdit();
    list.innerHTML = "";

    if (merce.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<strong>Nessun prodotto inserito</strong><br>Premi + Aggiungi merce per iniziare a catalogare il magazzino.";
      list.appendChild(empty);
      return;
    }

    merce.forEach(function (item, index) {
      var stato = statoEdit(item);

      var card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-index", index);

      var header = document.createElement("div");
      header.className = "product-card-header";

      var left = document.createElement("div");

      var title = document.createElement("h3");
      title.textContent = item.nome || "Prodotto senza nome";

      var supplier = document.createElement("small");
      supplier.textContent = item.fornitore || "Fornitore non indicato";

      left.appendChild(title);
      left.appendChild(supplier);

      var badge = document.createElement("span");
      badge.className = "status-dot " + stato.classe;
      badge.textContent = stato.testo;

      header.appendChild(left);
      header.appendChild(badge);

      var meta = document.createElement("div");
      meta.className = "product-meta";

      meta.appendChild(rigaEdit("Quantità", (item.quantita || "0") + " " + (item.unita || "")));
      meta.appendChild(rigaEdit("Scadenza", item.scadenza || "Non indicata"));
      meta.appendChild(rigaEdit("Soglia", (item.soglia || "0") + " " + (item.unita || "")));
      meta.appendChild(rigaEdit("Posizione", item.posizione || "Non indicata"));

      var actions = document.createElement("div");
      actions.className = "card-actions";

      var modifica = document.createElement("button");
      modifica.type = "button";
      modifica.className = "edit-btn";
      modifica.textContent = "Modifica";

      modifica.addEventListener("click", function () {
        apriModifica(index);
      });

      var elimina = document.createElement("button");
      elimina.type = "button";
      elimina.className = "danger-btn";
      elimina.textContent = "Elimina";

      elimina.addEventListener("click", function () {
        var conferma = confirm("Vuoi eliminare " + (item.nome || "questo prodotto") + "?");
        if (!conferma) return;

        var lista = leggiMerceEdit();
        lista.splice(index, 1);
        salvaMerceEdit(lista);
        renderMerceEdit();
      });

      actions.appendChild(modifica);
      actions.appendChild(elimina);

      card.appendChild(header);
      card.appendChild(meta);
      card.appendChild(actions);

      list.appendChild(card);
    });
  }

  function apriModifica(index) {
    if (!form) return;

    var merce = leggiMerceEdit();
    var item = merce[index];
    if (!item) return;

    form.classList.remove("hidden-form");
    form.setAttribute("data-edit-index", index);

    var titolo = form.querySelector("h3");
    if (titolo) titolo.textContent = "Modifica merce";

    var submit = form.querySelector('button[type="submit"]');
    if (submit) submit.textContent = "Salva modifiche";

    document.getElementById("merce-nome").value = item.nome || "";
    document.getElementById("merce-quantita").value = item.quantita || "";
    document.getElementById("merce-unita").value = item.unita || "";
    document.getElementById("merce-scadenza").value = item.scadenza || "";
    document.getElementById("merce-soglia").value = item.soglia || "";
    document.getElementById("merce-fornitore").value = item.fornitore || "";
    document.getElementById("merce-posizione").value = item.posizione || "";

    form.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      var editIndex = form.getAttribute("data-edit-index");

      if (editIndex === null || editIndex === "") {
        setTimeout(renderMerceEdit, 200);
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      var merce = leggiMerceEdit();
      var index = Number(editIndex);

      merce[index] = {
        nome: document.getElementById("merce-nome").value,
        quantita: document.getElementById("merce-quantita").value || "0",
        unita: document.getElementById("merce-unita").value || "",
        scadenza: document.getElementById("merce-scadenza").value || "",
        soglia: document.getElementById("merce-soglia").value || "0",
        fornitore: document.getElementById("merce-fornitore").value || "",
        posizione: document.getElementById("merce-posizione").value || ""
      };

      salvaMerceEdit(merce);

      form.removeAttribute("data-edit-index");
      form.reset();
      form.classList.add("hidden-form");

      var titolo = form.querySelector("h3");
      if (titolo) titolo.textContent = "Nuova merce";

      var submit = form.querySelector('button[type="submit"]');
      if (submit) submit.textContent = "Salva merce";

      renderMerceEdit();
    }, true);
  }

  var cancelBtn = document.getElementById("cancel-merce-btn");
  if (cancelBtn && form) {
    cancelBtn.addEventListener("click", function () {
      form.removeAttribute("data-edit-index");

      var titolo = form.querySelector("h3");
      if (titolo) titolo.textContent = "Nuova merce";

      var submit = form.querySelector('button[type="submit"]');
      if (submit) submit.textContent = "Salva merce";
    });
  }

  setTimeout(renderMerceEdit, 500);
});
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("merce-form");

  function leggiMerceModifica() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceModifica(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function aggiungiPulsanteModifica() {
    var cards = document.querySelectorAll("#merce-list .product-card");

    cards.forEach(function (card, index) {
      if (card.querySelector(".edit-btn")) return;

      var actions = card.querySelector(".card-actions");

      if (!actions) {
        actions = document.createElement("div");
        actions.className = "card-actions";
        card.appendChild(actions);
      }

      var modifica = document.createElement("button");
      modifica.type = "button";
      modifica.className = "edit-btn";
      modifica.textContent = "Modifica";

      modifica.addEventListener("click", function () {
        var merce = leggiMerceModifica();
        var item = merce[index];

        if (!item || !form) return;

        form.classList.remove("hidden-form");
        form.setAttribute("data-edit-index", index);

        var titolo = form.querySelector("h3");
        if (titolo) titolo.textContent = "Modifica merce";

        var submit = form.querySelector('button[type="submit"]');
        if (submit) submit.textContent = "Salva modifiche";

        document.getElementById("merce-nome").value = item.nome || "";
        document.getElementById("merce-quantita").value = item.quantita || "";
        document.getElementById("merce-unita").value = item.unita || "";
        document.getElementById("merce-scadenza").value = item.scadenza || "";
        document.getElementById("merce-soglia").value = item.soglia || "";
        document.getElementById("merce-fornitore").value = item.fornitore || "";
        document.getElementById("merce-posizione").value = item.posizione || "";

        form.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });

      actions.insertBefore(modifica, actions.firstChild);
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      var editIndex = form.getAttribute("data-edit-index");

      if (editIndex === null || editIndex === "") return;

      event.preventDefault();
      event.stopImmediatePropagation();

      var merce = leggiMerceModifica();
      var index = Number(editIndex);

      merce[index] = {
        nome: document.getElementById("merce-nome").value,
        quantita: document.getElementById("merce-quantita").value || "0",
        unita: document.getElementById("merce-unita").value || "",
        scadenza: document.getElementById("merce-scadenza").value || "",
        soglia: document.getElementById("merce-soglia").value || "0",
        fornitore: document.getElementById("merce-fornitore").value || "",
        posizione: document.getElementById("merce-posizione").value || ""
      };

      salvaMerceModifica(merce);

      form.removeAttribute("data-edit-index");
      form.reset();
      form.classList.add("hidden-form");

      var titolo = form.querySelector("h3");
      if (titolo) titolo.textContent = "Nuova merce";

      var submit = form.querySelector('button[type="submit"]');
      if (submit) submit.textContent = "Salva merce";

      location.reload();
    }, true);
  }

  var lista = document.getElementById("merce-list");

  if (lista) {
    var osservatore = new MutationObserver(function () {
      aggiungiPulsanteModifica();
    });

    osservatore.observe(lista, {
      childList: true,
      subtree: true
    });
  }

  setTimeout(aggiungiPulsanteModifica, 500);
  setTimeout(aggiungiPulsanteModifica, 1500);
  setTimeout(aggiungiPulsanteModifica, 3000);
});
document.addEventListener("DOMContentLoaded", function () {
  function leggiMerceDashboard() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function numeroDashboard(valore) {
    if (!valore) return 0;
    return Number(String(valore).replace(",", "."));
  }

  function giorniAllaScadenzaDashboard(data) {
    if (!data) return null;

    var oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    var scadenza = new Date(data);
    scadenza.setHours(0, 0, 0, 0);

    return Math.ceil((scadenza - oggi) / (1000 * 60 * 60 * 24));
  }

  function aggiornaDashboardIntelligente() {
    var merce = leggiMerceDashboard();

    var sottoSoglia = merce.filter(function (item) {
      var quantita = numeroDashboard(item.quantita);
      var soglia = numeroDashboard(item.soglia);
      return soglia > 0 && quantita <= soglia;
    });

    var inScadenza = merce.filter(function (item) {
      var giorni = giorniAllaScadenzaDashboard(item.scadenza);
      return giorni !== null && giorni <= 3;
    });

    var totaleEl = document.getElementById("dashboard-total-products");
    var sottoEl = document.getElementById("dashboard-low-stock");
    var scadenzaEl = document.getElementById("dashboard-expiring");
    var ordiniEl = document.getElementById("dashboard-orders");
    var summaryEl = document.getElementById("dashboard-summary");
    var notificheEl = document.getElementById("dashboard-notifications");

    if (totaleEl) totaleEl.textContent = merce.length;
    if (sottoEl) sottoEl.textContent = sottoSoglia.length;
    if (scadenzaEl) scadenzaEl.textContent = inScadenza.length;
    if (ordiniEl) ordiniEl.textContent = sottoSoglia.length;

    if (summaryEl) {
      if (merce.length === 0) {
        summaryEl.textContent = "Il magazzino è ancora vuoto. Inizia inserendo la merce principale.";
      } else if (sottoSoglia.length === 0 && inScadenza.length === 0) {
        summaryEl.textContent = "Situazione sotto controllo. Non ci sono urgenze in magazzino.";
      } else {
        summaryEl.textContent =
          "Attenzione: " +
          sottoSoglia.length +
          " prodotti sono sotto soglia e " +
          inScadenza.length +
          " prodotti sono in scadenza.";
      }
    }

    if (notificheEl) {
      notificheEl.innerHTML = "";

      if (merce.length === 0) {
        var vuoto = document.createElement("li");
        vuoto.textContent = "Aggiungi la prima merce per iniziare.";
        notificheEl.appendChild(vuoto);
        return;
      }

      sottoSoglia.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent =
          item.nome +
          " è sotto soglia. Quantità attuale: " +
          (item.quantita || "0") +
          " " +
          (item.unita || "") +
          ".";
        notificheEl.appendChild(li);
      });

      inScadenza.forEach(function (item) {
        var giorni = giorniAllaScadenzaDashboard(item.scadenza);
        var li = document.createElement("li");

        if (giorni < 0) {
          li.textContent = item.nome + " è scaduto.";
        } else if (giorni === 0) {
          li.textContent = item.nome + " scade oggi.";
        } else {
          li.textContent = item.nome + " scade tra " + giorni + " giorni.";
        }

        notificheEl.appendChild(li);
      });

      if (sottoSoglia.length === 0 && inScadenza.length === 0) {
        var ok = document.createElement("li");
        ok.textContent = "Nessun avviso urgente.";
        notificheEl.appendChild(ok);
      }
    }
  }

  var form = document.getElementById("merce-form");
  if (form) {
    form.addEventListener("submit", function () {
      setTimeout(aggiornaDashboardIntelligente, 300);
      setTimeout(aggiornaDashboardIntelligente, 1000);
    });
  }

  var lista = document.getElementById("merce-list");
  if (lista) {
    var osservatore = new MutationObserver(function () {
      aggiornaDashboardIntelligente();
    });

    osservatore.observe(lista, {
      childList: true,
      subtree: true
    });
  }

  var dashboardBtn = document.getElementById("nav-dashboard");
  if (dashboardBtn) {
    dashboardBtn.addEventListener("click", function () {
      setTimeout(aggiornaDashboardIntelligente, 300);
    });
  }

  setTimeout(aggiornaDashboardIntelligente, 300);
  setTimeout(aggiornaDashboardIntelligente, 1200);
});
document.addEventListener("DOMContentLoaded", function () {
  function leggiMerceOrdini() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function numeroOrdini(valore) {
    if (!valore) return 0;
    return Number(String(valore).replace(",", "."));
  }

  function creaOrdiniContainer() {
    var section = document.getElementById("section-orders");
    if (!section) return null;

    var container = document.getElementById("order-list");

    if (!container) {
      container = document.createElement("div");
      container.id = "order-list";
      container.className = "order-list";
      section.appendChild(container);
    }

    return container;
  }

  function calcolaQuantitaDaOrdinare(item) {
    var quantita = numeroOrdini(item.quantita);
    var soglia = numeroOrdini(item.soglia);

    if (soglia <= 0) return 0;

    var obiettivo = soglia * 2;
    var daOrdinare = obiettivo - quantita;

    if (daOrdinare < 0) return 0;

    return Math.ceil(daOrdinare * 100) / 100;
  }

  function aggiornaOrdiniConsigliati() {
    var container = creaOrdiniContainer();
    if (!container) return;

    var merce = leggiMerceOrdini();

    var prodottiDaOrdinare = merce.filter(function (item) {
      var quantita = numeroOrdini(item.quantita);
      var soglia = numeroOrdini(item.soglia);
      return soglia > 0 && quantita <= soglia;
    });

    container.innerHTML = "";

    if (prodottiDaOrdinare.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty-state";

      var titolo = document.createElement("strong");
      titolo.textContent = "Nessun ordine urgente";

      var testo = document.createElement("div");
      testo.textContent = "Le quantità sono sopra soglia. Il magazzino è sotto controllo.";

      empty.appendChild(titolo);
      empty.appendChild(document.createElement("br"));
      empty.appendChild(testo);

      container.appendChild(empty);
      return;
    }

    prodottiDaOrdinare.forEach(function (item) {
      var quantita = numeroOrdini(item.quantita);
      var soglia = numeroOrdini(item.soglia);
      var daOrdinare = calcolaQuantitaDaOrdinare(item);

      var card = document.createElement("div");
      card.className = "order-card";

      var titolo = document.createElement("h3");
      titolo.textContent = item.nome || "Prodotto senza nome";

      var fornitore = document.createElement("p");
      fornitore.textContent = item.fornitore
        ? "Fornitore: " + item.fornitore
        : "Fornitore non indicato";

      var dettaglio = document.createElement("div");
      dettaglio.className = "order-detail";

      var attuale = document.createElement("div");
      attuale.innerHTML =
        "<span>Giacenza attuale</span><strong>" +
        quantita +
        " " +
        (item.unita || "") +
        "</strong>";

      var minima = document.createElement("div");
      minima.innerHTML =
        "<span>Soglia minima</span><strong>" +
        soglia +
        " " +
        (item.unita || "") +
        "</strong>";

      var ordine = document.createElement("div");
      ordine.className = "order-suggestion";
      ordine.innerHTML =
        "<span>Ordine consigliato</span><strong>" +
        daOrdinare +
        " " +
        (item.unita || "") +
        "</strong>";

      dettaglio.appendChild(attuale);
      dettaglio.appendChild(minima);
      dettaglio.appendChild(ordine);

      var nota = document.createElement("small");
      nota.textContent =
        "Suggerimento: ordina abbastanza per tornare circa al doppio della soglia minima.";

      card.appendChild(titolo);
      card.appendChild(fornitore);
      card.appendChild(dettaglio);
      card.appendChild(nota);

      container.appendChild(card);
    });
  }

  var navOrders = document.getElementById("nav-orders");
  if (navOrders) {
    navOrders.addEventListener("click", function () {
      setTimeout(aggiornaOrdiniConsigliati, 200);
    });
  }

  var form = document.getElementById("merce-form");
  if (form) {
    form.addEventListener("submit", function () {
      setTimeout(aggiornaOrdiniConsigliati, 500);
    });
  }

  var lista = document.getElementById("merce-list");
  if (lista) {
    var osservatore = new MutationObserver(function () {
      aggiornaOrdiniConsigliati();
    });

    osservatore.observe(lista, {
      childList: true,
      subtree: true
    });
  }

  setTimeout(aggiornaOrdiniConsigliati, 500);
  setTimeout(aggiornaOrdiniConsigliati, 1500);
});
document.addEventListener("DOMContentLoaded", function () {
  var addRecipeBtn = document.getElementById("add-recipe-btn");
  var recipeForm = document.getElementById("recipe-form");
  var cancelRecipeBtn = document.getElementById("cancel-recipe-btn");
  var addIngredientBtn = document.getElementById("add-ingredient-row");
  var ingredientRows = document.getElementById("ingredient-rows");
  var recipeList = document.getElementById("recipe-list");
  var merceNames = document.getElementById("merce-names");

  function leggiRicette() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_ricette")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaRicette(lista) {
    localStorage.setItem("magazzino_ricette", JSON.stringify(lista));
  }

  function leggiMercePerRicette() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function aggiornaDatalistMerce() {
    if (!merceNames) return;

    var merce = leggiMercePerRicette();
    merceNames.innerHTML = "";

    merce.forEach(function (item) {
      if (!item.nome) return;

      var option = document.createElement("option");
      option.value = item.nome;
      merceNames.appendChild(option);
    });
  }

  function creaRigaIngrediente(dati) {
    if (!ingredientRows) return;

    var row = document.createElement("div");
    row.className = "ingredient-row";

    var grid = document.createElement("div");
    grid.className = "ingredient-row-grid";

    var inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.placeholder = "Ingrediente";
    inputNome.setAttribute("list", "merce-names");
    inputNome.className = "ingredient-name";
    inputNome.value = dati && dati.nome ? dati.nome : "";

    var inputQuantita = document.createElement("input");
    inputQuantita.type = "number";
    inputQuantita.step = "0.001";
    inputQuantita.placeholder = "Quantità";
    inputQuantita.className = "ingredient-qty";
    inputQuantita.value = dati && dati.quantita ? dati.quantita : "";

    var inputUnita = document.createElement("input");
    inputUnita.type = "text";
    inputUnita.placeholder = "kg, g, l, pz";
    inputUnita.className = "ingredient-unit";
    inputUnita.value = dati && dati.unita ? dati.unita : "";

    grid.appendChild(inputNome);
    grid.appendChild(inputQuantita);
    grid.appendChild(inputUnita);

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-ingredient-btn";
    remove.textContent = "Rimuovi ingrediente";

    remove.addEventListener("click", function () {
      row.remove();

      if (ingredientRows.children.length === 0) {
        creaRigaIngrediente();
      }
    });

    row.appendChild(grid);
    row.appendChild(remove);

    ingredientRows.appendChild(row);
  }

  function pulisciFormRicetta() {
    if (!recipeForm || !ingredientRows) return;

    recipeForm.reset();
    ingredientRows.innerHTML = "";
    creaRigaIngrediente();

    var title = recipeForm.querySelector("h3");
    if (title) title.textContent = "Nuova ricetta";

    var submit = recipeForm.querySelector('button[type="submit"]');
    if (submit) submit.textContent = "Salva ricetta";

    recipeForm.removeAttribute("data-edit-index");
  }

  function renderRicette() {
    if (!recipeList) return;

    var ricette = leggiRicette();
    recipeList.innerHTML = "";

    if (ricette.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<strong>Nessuna ricetta inserita</strong><br>Premi Aggiungi piatto per creare la prima ricetta.";
      recipeList.appendChild(empty);
      return;
    }

    ricette.forEach(function (ricetta, index) {
      var card = document.createElement("div");
      card.className = "recipe-card";

      var header = document.createElement("div");
      header.className = "recipe-card-header";

      var left = document.createElement("div");

      var title = document.createElement("h3");
      title.textContent = ricetta.nome || "Piatto senza nome";

      var subtitle = document.createElement("small");
      subtitle.textContent = (ricetta.ingredienti || []).length + " ingredienti per porzione";

      left.appendChild(title);
      left.appendChild(subtitle);

      var badge = document.createElement("span");
      badge.className = "recipe-badge status-ok";
      badge.textContent = "Ricetta";

      header.appendChild(left);
      header.appendChild(badge);

      var ingredients = document.createElement("div");
      ingredients.className = "recipe-ingredients";

      (ricetta.ingredienti || []).forEach(function (ing) {
        var item = document.createElement("div");
        item.className = "recipe-ingredient";

        var name = document.createElement("strong");
        name.textContent = ing.nome || "Ingrediente";

        var qty = document.createElement("span");
        qty.textContent = (ing.quantita || "0") + " " + (ing.unita || "");

        item.appendChild(name);
        item.appendChild(qty);

        ingredients.appendChild(item);
      });

      var actions = document.createElement("div");
      actions.className = "card-actions";

      var edit = document.createElement("button");
      edit.type = "button";
      edit.className = "edit-btn";
      edit.textContent = "Modifica";

      edit.addEventListener("click", function () {
        apriModificaRicetta(index);
      });

      var del = document.createElement("button");
      del.type = "button";
      del.className = "danger-btn";
      del.textContent = "Elimina";

      del.addEventListener("click", function () {
        var conferma = confirm("Vuoi eliminare " + (ricetta.nome || "questa ricetta") + "?");
        if (!conferma) return;

        var lista = leggiRicette();
        lista.splice(index, 1);
        salvaRicette(lista);
        renderRicette();
      });

      actions.appendChild(edit);
      actions.appendChild(del);

      card.appendChild(header);
      card.appendChild(ingredients);
      card.appendChild(actions);

      recipeList.appendChild(card);
    });
  }

  function apriModificaRicetta(index) {
    if (!recipeForm || !ingredientRows) return;

    var ricette = leggiRicette();
    var ricetta = ricette[index];
    if (!ricetta) return;

    recipeForm.classList.remove("hidden-form");
    recipeForm.setAttribute("data-edit-index", index);

    var title = recipeForm.querySelector("h3");
    if (title) title.textContent = "Modifica ricetta";

    var submit = recipeForm.querySelector('button[type="submit"]');
    if (submit) submit.textContent = "Salva modifiche";

    document.getElementById("recipe-name").value = ricetta.nome || "";

    ingredientRows.innerHTML = "";

    if (ricetta.ingredienti && ricetta.ingredienti.length > 0) {
      ricetta.ingredienti.forEach(function (ing) {
        creaRigaIngrediente(ing);
      });
    } else {
      creaRigaIngrediente();
    }

    recipeForm.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  if (addRecipeBtn && recipeForm) {
    addRecipeBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      aggiornaDatalistMerce();
      pulisciFormRicetta();

      recipeForm.classList.remove("hidden-form");
      recipeForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, true);
  }

  if (addIngredientBtn) {
    addIngredientBtn.addEventListener("click", function () {
      creaRigaIngrediente();
    });
  }

  if (cancelRecipeBtn && recipeForm) {
    cancelRecipeBtn.addEventListener("click", function () {
      pulisciFormRicetta();
      recipeForm.classList.add("hidden-form");
    });
  }

  if (recipeForm) {
    recipeForm.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      var nome = document.getElementById("recipe-name").value.trim();
      if (!nome) return;

      var ingredienti = [];

      document.querySelectorAll(".ingredient-row").forEach(function (row) {
        var ingNome = row.querySelector(".ingredient-name").value.trim();
        var quantita = row.querySelector(".ingredient-qty").value || "0";
        var unita = row.querySelector(".ingredient-unit").value || "";

        if (!ingNome) return;

        ingredienti.push({
          nome: ingNome,
          quantita: quantita,
          unita: unita
        });
      });

      if (ingredienti.length === 0) {
        alert("Aggiungi almeno un ingrediente.");
        return;
      }

      var ricette = leggiRicette();
      var editIndex = recipeForm.getAttribute("data-edit-index");

      var nuovaRicetta = {
        nome: nome,
        ingredienti: ingredienti
      };

      if (editIndex !== null && editIndex !== "") {
        ricette[Number(editIndex)] = nuovaRicetta;
      } else {
        ricette.push(nuovaRicetta);
      }

      salvaRicette(ricette);
      pulisciFormRicetta();
      recipeForm.classList.add("hidden-form");
      renderRicette();
    }, true);
  }

  var menuBtn = document.getElementById("nav-menu");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      aggiornaDatalistMerce();
      setTimeout(renderRicette, 200);
    });
  }

  aggiornaDatalistMerce();
  renderRicette();
});
document.addEventListener("DOMContentLoaded", function () {
  var reportFile = document.getElementById("report-file");
  var processBtn = document.getElementById("process-report-btn");
  var output = document.getElementById("report-output");
  var reportSection = document.getElementById("section-report");

  function leggiMerceReport() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceReport(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function leggiRicetteReport() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_ricette")) || [];
    } catch (e) {
      return [];
    }
  }

  function normalizza(testo) {
    return String(testo || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function numeroReport(valore) {
    if (!valore) return 0;
    return Number(String(valore).replace(",", "."));
  }

  function arrotonda(valore) {
    return Math.round(valore * 1000) / 1000;
  }

  function analizzaCSV(testo) {
    var righe = String(testo || "")
      .split(/\r?\n/)
      .map(function (riga) {
        return riga.trim();
      })
      .filter(Boolean);

    var vendite = [];

    righe.forEach(function (riga, index) {
      var separatore = ";";

      if (riga.indexOf(";") !== -1) {
        separatore = ";";
      } else if (riga.indexOf(",") !== -1) {
        separatore = ",";
      } else if (riga.indexOf("\t") !== -1) {
        separatore = "\t";
      }

      var parti = riga.split(separatore).map(function (parte) {
        return parte.trim();
      });

      var piatto = parti[0];
      var quantita = parti[1] || "1";

      var primaRiga = index === 0;
      var sembraIntestazione =
        normalizza(piatto).includes("piatto") ||
        normalizza(piatto).includes("prodotto") ||
        normalizza(piatto).includes("nome");

      if (primaRiga && sembraIntestazione) return;
      if (!piatto) return;

      vendite.push({
        piatto: piatto,
        quantita: numeroReport(quantita) || 1
      });
    });

    return vendite;
  }

  function elaboraVendite(vendite) {
    var merce = leggiMerceReport();
    var ricette = leggiRicetteReport();

    var log = [];
    var problemi = [];

    if (vendite.length === 0) {
      return "Nessuna vendita trovata nel file.";
    }

    log.push("REPORT VENDITE ELABORATO");
    log.push("");
    log.push("Vendite lette: " + vendite.length);
    log.push("");

    vendite.forEach(function (vendita) {
      var ricetta = ricette.find(function (r) {
        return normalizza(r.nome) === normalizza(vendita.piatto);
      });

      if (!ricetta) {
        problemi.push("Ricetta non trovata: " + vendita.piatto);
        return;
      }

      log.push("Piatto venduto: " + ricetta.nome + " x " + vendita.quantita);

      (ricetta.ingredienti || []).forEach(function (ingrediente) {
        var prodotto = merce.find(function (m) {
          return normalizza(m.nome) === normalizza(ingrediente.nome);
        });

        if (!prodotto) {
          problemi.push(
            "Ingrediente non trovato in magazzino: " +
              ingrediente.nome +
              " nella ricetta " +
              ricetta.nome
          );
          return;
        }

        var consumo = numeroReport(ingrediente.quantita) * vendita.quantita;
        var giacenzaAttuale = numeroReport(prodotto.quantita);
        var nuovaGiacenza = giacenzaAttuale - consumo;

        if (nuovaGiacenza < 0) {
          nuovaGiacenza = 0;
        }

        prodotto.quantita = String(arrotonda(nuovaGiacenza));

        log.push(
          " - " +
            prodotto.nome +
            ": -" +
            arrotonda(consumo) +
            " " +
            (prodotto.unita || ingrediente.unita || "") +
            " | nuova giacenza: " +
            prodotto.quantita +
            " " +
            (prodotto.unita || "")
        );
      });

      log.push("");
    });

    salvaMerceReport(merce);

    if (problemi.length > 0) {
      log.push("ATTENZIONE");
      problemi.forEach(function (p) {
        log.push(" - " + p);
      });
      log.push("");
    }

    log.push("Magazzino aggiornato.");
    log.push("Torna su Merce o Dashboard per vedere le quantità aggiornate.");

    setTimeout(function () {
      var merceBtn = document.getElementById("nav-merchandise");
      if (merceBtn) merceBtn.click();

      var dashboardBtn = document.getElementById("nav-dashboard");
      if (dashboardBtn) {
        setTimeout(function () {
          dashboardBtn.click();
        }, 400);
      }
    }, 500);

    return log.join("\n");
  }

  function creaPulsanteEsempio() {
    if (!reportSection || document.getElementById("load-sample-report-btn")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "load-sample-report-btn";
    btn.className = "secondary-btn";
    btn.textContent = "Carica esempio";

    btn.addEventListener("click", function () {
      var ricette = leggiRicetteReport();
      var nomeRicetta = ricette.length > 0 ? ricette[0].nome : "Pizza margherita";
      var esempio = nomeRicetta + ";10";

      sessionStorage.setItem("report_vendite_esempio", esempio);

      if (output) {
        output.textContent =
          "Esempio caricato:\n\n" +
          esempio +
          "\n\nOra premi il pulsante Elabora vendite.";
      }
    });

    if (processBtn && processBtn.parentNode) {
      processBtn.parentNode.insertBefore(btn, processBtn);
    }
  }

  if (processBtn) {
    processBtn.textContent = "Elabora vendite";

    processBtn.addEventListener("click", function () {
      if (reportFile && reportFile.files && reportFile.files[0]) {
        var reader = new FileReader();

        reader.onload = function (event) {
          var testo = event.target.result;
          var vendite = analizzaCSV(testo);
          var risultato = elaboraVendite(vendite);

          if (output) output.textContent = risultato;
        };

        reader.readAsText(reportFile.files[0]);
        return;
      }

      var esempio = sessionStorage.getItem("report_vendite_esempio");

      if (esempio) {
        var venditeEsempio = analizzaCSV(esempio);
        var risultatoEsempio = elaboraVendite(venditeEsempio);

        if (output) output.textContent = risultatoEsempio;
        return;
      }

      if (output) {
        output.textContent =
          "Nessun file selezionato.\n\nFormato accettato:\npiatto;quantita\n\nEsempio:\nPizza margherita;10";
      }
    });
  }

  creaPulsanteEsempio();
});
