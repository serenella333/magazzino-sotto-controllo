/*
 * Magazzino Sotto Controllo
 *
 * Questa è una versione semplificata dell'applicazione per la gestione
 * del magazzino e delle ricette. I dati sono memorizzati in localStorage
 * e ricaricati all'avvio. Le funzioni includono:
 *  - Visualizzazione e aggiunta merce
 *  - Definizione di piatti/ricette con ingredienti
 *  - Importazione di report vendite (CSV/TXT) con calcolo consumi
 *  - Importazione di fatture fornitori (CSV/TXT) per carico merce
 *  - Registrazione sprechi (prodotti buttati, invenduti, omaggi, etc.)
 *  - Generazione lista ordini per prodotti sotto soglia
 *  - Notifiche e riepilogo in dashboard
 */

// Storage helpers
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

// Data structures
let merch = loadData('magazzino_merce', []);
let recipes = loadData('magazzino_ricette', []);
let wastes = loadData('magazzino_sprechi', []);

// DOM references
const sections = {
  dashboard: document.getElementById('section-dashboard'),
  merchandise: document.getElementById('section-merchandise'),
  menu: document.getElementById('section-menu'),
  report: document.getElementById('section-report'),
  invoices: document.getElementById('section-invoices'),
  waste: document.getElementById('section-waste'),
  orders: document.getElementById('section-orders')
};

function showSection(name) {
  Object.keys(sections).forEach(k => {
    sections[k].classList.add('hidden');
    sections[k].classList.remove('active');
  });
  sections[name].classList.remove('hidden');
  sections[name].classList.add('active');
}

// Navigation
document.getElementById('nav-dashboard').addEventListener('click', () => showSection('dashboard'));
document.getElementById('nav-merchandise').addEventListener('click', () => {
  showSection('merchandise');
  renderMerchTable();
});
document.getElementById('nav-menu').addEventListener('click', () => {
  showSection('menu');
  renderMenuTable();
});
document.getElementById('nav-report').addEventListener('click', () => {
  showSection('report');
});
document.getElementById('nav-invoices').addEventListener('click', () => {
  showSection('invoices');
});
document.getElementById('nav-waste').addEventListener('click', () => {
  showSection('waste');
  renderWasteList();
});
document.getElementById('nav-orders').addEventListener('click', () => {
  showSection('orders');
  renderOrders();
});

// Utility to update dashboard summary and notifications
function updateDashboard() {
  const summaryEl = document.getElementById('dashboard-summary');
  const notificationsEl = document.getElementById('dashboard-notifications');
  const totalItems = merch.length;
  const lowStock = merch.filter(item => item.qty <= item.threshold).length;
  const expiring = merch.filter(item => item.expiry && new Date(item.expiry) < new Date(Date.now() + 72 * 3600 * 1000)).length;
  summaryEl.textContent = `Totale prodotti: ${totalItems}. Prodotti sotto soglia: ${lowStock}. Prodotti in scadenza (72h): ${expiring}.`;
  // Notifications: show low stock and expiring items
  notificationsEl.innerHTML = '';
  merch.forEach(item => {
    if (item.qty <= item.threshold) {
      const li = document.createElement('li');
      li.textContent = `${item.name}: sotto soglia (qta ${item.qty})`;
      notificationsEl.appendChild(li);
    }
    if (item.expiry && new Date(item.expiry) < new Date(Date.now() + 72 * 3600 * 1000)) {
      const li = document.createElement('li');
      li.textContent = `${item.name}: in scadenza il ${item.expiry}`;
      notificationsEl.appendChild(li);
    }
  });
}

/* =======================
 * Merchandise functions
 * ======================= */

function renderMerchTable() {
  const tbody = document.querySelector('#merce-table tbody');
  tbody.innerHTML = '';
  merch.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.unit}</td>
      <td>${item.expiry || '-'}</td>
      <td>${item.threshold}</td>
      <td>${item.supplier}</td>
      <td>${item.location}</td>
    `;
    tbody.appendChild(tr);
  });
  updateDashboard();
}

// Add merchandise via prompt
document.getElementById('add-merce-btn').addEventListener('click', () => {
  const name = prompt('Nome prodotto:');
  if (!name) return;
  const qty = parseFloat(prompt('Quantità:')); 
  if (isNaN(qty)) return;
  const unit = prompt('Unità (es. kg, g, pz):') || '';
  const expiry = prompt('Scadenza (AAAA-MM-GG):') || null;
  const threshold = parseFloat(prompt('Soglia minima per riordino:')) || 0;
  const supplier = prompt('Fornitore:') || '';
  const location = prompt('Posizione (frigo, freezer, scaffale):') || '';
  merch.push({ name, qty, unit, expiry, threshold, supplier, location });
  saveData('magazzino_merce', merch);
  renderMerchTable();
});

/* =======================
 * Menu / recipes functions
 * ======================= */

function renderMenuTable() {
  const tbody = document.querySelector('#menu-table tbody');
  tbody.innerHTML = '';
  recipes.forEach((rec, index) => {
    const li = rec.ingredients.map(ing => `${ing.qty}${ing.unit} ${ing.name}`).join(', ');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${rec.name}</td>
      <td>${li}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Add recipe via prompt
document.getElementById('add-recipe-btn').addEventListener('click', () => {
  const name = prompt('Nome piatto:');
  if (!name) return;
  const ingredients = [];
  while (true) {
    const prodName = prompt('Ingrediente (lascia vuoto per terminare):');
    if (!prodName) break;
    const qty = parseFloat(prompt(`Quantità di ${prodName} per porzione:`));
    if (isNaN(qty)) continue;
    const unit = prompt(`Unità di ${prodName}:`) || '';
    ingredients.push({ name: prodName, qty, unit });
  }
  recipes.push({ name, ingredients });
  saveData('magazzino_ricette', recipes);
  renderMenuTable();
});

/* =======================
 * Report vendite
 * ======================= */

// CSV parser: splits by newline and semicolon/comma
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line => {
    const parts = line.split(/[,;\t]/).map(p => p.trim());
    return parts;
  });
}

document.getElementById('process-report-btn').addEventListener('click', () => {
  const fileInput = document.getElementById('report-file');
  const file = fileInput.files[0];
  if (!file) {
    alert('Seleziona un file di report vendite');
    return;
  }
  const reader = new FileReader();
  reader.onload = function() {
    const rows = parseCSV(reader.result);
    processSalesReport(rows);
  };
  reader.readAsText(file);
});

function processSalesReport(rows) {
  /*
   * Expect format: Piatto;Quantità
   * For ogni riga, cerca la ricetta e scala gli ingredienti.
   */
  let summary = '';
  rows.forEach(row => {
    const dish = row[0];
    const count = parseFloat(row[1]);
    if (!dish || isNaN(count)) return;
    const recipe = recipes.find(r => r.name === dish);
    if (!recipe) {
      summary += `${dish}: ricetta non trovata\n`;
      return;
    }
    // Scala ingredienti
    recipe.ingredients.forEach(ing => {
      const item = merch.find(m => m.name === ing.name);
      if (!item) return;
      item.qty -= ing.qty * count;
    });
    summary += `${dish}: elaborato ${count} porzioni\n`;
  });
  // Salva magazzino e mostra riepilogo
  saveData('magazzino_merce', merch);
  renderMerchTable();
  document.getElementById('report-output').textContent = summary;
}

/* =======================
 * Importazione fatture fornitori
 * ======================= */

document.getElementById('process-invoice-btn').addEventListener('click', () => {
  const fileInput = document.getElementById('invoice-file');
  const file = fileInput.files[0];
  if (!file) {
    alert('Seleziona un file di fattura');
    return;
  }
  const reader = new FileReader();
  reader.onload = function() {
    const rows = parseCSV(reader.result);
    processInvoice(rows);
  };
  reader.readAsText(file);
});

function processInvoice(rows) {
  /*
   * Expect format: Nome;Quantità;Unità;Fornitore
   */
  let summary = '';
  rows.forEach(row => {
    const name = row[0];
    const qty = parseFloat(row[1]);
    const unit = row[2] || '';
    const supplier = row[3] || '';
    if (!name || isNaN(qty)) return;
    let item = merch.find(m => m.name === name);
    if (!item) {
      // Create new entry with threshold 0
      item = { name, qty: 0, unit, expiry: null, threshold: 0, supplier, location: '' };
      merch.push(item);
    }
    item.qty += qty;
    if (unit) item.unit = unit;
    if (supplier) item.supplier = supplier;
    summary += `${name}: aggiunti ${qty}${unit}\n`;
  });
  saveData('magazzino_merce', merch);
  renderMerchTable();
  document.getElementById('invoice-output').textContent = summary;
}

/* =======================
 * Sprechi / consumi non venduti
 * ======================= */
document.getElementById('waste-form').addEventListener('submit', event => {
  event.preventDefault();
  const prod = document.getElementById('waste-product').value;
  const qty = parseFloat(document.getElementById('waste-qty').value);
  const reason = document.getElementById('waste-reason').value;
  if (!prod || isNaN(qty)) return;
  wastes.push({ prod, qty, reason, date: new Date().toISOString() });
  const item = merch.find(m => m.name === prod);
  if (item) item.qty -= qty;
  saveData('magazzino_merce', merch);
  saveData('magazzino_sprechi', wastes);
  renderWasteList();
  renderMerchTable();
  document.getElementById('waste-product').value = '';
  document.getElementById('waste-qty').value = '';
});

function renderWasteList() {
  const ul = document.getElementById('waste-list');
  ul.innerHTML = '';
  wastes.forEach(w => {
    const li = document.createElement('li');
    li.textContent = `${w.prod}: -${w.qty} (${w.reason}) [${w.date.substring(0, 10)}]`;
    ul.appendChild(li);
  });
}

/* =======================
 * Ordini consigliati
 * ======================= */
function renderOrders() {
  const ul = document.getElementById('order-list');
  ul.innerHTML = '';
  merch.forEach(item => {
    if (item.qty <= item.threshold) {
      const li = document.createElement('li');
      const reorderQty = item.threshold * 2 - item.qty; // Suggest reorder to twice threshold
      li.textContent = `${item.name}: consiglia ordinare ${reorderQty} ${item.unit} (in magazzino ${item.qty})`;
      ul.appendChild(li);
    }
  });
}

// Initialize display
document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
  renderMerchTable();
  renderMenuTable();
  renderWasteList();
  renderOrders();
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => {
      console.error('Service worker registration failed:', err);
    });
  });
}
