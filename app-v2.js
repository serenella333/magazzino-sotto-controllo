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
document.addEventListener("DOMContentLoaded", function () {
  var recipeSelect = document.getElementById("quick-sale-recipe");
  var qtyInput = document.getElementById("quick-sale-qty");
  var quickSaleBtn = document.getElementById("quick-sale-btn");
  var output = document.getElementById("report-output");

  function leggiMerceVenditaRapida() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceVenditaRapida(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function leggiRicetteVenditaRapida() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_ricette")) || [];
    } catch (e) {
      return [];
    }
  }

  function normalizzaVenditaRapida(testo) {
    return String(testo || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function numeroVenditaRapida(valore) {
    if (!valore) return 0;
    return Number(String(valore).replace(",", "."));
  }

  function arrotondaVenditaRapida(valore) {
    return Math.round(valore * 1000) / 1000;
  }

  function aggiornaSelectRicette() {
    if (!recipeSelect) return;

    var ricette = leggiRicetteVenditaRapida();

    recipeSelect.innerHTML = "";

    var prima = document.createElement("option");
    prima.value = "";
    prima.textContent = "Seleziona una ricetta";
    recipeSelect.appendChild(prima);

    ricette.forEach(function (ricetta) {
      var option = document.createElement("option");
      option.value = ricetta.nome;
      option.textContent = ricetta.nome;
      recipeSelect.appendChild(option);
    });
  }

  function scalaIngredientiDaRicetta(nomeRicetta, quantitaVenduta) {
    var merce = leggiMerceVenditaRapida();
    var ricette = leggiRicetteVenditaRapida();

    var ricetta = ricette.find(function (r) {
      return normalizzaVenditaRapida(r.nome) === normalizzaVenditaRapida(nomeRicetta);
    });

    if (!ricetta) {
      return "Ricetta non trovata.";
    }

    var log = [];

    log.push("VENDITA RAPIDA");
    log.push("");
    log.push("Piatto: " + ricetta.nome);
    log.push("Quantità venduta: " + quantitaVenduta);
    log.push("");

    (ricetta.ingredienti || []).forEach(function (ingrediente) {
      var prodotto = merce.find(function (m) {
        return normalizzaVenditaRapida(m.nome) === normalizzaVenditaRapida(ingrediente.nome);
      });

      if (!prodotto) {
        log.push("Ingrediente non trovato in magazzino: " + ingrediente.nome);
        return;
      }

      var consumo = numeroVenditaRapida(ingrediente.quantita) * quantitaVenduta;
      var giacenza = numeroVenditaRapida(prodotto.quantita);
      var nuovaGiacenza = giacenza - consumo;

      if (nuovaGiacenza < 0) {
        nuovaGiacenza = 0;
      }

      prodotto.quantita = String(arrotondaVenditaRapida(nuovaGiacenza));

      log.push(
        prodotto.nome +
          ": -" +
          arrotondaVenditaRapida(consumo) +
          " " +
          (prodotto.unita || ingrediente.unita || "") +
          " | nuova giacenza: " +
          prodotto.quantita +
          " " +
          (prodotto.unita || "")
      );
    });

    salvaMerceVenditaRapida(merce);

    log.push("");
    log.push("Magazzino aggiornato.");
    log.push("Controlla Dashboard, Merce e Ordini consigliati.");

    return log.join("\n");
  }

  if (quickSaleBtn) {
    quickSaleBtn.addEventListener("click", function () {
      var nomeRicetta = recipeSelect ? recipeSelect.value : "";
      var quantita = qtyInput ? numeroVenditaRapida(qtyInput.value) : 1;

      if (!nomeRicetta) {
        if (output) output.textContent = "Seleziona prima una ricetta.";
        return;
      }

      if (!quantita || quantita <= 0) {
        if (output) output.textContent = "Inserisci una quantità valida.";
        return;
      }

      var risultato = scalaIngredientiDaRicetta(nomeRicetta, quantita);

      if (output) {
        output.textContent = risultato;
      }
    });
  }

  var reportBtn = document.getElementById("nav-report");
  if (reportBtn) {
    reportBtn.addEventListener("click", function () {
      aggiornaSelectRicette();
    });
  }

  var menuBtn = document.getElementById("nav-menu");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setTimeout(aggiornaSelectRicette, 500);
    });
  }

  aggiornaSelectRicette();
});
document.addEventListener("DOMContentLoaded", function () {
  function leggiRicetteSelectFix() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_ricette")) || [];
    } catch (e) {
      return [];
    }
  }

  function aggiornaMenuVenditaRapidaFix() {
    var select = document.getElementById("quick-sale-recipe");
    if (!select) return;

    var valoreCorrente = select.value;
    var ricette = leggiRicetteSelectFix();

    select.innerHTML = "";

    var placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Seleziona una ricetta";
    select.appendChild(placeholder);

    ricette.forEach(function (ricetta) {
      if (!ricetta.nome) return;

      var option = document.createElement("option");
      option.value = ricetta.nome;
      option.textContent = ricetta.nome;
      select.appendChild(option);
    });

    if (valoreCorrente) {
      select.value = valoreCorrente;
    }
  }

  var select = document.getElementById("quick-sale-recipe");

  if (select) {
    select.addEventListener("focus", aggiornaMenuVenditaRapidaFix);
    select.addEventListener("click", aggiornaMenuVenditaRapidaFix);
    select.addEventListener("touchstart", aggiornaMenuVenditaRapidaFix);
  }

  var reportBtn = document.getElementById("nav-report");
  if (reportBtn) {
    reportBtn.addEventListener("click", function () {
      setTimeout(aggiornaMenuVenditaRapidaFix, 200);
      setTimeout(aggiornaMenuVenditaRapidaFix, 800);
    });
  }

  var menuBtn = document.getElementById("nav-menu");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setTimeout(aggiornaMenuVenditaRapidaFix, 800);
    });
  }

  setTimeout(aggiornaMenuVenditaRapidaFix, 500);
  setTimeout(aggiornaMenuVenditaRapidaFix, 1500);
  setTimeout(aggiornaMenuVenditaRapidaFix, 3000);
});
document.addEventListener("DOMContentLoaded", function () {
  function leggiMovimenti() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_movimenti")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMovimenti(lista) {
    localStorage.setItem("magazzino_movimenti", JSON.stringify(lista));
  }

  function registraMovimento(tipo, titolo, dettaglio) {
    var movimenti = leggiMovimenti();

    movimenti.unshift({
      data: new Date().toISOString(),
      tipo: tipo,
      titolo: titolo,
      dettaglio: dettaglio || ""
    });

    if (movimenti.length > 50) {
      movimenti = movimenti.slice(0, 50);
    }

    salvaMovimenti(movimenti);
    renderMovimenti();
  }

  function creaBoxMovimenti() {
    var dashboard = document.getElementById("section-dashboard");
    if (!dashboard) return null;

    var box = document.getElementById("movements-panel");
    if (box) return box;

    box = document.createElement("div");
    box.id = "movements-panel";
    box.className = "panel movements-panel";

    var title = document.createElement("h3");
    title.textContent = "Storico movimenti";

    var list = document.createElement("div");
    list.id = "movements-list";
    list.className = "movements-list";

    var clear = document.createElement("button");
    clear.type = "button";
    clear.id = "clear-movements-btn";
    clear.className = "secondary-btn";
    clear.textContent = "Svuota storico";

    clear.addEventListener("click", function () {
      var conferma = confirm("Vuoi svuotare lo storico movimenti?");
      if (!conferma) return;

      localStorage.removeItem("magazzino_movimenti");
      renderMovimenti();
    });

    box.appendChild(title);
    box.appendChild(list);
    box.appendChild(clear);

    dashboard.appendChild(box);

    return box;
  }

  function formattaData(dataIso) {
    var data = new Date(dataIso);

    return data.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function renderMovimenti() {
    creaBoxMovimenti();

    var list = document.getElementById("movements-list");
    if (!list) return;

    var movimenti = leggiMovimenti();

    list.innerHTML = "";

    if (movimenti.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty-state";

      var strong = document.createElement("strong");
      strong.textContent = "Nessun movimento registrato";

      var text = document.createElement("div");
      text.textContent = "Quando elabori vendite o sprechi, li vedrai qui.";

      empty.appendChild(strong);
      empty.appendChild(document.createElement("br"));
      empty.appendChild(text);

      list.appendChild(empty);
      return;
    }

    movimenti.slice(0, 10).forEach(function (movimento) {
      var item = document.createElement("div");
      item.className = "movement-item";

      var top = document.createElement("div");
      top.className = "movement-top";

      var badge = document.createElement("span");
      badge.className = "movement-badge";
      badge.textContent = movimento.tipo || "Movimento";

      var date = document.createElement("small");
      date.textContent = formattaData(movimento.data);

      top.appendChild(badge);
      top.appendChild(date);

      var title = document.createElement("strong");
      title.textContent = movimento.titolo || "";

      var detail = document.createElement("p");
      detail.textContent = movimento.dettaglio || "";

      item.appendChild(top);
      item.appendChild(title);

      if (movimento.dettaglio) {
        item.appendChild(detail);
      }

      list.appendChild(item);
    });
  }

  var quickSaleBtn = document.getElementById("quick-sale-btn");

  if (quickSaleBtn) {
    quickSaleBtn.addEventListener("click", function () {
      setTimeout(function () {
        var select = document.getElementById("quick-sale-recipe");
        var qty = document.getElementById("quick-sale-qty");
        var output = document.getElementById("report-output");

        if (!select || !qty || !output) return;
        if (!select.value) return;
        if (!output.textContent.includes("Magazzino aggiornato")) return;

        registraMovimento(
          "Vendita",
          select.value + " x " + qty.value,
          "Ingredienti scalati automaticamente dal magazzino."
        );
      }, 600);
    });
  }

  var processReportBtn = document.getElementById("process-report-btn");

  if (processReportBtn) {
    processReportBtn.addEventListener("click", function () {
      setTimeout(function () {
        var output = document.getElementById("report-output");
        if (!output) return;
        if (!output.textContent.includes("Magazzino aggiornato")) return;

        registraMovimento(
          "Report vendite",
          "Report vendite elaborato",
          "Le quantità degli ingredienti sono state aggiornate."
        );
      }, 1000);
    });
  }

  var wasteForm = document.getElementById("waste-form");

  if (wasteForm) {
    wasteForm.addEventListener("submit", function () {
      setTimeout(function () {
        var product = document.getElementById("waste-product");
        var qty = document.getElementById("waste-qty");
        var reason = document.getElementById("waste-reason");

        registraMovimento(
          "Spreco",
          product && product.value ? product.value : "Spreco registrato",
          "Quantità: " +
            (qty && qty.value ? qty.value : "0") +
            ". Motivo: " +
            (reason && reason.value ? reason.value : "non indicato") +
            "."
        );
      }, 300);
    });
  }

  var dashboardBtn = document.getElementById("nav-dashboard");
  if (dashboardBtn) {
    dashboardBtn.addEventListener("click", function () {
      setTimeout(renderMovimenti, 200);
    });
  }

  renderMovimenti();
});
document.addEventListener("DOMContentLoaded", function () {
  function creaBoxIngredientiMancanti() {
    var reportSection = document.getElementById("section-report");
    if (!reportSection) return null;

    var box = document.getElementById("missing-ingredients-box");
    if (box) return box;

    box = document.createElement("div");
    box.id = "missing-ingredients-box";
    box.className = "report-warning";
    box.style.display = "none";

    reportSection.appendChild(box);

    return box;
  }

  function aggiornaIngredientiMancanti() {
    var output = document.getElementById("report-output");
    var box = creaBoxIngredientiMancanti();

    if (!output || !box) return;

    var testo = output.textContent || "";

    if (!testo.includes("Ingrediente non trovato in magazzino")) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }

    var righe = testo.split("\n").filter(function (riga) {
      return riga.includes("Ingrediente non trovato in magazzino");
    });

    var ingredienti = righe.map(function (riga) {
      return riga.replace("Ingrediente non trovato in magazzino:", "").trim();
    });

    box.style.display = "block";
    box.innerHTML =
      "<strong>Ingredienti mancanti in magazzino</strong><br><br>" +
      ingredienti.map(function (nome) {
        return "• " + nome;
      }).join("<br>") +
      "<br><br>Aggiungili nella sezione Merce per far scalare correttamente le prossime vendite.";
  }

  var quickSaleBtn = document.getElementById("quick-sale-btn");
  if (quickSaleBtn) {
    quickSaleBtn.addEventListener("click", function () {
      setTimeout(aggiornaIngredientiMancanti, 800);
    });
  }

  var processBtn = document.getElementById("process-report-btn");
  if (processBtn) {
    processBtn.addEventListener("click", function () {
      setTimeout(aggiornaIngredientiMancanti, 1200);
    });
  }

  setTimeout(aggiornaIngredientiMancanti, 1000);
});
document.addEventListener("DOMContentLoaded", function () {
  function normalizzaCheck(testo) {
    return String(testo || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function leggiMerceCheck() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function leggiRicetteCheck() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_ricette")) || [];
    } catch (e) {
      return [];
    }
  }

  function creaBoxMancantiCheck() {
    var reportSection = document.getElementById("section-report");
    if (!reportSection) return null;

    var box = document.getElementById("missing-ingredients-box");
    if (box) return box;

    box = document.createElement("div");
    box.id = "missing-ingredients-box";
    box.className = "report-warning";
    box.style.display = "none";

    reportSection.appendChild(box);
    return box;
  }

  function trovaIngredientiMancantiRicetta() {
    var select = document.getElementById("quick-sale-recipe");
    if (!select || !select.value) return [];

    var ricette = leggiRicetteCheck();
    var merce = leggiMerceCheck();

    var ricetta = ricette.find(function (r) {
      return normalizzaCheck(r.nome) === normalizzaCheck(select.value);
    });

    if (!ricetta) return [];

    var mancanti = [];

    (ricetta.ingredienti || []).forEach(function (ingrediente) {
      var esiste = merce.some(function (item) {
        return normalizzaCheck(item.nome) === normalizzaCheck(ingrediente.nome);
      });

      if (!esiste) {
        mancanti.push({
          nome: ingrediente.nome,
          unita: ingrediente.unita || ""
        });
      }
    });

    return mancanti;
  }

  function mostraIngredientiMancantiCheck() {
    var box = creaBoxMancantiCheck();
    if (!box) return;

    var mancanti = trovaIngredientiMancantiRicetta();

    if (mancanti.length === 0) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }

    box.style.display = "block";
    box.innerHTML =
      "<strong>Ingredienti mancanti in magazzino</strong><br><br>" +
      mancanti.map(function (item) {
        return "• " + item.nome;
      }).join("<br>") +
      "<br><br>Aggiungili nella sezione Merce per far scalare correttamente le prossime vendite." +
      "<br><br><button id='create-missing-from-recipe-btn' type='button'>Crea ingredienti mancanti</button>";

    var btn = document.getElementById("create-missing-from-recipe-btn");

    if (btn) {
      btn.addEventListener("click", function () {
        var merce = leggiMerceCheck();

        mancanti.forEach(function (ingrediente) {
          var esiste = merce.some(function (item) {
            return normalizzaCheck(item.nome) === normalizzaCheck(ingrediente.nome);
          });

          if (!esiste) {
            merce.push({
              nome: ingrediente.nome,
              quantita: "0",
              unita: ingrediente.unita || "",
              scadenza: "",
              soglia: "0",
              fornitore: "",
              posizione: ""
            });
          }
        });

        localStorage.setItem("magazzino_merce", JSON.stringify(merce));

        alert("Ingredienti mancanti creati in Merce.");

        var merceBtn = document.getElementById("nav-merchandise");
        if (merceBtn) merceBtn.click();
      });
    }
  }

  var select = document.getElementById("quick-sale-recipe");
  if (select) {
    select.addEventListener("change", mostraIngredientiMancantiCheck);
    select.addEventListener("click", function () {
      setTimeout(mostraIngredientiMancantiCheck, 300);
    });
  }

  var quickSaleBtn = document.getElementById("quick-sale-btn");
  if (quickSaleBtn) {
    quickSaleBtn.addEventListener("click", function () {
      setTimeout(mostraIngredientiMancantiCheck, 500);
      setTimeout(mostraIngredientiMancantiCheck, 1200);
    });
  }

  var reportBtn = document.getElementById("nav-report");
  if (reportBtn) {
    reportBtn.addEventListener("click", function () {
      setTimeout(mostraIngredientiMancantiCheck, 500);
    });
  }

  setTimeout(mostraIngredientiMancantiCheck, 1000);
});
document.addEventListener("DOMContentLoaded", function () {
  var invoiceForm = document.getElementById("invoice-form");
  var invoiceOutput = document.getElementById("invoice-output");

  function leggiMerceFattura() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceFattura(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function leggiMovimentiFattura() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_movimenti")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMovimentiFattura(lista) {
    localStorage.setItem("magazzino_movimenti", JSON.stringify(lista));
  }

  function normalizzaFattura(testo) {
    return String(testo || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function numeroFattura(valore) {
    if (!valore) return 0;
    return Number(String(valore).replace(",", "."));
  }

  function arrotondaFattura(valore) {
    return Math.round(valore * 1000) / 1000;
  }

  function registraMovimentoFattura(titolo, dettaglio) {
    var movimenti = leggiMovimentiFattura();

    movimenti.unshift({
      data: new Date().toISOString(),
      tipo: "Fattura",
      titolo: titolo,
      dettaglio: dettaglio
    });

    if (movimenti.length > 50) {
      movimenti = movimenti.slice(0, 50);
    }

    salvaMovimentiFattura(movimenti);
  }

  if (invoiceForm) {
    invoiceForm.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      var nome = document.getElementById("invoice-product").value.trim();
      var qty = numeroFattura(document.getElementById("invoice-qty").value);
      var unit = document.getElementById("invoice-unit").value.trim();
      var supplier = document.getElementById("invoice-supplier").value.trim();
      var expiry = document.getElementById("invoice-expiry").value;
      var threshold = document.getElementById("invoice-threshold").value;
      var position = document.getElementById("invoice-position").value.trim();

      if (!nome || qty <= 0) {
        if (invoiceOutput) {
          invoiceOutput.textContent = "Inserisci un prodotto e una quantità valida.";
        }
        return;
      }

      var merce = leggiMerceFattura();

      var prodotto = merce.find(function (item) {
        return normalizzaFattura(item.nome) === normalizzaFattura(nome);
      });

      var messaggio = "";

      if (prodotto) {
        var vecchiaQuantita = numeroFattura(prodotto.quantita);
        var nuovaQuantita = arrotondaFattura(vecchiaQuantita + qty);

        prodotto.quantita = String(nuovaQuantita);

        if (unit) prodotto.unita = unit;
        if (supplier) prodotto.fornitore = supplier;
        if (expiry) prodotto.scadenza = expiry;
        if (threshold) prodotto.soglia = threshold;
        if (position) prodotto.posizione = position;

        messaggio =
          "FATTURA REGISTRATA\n\n" +
          "Prodotto aggiornato: " + prodotto.nome + "\n" +
          "Quantità precedente: " + vecchiaQuantita + " " + (prodotto.unita || "") + "\n" +
          "Quantità arrivata: +" + qty + " " + (prodotto.unita || unit || "") + "\n" +
          "Nuova quantità: " + nuovaQuantita + " " + (prodotto.unita || unit || "") + "\n\n" +
          "Magazzino aggiornato.";
      } else {
        merce.push({
          nome: nome,
          quantita: String(qty),
          unita: unit,
          scadenza: expiry,
          soglia: threshold || "0",
          fornitore: supplier,
          posizione: position
        });

        messaggio =
          "FATTURA REGISTRATA\n\n" +
          "Nuovo prodotto creato: " + nome + "\n" +
          "Quantità iniziale: " + qty + " " + unit + "\n" +
          "Fornitore: " + (supplier || "Non indicato") + "\n" +
          "Posizione: " + (position || "Non indicata") + "\n\n" +
          "Magazzino aggiornato.";
      }

      salvaMerceFattura(merce);

      registraMovimentoFattura(
        nome + " +" + qty + " " + unit,
        supplier ? "Fornitore: " + supplier : "Fornitore non indicato"
      );

      if (invoiceOutput) {
        invoiceOutput.textContent = messaggio;
      }

      invoiceForm.reset();

      setTimeout(function () {
        var merceBtn = document.getElementById("nav-merchandise");
        if (merceBtn) merceBtn.click();
      }, 600);
    }, true);
  }
});
document.addEventListener("DOMContentLoaded", function () {
  var photoInput = document.getElementById("invoice-photo");
  var ocrBtn = document.getElementById("ocr-invoice-btn");
  var ocrText = document.getElementById("ocr-invoice-text");
  var importBtn = document.getElementById("import-ocr-lines-btn");
  var ocrOutput = document.getElementById("ocr-invoice-output");

  function leggiMerceOCR() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceOCR(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function leggiMovimentiOCR() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_movimenti")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMovimentiOCR(lista) {
    localStorage.setItem("magazzino_movimenti", JSON.stringify(lista));
  }

  function normalizzaOCR(testo) {
    return String(testo || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function numeroOCR(valore) {
    if (!valore) return 0;
    return Number(String(valore).replace(",", "."));
  }

  function arrotondaOCR(valore) {
    return Math.round(valore * 1000) / 1000;
  }

  function pulisciUnitaOCR(unita) {
    var u = String(unita || "").toLowerCase().trim();

    if (u === "gr" || u === "grammi") return "g";
    if (u === "lt" || u === "litri") return "l";
    if (u === "pezzi" || u === "pcs") return "pz";
    if (u === "conf" || u === "confezione") return "pz";

    return u;
  }

  function registraMovimentoOCR(titolo, dettaglio) {
    var movimenti = leggiMovimentiOCR();

    movimenti.unshift({
      data: new Date().toISOString(),
      tipo: "Foto fattura",
      titolo: titolo,
      dettaglio: dettaglio || ""
    });

    if (movimenti.length > 50) {
      movimenti = movimenti.slice(0, 50);
    }

    salvaMovimentiOCR(movimenti);
  }

  function provaParseRigaOCR(riga) {
    var originale = String(riga || "").trim();

    if (!originale) return null;

    var lower = originale.toLowerCase();

    var paroleDaSaltare = [
      "totale",
      "iva",
      "imponibile",
      "pagamento",
      "fattura",
      "documento",
      "codice",
      "prezzo",
      "sconto",
      "subtotale",
      "partita iva",
      "p.iva"
    ];

    var daSaltare = paroleDaSaltare.some(function (parola) {
      return lower.includes(parola);
    });

    if (daSaltare) return null;

    var unitaRegex = "(kg|g|gr|grammi|l|lt|litri|pz|pezzi|pcs|conf|confezione)";

    var matchProdottoQuantitaUnita = originale.match(
      new RegExp("^(.+?)\\s+(\\d+(?:[\\.,]\\d+)?)\\s*" + unitaRegex + "\\b", "i")
    );

    if (matchProdottoQuantitaUnita) {
      return {
        nome: matchProdottoQuantitaUnita[1].trim(),
        quantita: numeroOCR(matchProdottoQuantitaUnita[2]),
        unita: pulisciUnitaOCR(matchProdottoQuantitaUnita[3])
      };
    }

    var matchProdottoUnitaQuantita = originale.match(
      new RegExp("^(.+?)\\s+" + unitaRegex + "\\s+(\\d+(?:[\\.,]\\d+)?)\\b", "i")
    );

    if (matchProdottoUnitaQuantita) {
      return {
        nome: matchProdottoUnitaQuantita[1].trim(),
        quantita: numeroOCR(matchProdottoUnitaQuantita[3]),
        unita: pulisciUnitaOCR(matchProdottoUnitaQuantita[2])
      };
    }

    return null;
  }

  function estraiProdottiDaTestoOCR(testo) {
    var righe = String(testo || "")
      .split(/\r?\n/)
      .map(function (riga) {
        return riga.trim();
      })
      .filter(Boolean);

    var prodotti = [];

    righe.forEach(function (riga) {
      var prodotto = provaParseRigaOCR(riga);

      if (!prodotto) return;
      if (!prodotto.nome || prodotto.quantita <= 0) return;

      prodotti.push(prodotto);
    });

    return prodotti;
  }

  function aggiornaMagazzinoDaOCR(prodotti) {
    var merce = leggiMerceOCR();
    var log = [];

    if (prodotti.length === 0) {
      return "Nessun prodotto riconosciuto.\n\nFormato che l’app capisce meglio:\nMozzarella 20 kg\nFarina kg 10\nPomodori 5 kg";
    }

    log.push("FOTO FATTURA ELABORATA");
    log.push("");
    log.push("Prodotti riconosciuti: " + prodotti.length);
    log.push("");

    prodotti.forEach(function (prodottoOCR) {
      var esistente = merce.find(function (item) {
        return normalizzaOCR(item.nome) === normalizzaOCR(prodottoOCR.nome);
      });

      if (esistente) {
        var vecchia = numeroOCR(esistente.quantita);
        var nuova = arrotondaOCR(vecchia + prodottoOCR.quantita);

        esistente.quantita = String(nuova);

        if (prodottoOCR.unita) {
          esistente.unita = prodottoOCR.unita;
        }

        log.push(
          "Aggiornato: " +
            esistente.nome +
            " | +" +
            prodottoOCR.quantita +
            " " +
            prodottoOCR.unita +
            " | nuova quantità: " +
            nuova +
            " " +
            (esistente.unita || "")
        );
      } else {
        merce.push({
          nome: prodottoOCR.nome,
          quantita: String(prodottoOCR.quantita),
          unita: prodottoOCR.unita || "",
          scadenza: "",
          soglia: "0",
          fornitore: "Da foto fattura",
          posizione: ""
        });

        log.push(
          "Creato: " +
            prodottoOCR.nome +
            " | quantità: " +
            prodottoOCR.quantita +
            " " +
            prodottoOCR.unita
        );
      }
    });

    salvaMerceOCR(merce);

    registraMovimentoOCR(
      "Carico da foto fattura",
      prodotti.length + " prodotti caricati o aggiornati in magazzino."
    );

    log.push("");
    log.push("Magazzino aggiornato.");
    log.push("Controlla Merce per completare scadenza, soglia e posizione.");

    return log.join("\n");
  }

  if (ocrBtn) {
    ocrBtn.addEventListener("click", function () {
      if (!photoInput || !photoInput.files || !photoInput.files[0]) {
        if (ocrOutput) {
          ocrOutput.textContent = "Scatta o seleziona prima una foto della fattura.";
        }
        return;
      }

      if (typeof Tesseract === "undefined") {
        if (ocrOutput) {
          ocrOutput.textContent =
            "OCR non caricato. Controlla di aver aggiunto lo script Tesseract in index.html prima di app-v2.js.";
        }
        return;
      }

      var file = photoInput.files[0];

      if (ocrOutput) {
        ocrOutput.textContent =
          "Sto leggendo la foto...\n\nTieni la pagina aperta. Può richiedere qualche secondo.";
      }

      Tesseract.recognize(file, "ita+eng", {
        logger: function (m) {
          if (!ocrOutput) return;

          if (m.status) {
            var percentuale = m.progress
              ? " " + Math.round(m.progress * 100) + "%"
              : "";

            ocrOutput.textContent = "Lettura foto: " + m.status + percentuale;
          }
        }
      })
        .then(function (result) {
          var testo = result && result.data ? result.data.text : "";

          if (ocrText) {
            ocrText.value = testo.trim();
          }

          var prodotti = estraiProdottiDaTestoOCR(testo);

          if (ocrOutput) {
            ocrOutput.textContent =
              "Testo letto dalla foto.\n\n" +
              "Prodotti riconosciuti automaticamente: " +
              prodotti.length +
              "\n\nControlla il testo riconosciuto, correggilo se serve, poi premi Carica prodotti riconosciuti.";
          }
        })
        .catch(function () {
          if (ocrOutput) {
            ocrOutput.textContent =
              "Non sono riuscita a leggere la foto. Riprova con una foto più chiara, dritta e ben illuminata.";
          }
        });
    });
  }

  if (importBtn) {
    importBtn.addEventListener("click", function () {
      var testo = ocrText ? ocrText.value : "";
      var prodotti = estraiProdottiDaTestoOCR(testo);
      var risultato = aggiornaMagazzinoDaOCR(prodotti);

      if (ocrOutput) {
        ocrOutput.textContent = risultato;
      }

      if (prodotti.length > 0) {
        setTimeout(function () {
          var merceBtn = document.getElementById("nav-merchandise");
          if (merceBtn) merceBtn.click();
        }, 800);
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  function leggiJSONBackup(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function creaBackupData() {
    return {
      app: "Magazzino Sotto Controllo",
      versione: "1.0",
      creatoIl: new Date().toISOString(),
      dati: {
        merce: leggiJSONBackup("magazzino_merce", []),
        ricette: leggiJSONBackup("magazzino_ricette", []),
        sprechi: leggiJSONBackup("magazzino_sprechi", []),
        movimenti: leggiJSONBackup("magazzino_movimenti", [])
      }
    };
  }

  function creaPannelloBackup() {
    var dashboard = document.getElementById("section-dashboard");
    if (!dashboard) return;

    if (document.getElementById("backup-panel")) return;

    var panel = document.createElement("div");
    panel.id = "backup-panel";
    panel.className = "panel backup-panel";

    panel.innerHTML = `
      <h3>Backup dati</h3>
      <p>Salva una copia del magazzino, delle ricette e dei movimenti.</p>

      <div class="backup-actions">
        <button type="button" id="download-backup-btn">Scarica backup</button>
        <button type="button" id="copy-backup-btn" class="secondary-btn">Copia backup</button>
      </div>

      <label class="backup-upload">
        Ripristina backup
        <input id="restore-backup-file" type="file" accept=".json,application/json">
      </label>

      <pre id="backup-output"></pre>
    `;

    dashboard.appendChild(panel);

    collegaBackup();
  }

  function collegaBackup() {
    var downloadBtn = document.getElementById("download-backup-btn");
    var copyBtn = document.getElementById("copy-backup-btn");
    var restoreInput = document.getElementById("restore-backup-file");
    var output = document.getElementById("backup-output");

    if (downloadBtn) {
      downloadBtn.addEventListener("click", function () {
        var backup = creaBackupData();
        var testo = JSON.stringify(backup, null, 2);

        var blob = new Blob([testo], {
          type: "application/json"
        });

        var url = URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = url;
        a.download = "backup-magazzino-sotto-controllo.json";
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);

        if (output) {
          output.textContent = "Backup creato. Salvalo nei File, su Drive o dove preferisci.";
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var backup = creaBackupData();
        var testo = JSON.stringify(backup, null, 2);

        if (navigator.clipboard) {
          navigator.clipboard.writeText(testo).then(function () {
            if (output) {
              output.textContent = "Backup copiato. Puoi incollarlo in Note, WhatsApp, Drive o email.";
            }
          }).catch(function () {
            if (output) {
              output.textContent = testo;
            }
          });
        } else {
          if (output) {
            output.textContent = testo;
          }
        }
      });
    }

    if (restoreInput) {
      restoreInput.addEventListener("change", function () {
        var file = restoreInput.files && restoreInput.files[0];

        if (!file) return;

        var conferma = confirm(
          "Vuoi ripristinare questo backup? I dati attuali saranno sostituiti."
        );

        if (!conferma) {
          restoreInput.value = "";
          return;
        }

        var reader = new FileReader();

        reader.onload = function (event) {
          try {
            var backup = JSON.parse(event.target.result);
            var dati = backup.dati || {};

            localStorage.setItem("magazzino_merce", JSON.stringify(dati.merce || []));
            localStorage.setItem("magazzino_ricette", JSON.stringify(dati.ricette || []));
            localStorage.setItem("magazzino_sprechi", JSON.stringify(dati.sprechi || []));
            localStorage.setItem("magazzino_movimenti", JSON.stringify(dati.movimenti || []));

            if (output) {
              output.textContent = "Backup ripristinato correttamente. Ricarico l’app...";
            }

            setTimeout(function () {
              location.reload();
            }, 1000);
          } catch (e) {
            if (output) {
              output.textContent = "Errore: il file selezionato non sembra un backup valido.";
            }
          }
        };

        reader.readAsText(file);
      });
    }
  }

  var dashboardBtn = document.getElementById("nav-dashboard");

  if (dashboardBtn) {
    dashboardBtn.addEventListener("click", function () {
      setTimeout(creaPannelloBackup, 300);
    });
  }

  creaPannelloBackup();
});
document.addEventListener("DOMContentLoaded", function () {
  var wasteForm = document.getElementById("waste-form");
  var wasteList = document.getElementById("waste-list");
  var wasteNames = document.getElementById("waste-merce-names");

  function leggiMerceSprechi() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_merce")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerceSprechi(lista) {
    localStorage.setItem("magazzino_merce", JSON.stringify(lista));
  }

  function leggiSprechi() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_sprechi")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaSprechi(lista) {
    localStorage.setItem("magazzino_sprechi", JSON.stringify(lista));
  }

  function leggiMovimentiSprechi() {
    try {
      return JSON.parse(localStorage.getItem("magazzino_movimenti")) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMovimentiSprechi(lista) {
    localStorage.setItem("magazzino_movimenti", JSON.stringify(lista));
  }

  function normalizzaSprechi(testo) {
    return String(testo || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function numeroSprechi(valore) {
    if (!valore) return 0;
    return Number(String(valore).replace(",", "."));
  }

  function arrotondaSprechi(valore) {
    return Math.round(valore * 1000) / 1000;
  }

  function aggiornaDatalistSprechi() {
    if (!wasteNames) return;

    var merce = leggiMerceSprechi();
    wasteNames.innerHTML = "";

    merce.forEach(function (item) {
      if (!item.nome) return;

      var option = document.createElement("option");
      option.value = item.nome;
      wasteNames.appendChild(option);
    });
  }

  function registraMovimentoSpreco(prodotto, quantita, motivo) {
    var movimenti = leggiMovimentiSprechi();

    movimenti.unshift({
      data: new Date().toISOString(),
      tipo: "Spreco",
      titolo: prodotto + " -" + quantita,
      dettaglio: "Motivo: " + motivo
    });

    if (movimenti.length > 50) {
      movimenti = movimenti.slice(0, 50);
    }

    salvaMovimentiSprechi(movimenti);
  }

  function renderSprechi() {
    if (!wasteList) return;

    var sprechi = leggiSprechi();
    wasteList.innerHTML = "";

    if (sprechi.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<strong>Nessuno spreco registrato</strong><br>Quando registri uno spreco, lo vedrai qui.";
      wasteList.appendChild(empty);
      return;
    }

    sprechi.slice(0, 20).forEach(function (spreco) {
      var card = document.createElement("div");
      card.className = "waste-card";

      var header = document.createElement("div");
      header.className = "waste-card-header";

      var left = document.createElement("div");

      var title = document.createElement("h3");
      title.textContent = spreco.prodotto || "Prodotto";

      var date = document.createElement("small");
      date.textContent = new Date(spreco.data).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });

      left.appendChild(title);
      left.appendChild(date);

      var badge = document.createElement("span");
      badge.className = "waste-badge";
      badge.textContent = spreco.motivo || "Spreco";

      header.appendChild(left);
      header.appendChild(badge);

      var detail = document.createElement("div");
      detail.className = "waste-detail";

      var qta = document.createElement("div");
      qta.innerHTML = "<span>Quantità</span><strong>" + (spreco.quantita || "0") + " " + (spreco.unita || "") + "</strong>";

      var nota = document.createElement("div");
      nota.innerHTML = "<span>Nota</span><strong>" + (spreco.nota || "Nessuna nota") + "</strong>";

      detail.appendChild(qta);
      detail.appendChild(nota);

      card.appendChild(header);
      card.appendChild(detail);

      wasteList.appendChild(card);
    });
  }

  if (wasteForm) {
    wasteForm.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      var prodotto = document.getElementById("waste-product").value.trim();
      var quantita = numeroSprechi(document.getElementById("waste-qty").value);
      var motivo = document.getElementById("waste-reason").value;
      var nota = document.getElementById("waste-note").value.trim();

      if (!prodotto || quantita <= 0) {
        alert("Inserisci prodotto e quantità valida.");
        return;
      }

      var merce = leggiMerceSprechi();
      var trovato = merce.find(function (item) {
        return normalizzaSprechi(item.nome) === normalizzaSprechi(prodotto);
      });

      var unita = "";

      if (trovato) {
        var vecchiaQuantita = numeroSprechi(trovato.quantita);
        var nuovaQuantita = vecchiaQuantita - quantita;

        if (nuovaQuantita < 0) nuovaQuantita = 0;

        trovato.quantita = String(arrotondaSprechi(nuovaQuantita));
        unita = trovato.unita || "";

        salvaMerceSprechi(merce);
      }

      var sprechi = leggiSprechi();

      sprechi.unshift({
        data: new Date().toISOString(),
        prodotto: prodotto,
        quantita: String(quantita),
        unita: unita,
        motivo: motivo,
        nota: nota
      });

      if (sprechi.length > 100) {
        sprechi = sprechi.slice(0, 100);
      }

      salvaSprechi(sprechi);
      registraMovimentoSpreco(prodotto, quantita + " " + unita, motivo);

      wasteForm.reset();
      renderSprechi();

      alert(
        trovato
          ? "Spreco registrato e merce scalata dal magazzino."
          : "Spreco registrato. Attenzione: prodotto non trovato in Merce."
      );
    }, true);
  }

  var wasteBtn = document.getElementById("nav-waste");
  if (wasteBtn) {
    wasteBtn.addEventListener("click", function () {
      aggiornaDatalistSprechi();
      setTimeout(renderSprechi, 200);
    });
  }

  aggiornaDatalistSprechi();
  renderSprechi();
});
