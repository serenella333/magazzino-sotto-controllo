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

  const addMerceBtn = document.getElementById('add-merce-btn');
  if (addMerceBtn) {
    addMerceBtn.addEventListener('click', function () {
      alert('Funzione inserimento merce: la riattiviamo nel prossimo step.');
    });
  }

  showOnly('dashboard');
});
