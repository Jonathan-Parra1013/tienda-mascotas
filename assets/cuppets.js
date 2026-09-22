/* ==========================================================================
   CUPPETS SHOPIFY THEME - GLOBAL THEME JAVASCRIPT (CUPPETS.JS)
   Clean, Pure Shopify Dynamic Interactive Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initKeyboardShortcuts();
});

// ==========================================
// 1. SPECIES SWITCHER FILTER (Perros / Gatos / Todos)
// ==========================================
window.filterByPetType = function(type) {
  document.querySelectorAll('.species-switcher .switcher-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-type') === type);
  });

  if (type === 'dog') {
    window.location.href = '/collections/perros';
  } else if (type === 'cat') {
    window.location.href = '/collections/gatos';
  } else {
    window.location.href = '/collections/all';
  }
};

// ==========================================
// 2. SEARCH MODAL & PREDICTIVE SEARCH
// ==========================================
window.openSearchModal = function() {
  const modal = document.getElementById('search-modal');
  const backdrop = document.getElementById('search-modal-backdrop');
  if (modal && backdrop) {
    modal.classList.add('active');
    backdrop.classList.add('active');
    setTimeout(() => {
      document.getElementById('predictive-search-input')?.focus();
    }, 100);
  }
};

window.closeSearchModal = function() {
  const modal = document.getElementById('search-modal');
  const backdrop = document.getElementById('search-modal-backdrop');
  if (modal && backdrop) {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
  }
};

window.handlePredictiveSearch = function(query) {
  // Can be extended with Shopify Predictive Search API (/search/suggest.json)
};

window.clearPredictiveSearch = function() {
  const input = document.getElementById('predictive-search-input');
  if (input) {
    input.value = '';
    input.focus();
  }
};

window.executeSearchChip = function(term) {
  window.location.href = `/search?q=${encodeURIComponent(term)}`;
};

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // CMD+K or CTRL+K for Search
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    // Escape closes all modals/drawers
    if (e.key === 'Escape') {
      closeSearchModal();
      closeAccountDrawer();
      if (window.shopifyCart) window.shopifyCart.closeDrawer();
    }
  });
}

// ==========================================
// 3. SHOPIFY NATIVE ACCOUNT DRAWER / MODAL
// ==========================================
window.openAccountDrawer = function() {
  const drawer = document.getElementById('account-drawer');
  const backdrop = document.getElementById('account-drawer-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('active');
    backdrop.classList.add('active');
  }
};

window.closeAccountDrawer = function() {
  const drawer = document.getElementById('account-drawer');
  const backdrop = document.getElementById('account-drawer-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
  }
};

// ==========================================
// 4. CART DRAWER HELPERS & WHATSAPP CHECKOUT
// ==========================================
window.toggleCartDrawer = function() {
  if (window.shopifyCart) {
    const drawer = document.getElementById('cart-drawer');
    if (drawer && drawer.classList.contains('active')) {
      window.shopifyCart.closeDrawer();
    } else {
      window.shopifyCart.openDrawer();
    }
  }
};

window.applyPromoCode = function() {
  const input = document.getElementById('cart-promo-code');
  const code = input ? input.value.trim().toUpperCase() : '';
  const discountLine = document.getElementById('cart-discount-line');
  const discountVal = document.getElementById('cart-discount-val');

  if (code === 'CUPPETS15') {
    if (discountLine) discountLine.style.display = 'flex';
    if (discountVal) discountVal.textContent = '-15% APLICADO';
    showToast('¡Cupón CUPPETS15 aplicado! Ahorraste un 15% 🎉', 'success');
  } else if (code.length > 0) {
    showToast('Código no válido. Prueba con CUPPETS15', 'info');
  }
};

window.checkoutViaWhatsApp = function() {
  const waNumber = '573009876543';
  const total = document.getElementById('cart-total-val')?.textContent || '$0 COP';
  const msg = `¡Hola Cuppets! 🐾 Quiero finalizar mi pedido por WhatsApp.\nTotal: ${total}\n¿Me ayudas a confirmarlo?`;
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
};

// ==========================================
// 5. FAQ ACCORDION
// ==========================================
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const item = btn.closest('.faq-item');
      if (item) {
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      }
    });
  });
}

// ==========================================
// 6. MOBILE MENU TOGGLE
// ==========================================
window.toggleMobileMenu = function() {
  const nav = document.querySelector('.nav-bar');
  if (nav) {
    if (nav.style.display === 'block') {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'block';
    }
  }
};

// ==========================================
// 7. TOAST NOTIFICATIONS
// ==========================================
window.showToast = function(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-pill';
  toast.innerHTML = `<i class="fa-solid fa-paw" style="color: var(--primary);"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// ==========================================
// 8. FOOTER NEWSLETTER SUBSCRIPTION
// ==========================================
window.handleNewsletterSubmit = function(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  if (input && input.value) {
    showToast('¡Gracias! Te has suscrito exitosamente 🐾');
    input.value = '';
  }
};
