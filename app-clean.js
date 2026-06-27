function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

let merch = loadData('magazzino_merce', []);
let recipes = loadData('magazzino_ricette', []);
let wastes = loadData('magazzino_sprechi', []);

function getSections() {
  return {
    dashboard: document.getElementById('section-dashboard'),
    merchandise: document.getElementById('section-merchandise'),
    menu: document.getElementById('section-menu'),
    report: document.getElementById('section-report'),
    invoices: document.getElementById('section-invoices'),
    waste: document.getElementById('section-waste'),
    orders: document.getElementById('section-orders')
  };
}

function showSection(name) {
  const sections = getSections();

  Object.keys(sections).forEach(key => {
    if (sections[key]) {
      sections[key].classList.remove('active');
      sections[key].classList.add('hidden');
    }
  });

  if (sections[name]) {
    sections[name].classList.remove('hidden');
    sections[name].classList.add('active');
  }

  if (name === 'dashboard') updateDashboard();
  if (name === 'merchandise') renderMerch();
  if (name === 'menu') renderRecipes();
  if (name === 'orders') renderOrders();
  if (name === 'waste') renderWaste();
}

function updateDashboard() {
  const total = merch.length;
  const low = merch.filter(item => Number(item.qty) <= Number(item.threshold));
  const expiring = merch.filter(item => {
    if (!item.expiry) return false;
    return new Date(item.expiry) <= new Date(Date.now() + 72 * 3600 * 1000);
  });

  const totalEl = document.getElementById('dashboard-total-products');
  const lowEl = document.getElementById('dashboard-low-stock');
  const expiringEl = document.getElementById('dashboard-expiring');
  const ordersEl = document.getElementById('dashboard-orders');
  const summaryEl = document.getElementById('dashboard-summary');
  const notificationsEl = document.getElementById('dashboard-notifications');

  if (totalEl) totalEl.textContent = total;
  if (lowEl) lowEl.textContent = low.length;
  if (expiringEl) expiringEl.textContent = expiring.length;
  if (ordersEl) ordersEl.textContent = low.length;

  if (summaryEl) {
    if (total === 0) {
      summaryEl.textContent = 'Il magazzino è ancora vuoto. Inizia inserendo la merce principale.';
    } else if (low.length === 0 && expiring.length === 0) {
      summaryEl.textContent = 'Situazione sotto controllo. Nessun prodotto sotto soglia e nessuna scadenza urgente.';
    } else {
      summaryEl.textContent = `Attenzione: ${low.length} prodotti sotto soglia e ${expiring.length} prodotti in scadenza.`;
    }
  }

  if (notificationsEl) {
    notificationsEl.innerHTML = '';

    if (total === 0) {
      notificationsEl.innerHTML = '<li>Aggiungi la prima merce per iniziare.</li>';
      return;
    }

    low.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name}: sotto soglia.`;
      notificationsEl.appendChild(li);
    });

    expiring.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name}: in scadenza il ${item.expiry}.`;
      notificationsEl.appendChild(li);
    });

    if (low.length === 0 && expiring.length === 0) {
      notificationsEl.innerHTML = '<li>Nessun avviso urgente.</li>';
    }
  }
}

function renderMerch() {
  const container = document.getElementById('merce-list');
  if (!container) return;

  const search = document.getElementById('merce-search');
  const query = search ? search.value.toLowerCase().trim() : '';

  const filtered = merch.filter(item => {
    const text = `${item.name || ''} ${item.supplier || ''} ${item.location || ''} ${item.unit || ''}`.toLowerCase();
    return text.includes(query);
  });

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <strong>Nessun prodotto inserito</strong><br>
        Premi “+ Aggiungi merce” per iniziare a catalogare il magazzino.
      </div>
    `;
    updateDashboard();
    return;
  }

  filtered.forEach(item => {
    const isLow = Number(item.qty) <= Number(item.threshold);
    const isExpiring = item.expiry && new Date(item.expiry) <= new Date(Date.now() + 72 * 3600 * 1000);

    let statusClass = 'status-ok';
    let statusText = 'OK';

    if (isLow) {
      statusClass = 'status-low';
      statusText = 'Sotto soglia';
    }

    if (isExpiring) {
      statusClass = 'status-expiring';
      statusText = 'In scadenza';
    }

    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-card-header">
        <div>
          <h3>${item.name || 'Prodotto senza nome'}</h3>
          <small>${item.supplier || 'Fornitore non indicato'}</small>
        </div>
        <span class="status-dot ${statusClass}">${statusText}</span>
      </div>

      <div class="product-meta">
        <div>
          <span>Giacenza</span>
          <strong>${item.qty || 0} ${item.unit || ''}</strong>
        </div>
        <div>
          <span>Soglia minima</span>
          <strong>${item.threshold || 0} ${item.unit || ''}</strong>
        </div>
        <div>
          <span>Scadenza</span>
          <strong>${item.expiry || 'Non indicata'}</strong>
        </div>
        <div>
          <span>Posizione</span>
          <strong>${item.location || 'Non indicata'}</strong>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  updateDashboard();
}

function addMerce() {
  const name = prompt('Nome prodotto:');
  if (!name) return;

  const qty = parseFloat(prompt('Quantità:')) || 0;
  const unit = prompt('Unità: kg, g, l, pz, confezioni...') || '';
  const expiry = prompt('Scadenza AAAA-MM-GG oppure lascia vuoto:') || '';
  const threshold = parseFloat(prompt('Soglia minima:')) || 0;
  const supplier = prompt('Fornitore:') || '';
  const location = prompt('Posizione: frigo, freezer, scaffale...') || '';

  merch.push({ name, qty, unit, expiry, threshold, supplier, location });
  saveData('magazzino_merce', merch);
  renderMerch();
  updateDashboard();
}

function renderRecipes() {
  const container = document.getElementById('recipe-list');
  const tableBody = document.querySelector('#menu-table tbody');

  if (container) {
    container.innerHTML = '';

    if (recipes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <strong>Nessuna ricetta inserita</strong><br>
          Crea il primo piatto e collega gli ingredienti del magazzino.
        </div>
      `;
      return;
    }

    recipes.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'recipe-card';

      const ingredientsHtml = recipe.ingredients.map(ing => `
        <div class="recipe-ingredient">
          <strong>${ing.name}</strong>
          <span>${ing.qty} ${ing.unit || ''}</span>
        </div>
      `).join('');

      card.innerHTML = `
        <div class="recipe-card-header">
          <div>
            <h3>${recipe.name}</h3>
            <small>${recipe.ingredients.length} ingredienti collegati</small>
          </div>
          <span class="recipe-badge">Ricetta</span>
        </div>
        <div class="recipe-ingredients">${ingredientsHtml}</div>
      `;

      container.appendChild(card);
    });

    return;
  }

  if (tableBody) {
    tableBody.innerHTML = '';
  }
}

function addRecipe() {
  const name = prompt('Nome piatto:');
  if (!name) return;

  const ingredients = [];

  while (true) {
    const ingName = prompt('Ingrediente, lascia vuoto per terminare:');
    if (!ingName) break;

    const qty = parseFloat(prompt(`Quantità di ${ingName} per porzione:`)) || 0;
    const unit = prompt(`Unità di ${ingName}:`) || '';

    ingredients.push({ name: ingName, qty, unit });
  }

  recipes.push({ name, ingredients });
  saveData('magazzino_ricette', recipes);
  renderRecipes();
}

function renderWaste() {
  const ul = document.getElementById('waste-list');
  if (!ul) return;

  ul.innerHTML = '';

  if (wastes.length === 0) {
    ul.innerHTML = '<li>Nessuno spreco registrato.</li>';
    return;
  }

  wastes.forEach(w => {
    const li = document.createElement('li');
    li.textContent = `${w.prod}: -${w.qty} (${w.reason})`;
    ul.appendChild(li);
  });
}

function renderOrders() {
  const ul = document.getElementById('order-list');
  if (!ul) return;

  ul.innerHTML = '';

  const low = merch.filter(item => Number(item.qty) <= Number(item.threshold));

  if (low.length === 0) {
    ul.innerHTML = '<li>Nessun ordine urgente.</li>';
    return;
  }

  low.forEach(item => {
    const suggested = Math.max((Number(item.threshold) * 2) - Number(item.qty), 0);
    const li = document.createElement('li');
    li.textContent = `${item.name}: ordina circa ${suggested} ${item.unit || ''}`;
    ul.appendChild(li);
  });
}

function setupNavigation() {
  const navs = {
    'nav-dashboard': 'dashboard',
    'nav-merchandise': 'merchandise',
    'nav-menu': 'menu',
    'nav-report': 'report',
    'nav-invoices': 'invoices',
    'nav-waste': 'waste',
    'nav-orders': 'orders'
  };

  Object.keys(navs).forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', () => showSection(navs[id]));
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();

  const addMerceBtn = document.getElementById('add-merce-btn');
  if (addMerceBtn) addMerceBtn.addEventListener('click', addMerce);

  const addRecipeBtn = document.getElementById('add-recipe-btn');
  if (addRecipeBtn) addRecipeBtn.addEventListener('click', addRecipe);

  const merceSearch = document.getElementById('merce-search');
  if (merceSearch) merceSearch.addEventListener('input', renderMerch);

  updateDashboard();
  renderMerch();
  renderRecipes();
  renderWaste();
  renderOrders();
  showSection('dashboard');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => {
      console.error('Service worker registration failed:', err);
    });
  });
}
