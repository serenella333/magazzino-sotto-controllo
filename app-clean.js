document.addEventListener('DOMContentLoaded', function () {
  const sections = {
    dashboard: document.getElementById('section-dashboard'),
    merchandise: document.getElementById('section-merchandise'),
    menu: document.getElementById('section-menu'),
    report: document.getElementById('section-report'),
    invoices: document.getElementById('section-invoices'),
    waste: document.getElementById('section-waste'),
    orders: document.getElementById('section-orders')
  };

  const buttons = {
    dashboard: document.getElementById('nav-dashboard'),
    merchandise: document.getElementById('nav-merchandise'),
    menu: document.getElementById('nav-menu'),
    report: document.getElementById('nav-report'),
    invoices: document.getElementById('nav-invoices'),
    waste: document.getElementById('nav-waste'),
    orders: document.getElementById('nav-orders')
  };

  function showOnly(name) {
    Object.keys(sections).forEach(function (key) {
      if (sections[key]) {
        sections[key].style.display = 'none';
        sections[key].classList.remove('active');
        sections[key].classList.add('hidden');
      }
    });

    if (sections[name]) {
      sections[name].style.display = 'block';
      sections[name].classList.remove('hidden');
      sections[name].classList.add('active');
    }

    Object.keys(buttons).forEach(function (key) {
      if (buttons[key]) {
        buttons[key].classList.remove('active');
      }
    });

    if (buttons[name]) {
      buttons[name].classList.add('active');
    }

    if (name === 'merchandise') {
      const list = document.getElementById('merce-list');
      if (list && list.innerHTML.trim() === '') {
        list.innerHTML = '<div class="empty-state"><strong>Nessun prodotto inserito</strong><br>Premi + Aggiungi merce per iniziare a catalogare il magazzino.</div>';
      }
    }

    window.scrollTo(0, 0);
  }

  window.showSection = showOnly;

  Object.keys(buttons).forEach(function (key) {
    if (buttons[key]) {
      buttons[key].addEventListener('click', function () {
        showOnly(key);
      });
    }
  });

let merce = JSON.parse(localStorage.getItem('magazzino_merce') || '[]');

function salvaMerce() {
  localStorage.setItem('magazzino_merce', JSON.stringify(merce));
}

function renderMerce() {
  const list = document.getElementById('merce-list');
  if (!list) return;

  if (merce.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <strong>Nessun prodotto inserito</strong><br>
        Premi “+ Aggiungi merce” per iniziare a catalogare il magazzino.
      </div>
    `;
    return;
  }

  list.innerHTML = '';

  merce.forEach(function (item) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-card-header">
        <div>
          <h3>${item.nome}</h3>
          <small>${item.fornitore || 'Fornitore non indicato'}</small>
        </div>
        <span class="status-dot status-ok">OK</span>
      </div>

      <div class="product-meta">
        <div>
          <span>Quantità</span>
          <strong>${item.quantita} ${item.unita}</strong>
        </div>
        <div>
          <span>Scadenza</span>
          <strong>${item.scadenza || 'Non indicata'}</strong>
        </div>
        <div>
          <span>Soglia</span>
          <strong>${item.soglia || 0} ${item.unita}</strong>
        </div>
        <div>
          <span>Posizione</span>
          <strong>${item.posizione || 'Non indicata'}</strong>
        </div>
      </div>
    `;

    list.appendChild(card);
  });
}

const addMerceBtn = document.getElementById('add-merce-btn');
if (addMerceBtn) {
  addMerceBtn.addEventListener('click', function () {
    const nome = prompt('Nome merce:');
    if (!nome) return;

    const quantita = prompt('Quantità:') || '0';
    const unita = prompt('Unità di misura: kg, g, l, pz...') || '';
    const scadenza = prompt('Scadenza, formato AAAA-MM-GG oppure lascia vuoto:') || '';
    const soglia = prompt('Soglia minima:') || '0';
    const fornitore = prompt('Fornitore:') || '';
    const posizione = prompt('Posizione: frigo, freezer, scaffale...') || '';

    merce.push({
      nome,
      quantita,
      unita,
      scadenza,
      soglia,
      fornitore,
      posizione
    });

    salvaMerce();
    renderMerce();
  });
}

renderMerce();

  showOnly('dashboard');
});
