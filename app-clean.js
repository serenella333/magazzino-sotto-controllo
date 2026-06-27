document.addEventListener('DOMContentLoaded', function () {
  var sezioni = {
    dashboard: document.getElementById('section-dashboard'),
    merchandise: document.getElementById('section-merchandise'),
    menu: document.getElementById('section-menu'),
    report: document.getElementById('section-report'),
    invoices: document.getElementById('section-invoices'),
    waste: document.getElementById('section-waste'),
    orders: document.getElementById('section-orders')
  };

  var bottoni = {
    dashboard: document.getElementById('nav-dashboard'),
    merchandise: document.getElementById('nav-merchandise'),
    menu: document.getElementById('nav-menu'),
    report: document.getElementById('nav-report'),
    invoices: document.getElementById('nav-invoices'),
    waste: document.getElementById('nav-waste'),
    orders: document.getElementById('nav-orders')
  };

  function leggiMerce() {
    try {
      return JSON.parse(localStorage.getItem('magazzino_merce')) || [];
    } catch (e) {
      return [];
    }
  }

  function salvaMerce(lista) {
    localStorage.setItem('magazzino_merce', JSON.stringify(lista));
  }

  function mostraSezione(nome) {
    Object.keys(sezioni).forEach(function (chiave) {
      if (sezioni[chiave]) {
        sezioni[chiave].style.display = 'none';
        sezioni[chiave].classList.remove('active');
        sezioni[chiave].classList.add('hidden');
      }
    });

    if (sezioni[nome]) {
      sezioni[nome].style.display = 'block';
      sezioni[nome].classList.remove('hidden');
      sezioni[nome].classList.add('active');
    }

    Object.keys(bottoni).forEach(function (chiave) {
      if (bottoni[chiave]) {
        bottoni[chiave].classList.remove('active');
      }
    });

    if (bottoni[nome]) {
      bottoni[nome].classList.add('active');
    }

    if (nome === 'merchandise') {
      renderMerce();
    }

    window.scrollTo(0, 0);
  }

  function renderMerce() {
    var lista = document.getElementById('merce-list');
    if (!lista) return;

    var merce = leggiMerce();
    lista.innerHTML = '';

    if (merce.length === 0) {
      var vuoto = document.createElement('div');
      vuoto.className = 'empty-state';
      vuoto.innerHTML = '<strong>Nessun prodotto inserito</strong><br>Premi “+ Aggiungi merce” per iniziare a catalogare il magazzino.';
      lista.appendChild(vuoto);
      return;
    }

    merce.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML =
        '<div class="product-card-header">' +
          '<div>' +
            '<h3>' + item.nome + '</h3>' +
            '<small>' + (item.fornitore || 'Fornitore non indicato') + '</small>' +
          '</div>' +
          '<span class="status-dot status-ok">OK</span>' +
        '</div>' +
        '<div class="product-meta">' +
          '<div><span>Quantità</span><strong>' + item.quantita + ' ' + item.unita + '</strong></div>' +
          '<div><span>Scadenza</span><strong>' + (item.scadenza || 'Non indicata') + '</strong></div>' +
          '<div><span>Soglia</span><strong>' + (item.soglia || '0') + ' ' + item.unita + '</strong></div>' +
          '<div><span>Posizione</span><strong>' + (item.posizione || 'Non indicata') + '</strong></div>' +
        '</div>';

      lista.appendChild(card);
    });
  }

  function aggiungiMerce() {
    var nome = prompt('Nome merce:');
    if (!nome) return;

    var quantita = prompt('Quantità:') || '0';
    var unita = prompt('Unità di misura: kg, g, l, pz...') || '';
    var scadenza = prompt('Scadenza, formato AAAA-MM-GG oppure lascia vuoto:') || '';
    var soglia = prompt('Soglia minima:') || '0';
    var fornitore = prompt('Fornitore:') || '';
    var posizione = prompt('Posizione: frigo, freezer, scaffale...') || '';

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
      bottoni[chiave].addEventListener('click', function () {
        mostraSezione(chiave);
      });
    }
  });

  var addMerceBtn = document.getElementById('add-merce-btn');
  if (addMerceBtn) {
    addMerceBtn.addEventListener('click', aggiungiMerce);
  }

  mostraSezione('dashboard');
});
