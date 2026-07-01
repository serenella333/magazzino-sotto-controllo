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
