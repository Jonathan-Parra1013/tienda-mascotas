/* ==========================================================================
   CUPPETS SHOPIFY THEME - GLOBAL THEME CONTROLLER (CUPPETS.JS)
   Clean, Pure Dynamic Interactive Experience for Dogs & Cats
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initKeyboardShortcuts();
  checkUrlFilterParams();
  updateCategoryCounters();
});

// State
let activePetFilter = 'all';
let activeCategoryFilter = 'all';

// ==========================================
// 1. SPECIES SWITCHER & PET FILTERING (PERROS / GATOS / TODOS)
// ==========================================
window.filterByPetType = function(type) {
  activePetFilter = type;

  // Update switcher buttons across the header & page
  document.querySelectorAll('.species-switcher .switcher-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-type') === type || btn.textContent.toLowerCase().includes(type === 'dog' ? 'perro' : type === 'cat' ? 'gato' : 'todo'));
  });

  const catalogGrid = document.getElementById('catalog-products-grid');
  if (catalogGrid) {
    applyCatalogFilters();
    // Smooth scroll to catalog section if triggered from header
    const catalogSec = document.getElementById('catalogo-destacado') || document.getElementById('MainContent');
    if (catalogSec && window.scrollY < 300) {
      catalogSec.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // Navigate to dedicated collection if on another page
    if (type === 'dog') {
      window.location.href = '/collections/perros';
    } else if (type === 'cat') {
      window.location.href = '/collections/gatos';
    } else {
      window.location.href = '/collections/all';
    }
  }
};

window.filterCatalogByPet = function(petType, btnElement) {
  activePetFilter = petType;

  // Update tab buttons
  document.querySelectorAll('.pet-tab-btn, .filter-link-btn').forEach(btn => {
    if (btn.getAttribute('data-pet') === petType) {
      btn.classList.add('active');
    } else if (btn.getAttribute('data-pet')) {
      btn.classList.remove('active');
    }
  });

  // Sync header switcher buttons
  document.querySelectorAll('.species-switcher .switcher-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-type') === petType);
  });

  applyCatalogFilters();
};

// ==========================================
// 2. CATEGORY SUBFILTER (Arneses / Collares / Correas / Camas)
// ==========================================
window.filterCatalogByCategory = function(category, btnElement) {
  activeCategoryFilter = category;

  // Update category chip buttons
  document.querySelectorAll('.subfilter-chip, .filter-link-btn[data-cat]').forEach(chip => {
    if (chip.getAttribute('data-cat') === category) {
      chip.classList.add('active');
    } else if (chip.getAttribute('data-cat')) {
      chip.classList.remove('active');
    }
  });

  applyCatalogFilters();
};

function applyCatalogFilters() {
  const items = document.querySelectorAll('.catalog-product-item');
  const noResults = document.getElementById('catalog-no-results');
  let visibleCount = 0;

  items.forEach(item => {
    const itemPet = item.getAttribute('data-pet-type') || 'all';
    const itemCat = item.getAttribute('data-category') || 'all';

    const matchesPet = (activePetFilter === 'all' || itemPet === activePetFilter || itemPet === 'all');
    const matchesCat = (activeCategoryFilter === 'all' || itemCat.includes(activeCategoryFilter) || itemCat === 'all');

    if (matchesPet && matchesCat) {
      item.style.display = 'block';
      item.style.animation = 'fadeInProduct 0.35s ease forwards';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });

  // Update visible counter
  const counterEl = document.getElementById('catalog-visible-count');
  if (counterEl) counterEl.textContent = visibleCount;

  // Empty state handling
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

window.resetCatalogFilters = function() {
  activePetFilter = 'all';
  activeCategoryFilter = 'all';

  document.querySelectorAll('.pet-tab-btn, .subfilter-chip, .filter-link-btn').forEach(btn => {
    if (btn.getAttribute('data-pet') === 'all' || btn.getAttribute('data-cat') === 'all') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  applyCatalogFilters();
  if (window.showToast) window.showToast('Filtros restablecidos 🐾', 'info');
};

function updateCategoryCounters() {
  let countAll = 0;
  let countDog = 0;
  let countCat = 0;

  document.querySelectorAll('.catalog-product-item').forEach(item => {
    countAll++;
    const pet = item.getAttribute('data-pet-type');
    if (pet === 'dog') countDog++;
    if (pet === 'cat') countCat++;
  });

  const elAll = document.getElementById('count-all');
  const elDog = document.getElementById('count-dog');
  const elCat = document.getElementById('count-cat');

  if (elAll && countAll > 0) elAll.textContent = countAll;
  if (elDog && countDog > 0) elDog.textContent = countDog;
  if (elCat && countCat > 0) elCat.textContent = countCat;
}

function checkUrlFilterParams() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('perro')) {
    filterCatalogByPet('dog');
  } else if (path.includes('gato')) {
    filterCatalogByPet('cat');
  } else if (path.includes('arnes')) {
    filterCatalogByCategory('arneses');
  } else if (path.includes('collar')) {
    filterCatalogByCategory('collares');
  } else if (path.includes('correa')) {
    filterCatalogByCategory('correas');
  } else if (path.includes('cama')) {
    filterCatalogByCategory('camas');
  }
}

// ==========================================
// 3. SORTING PRODUCTS
// ==========================================
window.sortCatalogProducts = function(sortBy) {
  const grid = document.getElementById('catalog-products-grid');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.catalog-product-item'));

  items.sort((a, b) => {
    const priceA = parseFloat(a.getAttribute('data-price') || 50000);
    const priceB = parseFloat(b.getAttribute('data-price') || 50000);
    const ratingA = parseFloat(a.getAttribute('data-rating') || 5);
    const ratingB = parseFloat(b.getAttribute('data-rating') || 5);

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return ratingB - ratingA;
    return 0;
  });

  items.forEach(item => grid.appendChild(item));
  applyCatalogFilters();
};

// ==========================================
// 4. SEARCH MODAL & PREDICTIVE SEARCH
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
  const q = query.trim().toLowerCase();
  const resultsContainer = document.getElementById('predictive-search-results');
  
  if (!q) {
    if (resultsContainer) resultsContainer.innerHTML = '';
    return;
  }

  // Live filter local products
  const items = document.querySelectorAll('.catalog-product-item');
  let matches = [];

  items.forEach(item => {
    const title = item.querySelector('.product-title-link')?.textContent || '';
    const cat = item.querySelector('.product-category-name')?.textContent || '';
    if (title.toLowerCase().includes(q) || cat.toLowerCase().includes(q)) {
      matches.push({ title, cat });
    }
  });

  if (resultsContainer) {
    if (matches.length > 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 12px; background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); margin-top: 10px;">
          <strong style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 8px;">RESULTADOS ENCONTRADOS (${matches.length})</strong>
          ${matches.slice(0, 4).map(m => `
            <div style="padding: 8px 12px; border-radius: var(--radius-sm); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='var(--brand-purple-soft)'" onmouseout="this.style.background='transparent'" onclick="executeSearchChip('${m.title}')">
              <span style="font-weight: 600; color: var(--brand-navy);">${m.title}</span>
              <span style="font-size: 0.78rem; color: var(--brand-purple); display: block;">${m.cat}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      resultsContainer.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          No se encontraron coincidencias para "${query}".
        </div>
      `;
    }
  }
};

window.clearPredictiveSearch = function() {
  const input = document.getElementById('predictive-search-input');
  if (input) {
    input.value = '';
    input.focus();
    handlePredictiveSearch('');
  }
};

window.executeSearchChip = function(term) {
  closeSearchModal();
  const input = document.getElementById('predictive-search-input');
  if (input) input.value = term;

  const catalogGrid = document.getElementById('catalog-products-grid');
  if (catalogGrid) {
    const t = term.toLowerCase();
    document.querySelectorAll('.catalog-product-item').forEach(item => {
      const title = item.querySelector('.product-title-link')?.textContent.toLowerCase() || '';
      const cat = item.getAttribute('data-category') || '';
      item.style.display = (title.includes(t) || cat.includes(t)) ? 'block' : 'none';
    });
    const catalogSec = document.getElementById('catalogo-destacado') || document.getElementById('MainContent');
    if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
    showToast(`Mostrando resultados para: "${term}"`, 'info');
  } else {
    window.location.href = `/collections/all?q=${encodeURIComponent(term)}`;
  }
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
// 5. SHOPIFY ACCOUNT DRAWER / MODAL
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
// 6. CART DRAWER HELPERS & PROMO CODE & WHATSAPP
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
  const totalVal = document.getElementById('cart-total-val');

  if (code === 'CUPPETS15') {
    if (window.shopifyCart) {
      const currentTotal = (window.shopifyCart.cartData.total_price || 0) / 100;
      const discount = Math.round(currentTotal * 0.15);
      const discountedTotal = currentTotal - discount;

      if (discountLine) discountLine.style.display = 'flex';
      if (discountVal) discountVal.textContent = `-$${discount.toLocaleString('es-CO')} COP`;
      if (totalVal) totalVal.textContent = `$${discountedTotal.toLocaleString('es-CO')} COP`;
      showToast('¡Cupón CUPPETS15 aplicado! Ahorraste un 15% 🎉', 'success');
    }
  } else if (code.length > 0) {
    showToast('Código no válido. Prueba con CUPPETS15', 'info');
  }
};

window.checkoutViaWhatsApp = function() {
  const waNumber = '573233056221';
  let summary = '';
  if (window.shopifyCart && window.shopifyCart.cartData.items.length > 0) {
    summary = '\n*Detalle del Pedido:*\n';
    window.shopifyCart.cartData.items.forEach(item => {
      summary += `• ${item.title} (x${item.quantity}) - $${((item.price * item.quantity)/100).toLocaleString('es-CO')} COP\n`;
    });
  }
  const total = document.getElementById('cart-total-val')?.textContent || '$0 COP';
  const msg = `¡Hola Cuppets! 🐾 Quiero finalizar mi pedido por WhatsApp:${summary}\n*Total Estimado:* ${total}\n\n¿Me ayudan a confirmar el envío y método de pago?`;
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
};

// ==========================================
// 7. FAQ ACCORDION
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
// 8. MOBILE DRAWER
// ==========================================
window.openMobileDrawer = function() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Update cart badge in mobile drawer
    const mainBadge = document.getElementById('cart-badge');
    const mobileBadge = document.getElementById('mobile-cart-badge');
    if (mainBadge && mobileBadge) {
      mobileBadge.textContent = mainBadge.textContent;
    }
  }
};

window.closeMobileDrawer = function() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Legacy support
window.toggleMobileMenu = function() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer && drawer.classList.contains('active')) {
    closeMobileDrawer();
  } else {
    openMobileDrawer();
  }
};

// ==========================================
// 9. TOAST NOTIFICATIONS
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
  toast.innerHTML = `<i class="fa-solid fa-paw" style="color: var(--brand-purple);"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
};

// ==========================================
// 10. NEWSLETTER & PROMO COPY
// ==========================================
window.handleNewsletterSubmit = function(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  if (input && input.value) {
    showToast('¡Gracias por unirte a la Familia Cuppets! 🐾 Te enviamos un cupón especial al correo.', 'success');
    input.value = '';
  }
};

window.copyPromoCode = function(code) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`¡Código ${code} copiado al portapapeles! 🎉`, 'success');
    }).catch(() => {
      showToast(`Código VIP: ${code}`, 'info');
    });
  } else {
    showToast(`Código VIP: ${code}`, 'info');
  }
};


