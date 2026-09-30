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
  const catalogGrid = document.getElementById('catalog-products-grid');
  if (catalogGrid) {
    filterCatalogByPet(type);
    const catalogSec = document.getElementById('catalogo-destacado') || document.getElementById('main-header');
    if (catalogSec && window.scrollY > 400) {
      catalogSec.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // Navigate to catalog with parameter
    window.location.href = '/collections/all?pet=' + (type === 'dog' ? 'dog' : type === 'cat' ? 'cat' : 'all');
  }
};

window.filterCatalogByPet = function(petType, btnElement) {
  activePetFilter = petType || 'all';

  // 1. Update tab buttons and sidebar links
  document.querySelectorAll('[data-pet]').forEach(btn => {
    const p = btn.getAttribute('data-pet');
    btn.classList.toggle('active', p === activePetFilter);
  });

  // 2. Sync header species switcher buttons
  document.querySelectorAll('.species-switcher .switcher-btn').forEach(btn => {
    const p = btn.getAttribute('data-pet') || btn.getAttribute('data-type');
    if (p) {
      btn.classList.toggle('active', p === activePetFilter);
    } else {
      const text = btn.textContent.toLowerCase();
      if (activePetFilter === 'dog') btn.classList.toggle('active', text.includes('perro'));
      else if (activePetFilter === 'cat') btn.classList.toggle('active', text.includes('gato'));
      else btn.classList.toggle('active', text.includes('todo'));
    }
  });

  // 3. Update Hero Badge & Title if on collection page
  const heroBadge = document.getElementById('catalog-hero-badge');
  const heroTitle = document.getElementById('catalog-hero-title');
  if (heroBadge) {
    if (activePetFilter === 'dog') {
      heroBadge.innerHTML = '<i class="fa-solid fa-dog"></i> COLECCIÓN CANINA';
      if (heroTitle && !heroTitle.getAttribute('data-custom')) heroTitle.textContent = 'Accesorios Exclusivos para Perros';
    } else if (activePetFilter === 'cat') {
      heroBadge.innerHTML = '<i class="fa-solid fa-cat"></i> COLECCIÓN FELINA';
      if (heroTitle && !heroTitle.getAttribute('data-custom')) heroTitle.textContent = 'Accesorios Exclusivos para Gatos';
    } else {
      heroBadge.innerHTML = '<i class="fa-solid fa-sparkles"></i> CATÁLOGO OFICIAL';
      if (heroTitle && !heroTitle.getAttribute('data-custom')) heroTitle.textContent = 'Todos los Accesorios Cuppets';
    }
  }

  // 4. Update browser URL without reloading
  syncFilterUrlParams();

  // 5. Apply filters to product grid
  applyCatalogFilters();
};

// ==========================================
// 2. CATEGORY SUBFILTER (Arneses / Collares / Correas / Camas)
// ==========================================
window.filterCatalogByCategory = function(category, btnElement) {
  activeCategoryFilter = category || 'all';

  // Update category chip and sidebar buttons
  document.querySelectorAll('[data-cat]').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-cat') === activeCategoryFilter);
  });

  // Update URL params
  syncFilterUrlParams();

  // Apply filters
  applyCatalogFilters();
};

function syncFilterUrlParams() {
  if (!window.history || !window.history.replaceState) return;
  const url = new URL(window.location);
  
  if (activePetFilter && activePetFilter !== 'all') {
    url.searchParams.set('pet', activePetFilter);
  } else {
    url.searchParams.delete('pet');
  }

  if (activeCategoryFilter && activeCategoryFilter !== 'all') {
    url.searchParams.set('category', activeCategoryFilter);
  } else {
    url.searchParams.delete('category');
  }

  window.history.replaceState({}, '', url.toString());
}

function applyCatalogFilters() {
  const items = document.querySelectorAll('.catalog-product-item');
  const noResults = document.getElementById('catalog-no-results');
  let visibleCount = 0;

  items.forEach(item => {
    const itemPet = (item.getAttribute('data-pet-type') || 'all').toLowerCase();
    const itemCat = (item.getAttribute('data-category') || 'all').toLowerCase();
    const itemTitle = (item.getAttribute('data-title') || item.innerText || '').toLowerCase();

    // Pet matching logic
    let matchesPet = false;
    if (activePetFilter === 'all') {
      matchesPet = true;
    } else if (activePetFilter === 'dog') {
      matchesPet = (
        itemPet === 'dog' || 
        itemPet === 'both' || 
        itemTitle.includes('perro') || 
        itemTitle.includes('canin') || 
        itemTitle.includes('dog') ||
        itemTitle.includes('cachorro')
      );
    } else if (activePetFilter === 'cat') {
      matchesPet = (
        itemPet === 'cat' || 
        itemPet === 'both' || 
        itemTitle.includes('gato') || 
        itemTitle.includes('felin') || 
        (itemTitle.includes('cat') && !itemTitle.includes('accesorios')) || 
        itemTitle.includes('michi') ||
        itemTitle.includes('minino')
      );
    }

    // Category matching logic
    let matchesCat = false;
    if (activeCategoryFilter === 'all') {
      matchesCat = true;
    } else if (activeCategoryFilter === 'arneses') {
      matchesCat = (
        itemCat === 'arneses' || 
        itemCat.includes('arnes') || 
        itemCat.includes('pecher') ||
        itemTitle.includes('arnés') || 
        itemTitle.includes('arnes') || 
        itemTitle.includes('pechera')
      );
    } else if (activeCategoryFilter === 'collares') {
      const isDentalOrHygiene = itemTitle.includes('dient') || itemTitle.includes('dental') || itemTitle.includes('cepillo') || itemTitle.includes('sarro') || itemTitle.includes('shampoo') || itemTitle.includes('limpia') || itemTitle.includes('baño') || itemTitle.includes('higiene');
      matchesCat = !isDentalOrHygiene && (
        itemCat === 'collares' || 
        itemCat.includes('collar') || 
        (itemCat.includes('placa') && !itemCat.includes('dental')) ||
        itemTitle.includes('collar') || 
        itemTitle.includes('chapa') ||
        itemTitle.includes('medalla') ||
        (itemTitle.includes('placa') && !itemTitle.includes('dental') && !itemTitle.includes('bacterian') && !itemTitle.includes('sarro') && !itemTitle.includes('diente'))
      );
    } else if (activeCategoryFilter === 'correas') {
      matchesCat = (
        itemCat === 'correas' || 
        itemCat.includes('correa') || 
        itemCat.includes('paseo') ||
        itemCat.includes('lazo') ||
        itemTitle.includes('correa') || 
        itemTitle.includes('paseo')
      );
    } else if (activeCategoryFilter === 'camas') {
      matchesCat = (
        itemCat === 'camas' || 
        itemCat.includes('cama') || 
        itemCat.includes('cueva') || 
        itemCat.includes('iglu') || 
        itemCat.includes('descanso') ||
        itemTitle.includes('cama') || 
        itemTitle.includes('cueva') || 
        itemTitle.includes('iglú') || 
        itemTitle.includes('iglu') || 
        itemTitle.includes('descanso') || 
        itemTitle.includes('colchón') ||
        itemTitle.includes('colchon')
      );
    } else if (activeCategoryFilter === 'juguetes') {
      matchesCat = (
        itemCat === 'juguetes' || 
        itemCat.includes('juguet') ||
        itemTitle.includes('juguet') || 
        itemTitle.includes('pelota') || 
        itemTitle.includes('cuerda') || 
        itemTitle.includes('rascador') || 
        itemTitle.includes('interactiv') ||
        itemTitle.includes('peluche') ||
        itemTitle.includes('mordedor')
      );
    } else if (activeCategoryFilter === 'higiene') {
      matchesCat = (
        itemCat === 'higiene' || 
        itemCat.includes('higien') ||
        itemTitle.includes('shampoo') || 
        itemTitle.includes('cepillo') || 
        itemTitle.includes('dient') ||
        itemTitle.includes('dental') ||
        itemTitle.includes('sarro') ||
        itemTitle.includes('pasta') ||
        itemTitle.includes('higien') || 
        itemTitle.includes('limpia') ||
        itemTitle.includes('grooming') ||
        itemTitle.includes('cortaun') ||
        itemTitle.includes('peine') ||
        itemTitle.includes('deslanad') ||
        itemTitle.includes('baño') ||
        itemTitle.includes('jabon')
      );
    } else if (activeCategoryFilter === 'promociones') {
      matchesCat = (
        itemCat === 'promociones' || 
        itemCat.includes('promo') ||
        itemTitle.includes('combo') || 
        itemTitle.includes('kit ') || 
        itemTitle.includes('set ') || 
        itemTitle.includes('pack') ||
        itemTitle.includes('promo') ||
        itemTitle.includes('descuento')
      );
    } else {
      matchesCat = (itemCat === activeCategoryFilter || itemCat.includes(activeCategoryFilter));
    }

    if (matchesPet && matchesCat) {
      item.style.display = 'block';
      item.style.opacity = '1';
      item.style.visibility = 'visible';
      visibleCount++;
    } else {
      item.style.display = 'none';
      item.style.opacity = '0';
      item.style.visibility = 'hidden';
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

  document.querySelectorAll('[data-pet]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-pet') === 'all');
  });

  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === 'all');
  });

  document.querySelectorAll('.species-switcher .switcher-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-type') === 'all' || btn.getAttribute('data-pet') === 'all');
  });

  const sortSelect = document.getElementById('catalog-sort-select');
  if (sortSelect) sortSelect.value = 'featured';

  const heroBadge = document.getElementById('catalog-hero-badge');
  const heroTitle = document.getElementById('catalog-hero-title');
  if (heroBadge) heroBadge.innerHTML = '<i class="fa-solid fa-sparkles"></i> CATÁLOGO OFICIAL';
  if (heroTitle) heroTitle.textContent = 'Todos los Accesorios Cuppets';

  syncFilterUrlParams();
  applyCatalogFilters();

  if (window.showToast) window.showToast('Filtros restablecidos 🐾', 'info');
};

function updateCategoryCounters() {
  let countAll = 0;
  let countDog = 0;
  let countCat = 0;

  document.querySelectorAll('.catalog-product-item').forEach(item => {
    countAll++;
    const pet = (item.getAttribute('data-pet-type') || '').toLowerCase();
    const title = (item.getAttribute('data-title') || item.innerText || '').toLowerCase();

    if (pet === 'dog' || pet === 'both' || title.includes('perro') || title.includes('canin') || title.includes('dog')) countDog++;
    if (pet === 'cat' || pet === 'both' || title.includes('gato') || title.includes('felin') || title.includes('cat')) countCat++;
  });

  const elAll = document.getElementById('count-all');
  const elDog = document.getElementById('count-dog');
  const elCat = document.getElementById('count-cat');

  if (elAll && countAll > 0) elAll.textContent = countAll;
  if (elDog && countDog > 0) elDog.textContent = countDog;
  if (elCat && countCat > 0) elCat.textContent = countCat;
}

function checkUrlFilterParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const petParam = urlParams.get('pet') || urlParams.get('specie') || urlParams.get('tipo');
  const catParam = urlParams.get('category') || urlParams.get('categoria') || urlParams.get('cat');
  const path = window.location.pathname.toLowerCase();

  let targetPet = 'all';
  let targetCat = 'all';

  if (petParam) {
    const p = petParam.toLowerCase();
    if (p.includes('dog') || p.includes('perro')) targetPet = 'dog';
    else if (p.includes('cat') || p.includes('gato')) targetPet = 'cat';
  } else if (path.includes('perro')) {
    targetPet = 'dog';
  } else if (path.includes('gato')) {
    targetPet = 'cat';
  }

  if (catParam) {
    const c = catParam.toLowerCase();
    if (c.includes('higien') || c.includes('shampoo') || c.includes('cepillo') || c.includes('dental') || c.includes('dient') || c.includes('diente')) targetCat = 'higiene';
    else if (c.includes('arnes') || c.includes('pecher')) targetCat = 'arneses';
    else if (c.includes('collar') || (c.includes('placa') && !c.includes('dental'))) targetCat = 'collares';
    else if (c.includes('correa') || c.includes('paseo')) targetCat = 'correas';
    else if (c.includes('cama') || c.includes('cueva') || c.includes('descanso')) targetCat = 'camas';
    else if (c.includes('juguet') || c.includes('pelota') || c.includes('rascador')) targetCat = 'juguetes';
    else if (c.includes('promo') || c.includes('combo') || c.includes('kit')) targetCat = 'promociones';
    else targetCat = c;
  } else if (path.includes('arnes')) {
    targetCat = 'arneses';
  } else if (path.includes('collar')) {
    targetCat = 'collares';
  } else if (path.includes('correa')) {
    targetCat = 'correas';
  } else if (path.includes('cama')) {
    targetCat = 'camas';
  } else if (path.includes('juguet')) {
    targetCat = 'juguetes';
  } else if (path.includes('higien') || path.includes('cepillo') || path.includes('dental')) {
    targetCat = 'higiene';
  } else if (path.includes('promo')) {
    targetCat = 'promociones';
  }

  if (targetPet !== 'all') {
    activePetFilter = targetPet;
  }
  if (targetCat !== 'all') {
    activeCategoryFilter = targetCat;
  }

  // Update UI buttons matching initial state
  document.querySelectorAll('[data-pet]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-pet') === activePetFilter);
  });
  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === activeCategoryFilter);
  });
  document.querySelectorAll('.species-switcher .switcher-btn').forEach(btn => {
    const p = btn.getAttribute('data-pet') || btn.getAttribute('data-type');
    if (p) btn.classList.toggle('active', p === activePetFilter);
  });

  const heroBadge = document.getElementById('catalog-hero-badge');
  const heroTitle = document.getElementById('catalog-hero-title');
  if (heroBadge && activePetFilter !== 'all') {
    if (activePetFilter === 'dog') {
      heroBadge.innerHTML = '<i class="fa-solid fa-dog"></i> COLECCIÓN CANINA';
      if (heroTitle) heroTitle.textContent = 'Accesorios Exclusivos para Perros';
    } else if (activePetFilter === 'cat') {
      heroBadge.innerHTML = '<i class="fa-solid fa-cat"></i> COLECCIÓN FELINA';
      if (heroTitle) heroTitle.textContent = 'Accesorios Exclusivos para Gatos';
    }
  }

  applyCatalogFilters();
}

// ==========================================
// 3. SORTING PRODUCTS
// ==========================================
window.sortCatalogProducts = function(sortBy) {
  const grid = document.getElementById('catalog-products-grid');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.catalog-product-item'));

  items.sort((a, b) => {
    let priceA = parseFloat(a.getAttribute('data-price')) || 0;
    let priceB = parseFloat(b.getAttribute('data-price')) || 0;

    if (!priceA) {
      const priceTxtA = a.querySelector('.current-price')?.textContent || '';
      priceA = parseFloat(priceTxtA.replace(/[^0-9]/g, '')) || 0;
    }
    if (!priceB) {
      const priceTxtB = b.querySelector('.current-price')?.textContent || '';
      priceB = parseFloat(priceTxtB.replace(/[^0-9]/g, '')) || 0;
    }

    const ratingA = parseFloat(a.getAttribute('data-rating')) || 5;
    const ratingB = parseFloat(b.getAttribute('data-rating')) || 5;

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


