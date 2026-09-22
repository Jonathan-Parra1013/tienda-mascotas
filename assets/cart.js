/* ==========================================================================
   CUPPETS SHOPIFY THEME - AJAX CART ENGINE (CART.JS)
   ========================================================================== */

class ShopifyCart {
  constructor() {
    this.cartData = null;
    this.init();
  }

  async init() {
    await this.fetchCart();
    this.bindEvents();
  }

  async fetchCart() {
    try {
      const response = await fetch('/cart.js');
      this.cartData = await response.json();
      this.updateCartDrawerUI();
    } catch (error) {
      console.warn('Shopify Cart Fetch (Demo mode active):', error);
    }
  }

  async addItem(id, quantity = 1, properties = {}) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity, properties })
      });
      await this.fetchCart();
      this.openDrawer();
      if (window.showToast) window.showToast('¡Producto añadido a la canasta!', 'success');
    } catch (e) {
      console.log('Add to cart local fallback', e);
    }
  }

  async changeItem(key, quantity) {
    try {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity })
      });
      await this.fetchCart();
    } catch (e) {
      console.log('Cart change local fallback', e);
    }
  }

  updateCartDrawerUI() {
    if (!this.cartData) return;

    const countBadge = document.getElementById('cart-badge');
    const headerSubtotal = document.getElementById('cart-subtotal-header');
    const drawerItems = document.getElementById('cart-items-container');
    const drawerSubtotal = document.getElementById('cart-subtotal-val');
    const drawerTotal = document.getElementById('cart-total-val');

    if (countBadge) countBadge.textContent = this.cartData.item_count || 0;
    
    const formattedSubtotal = `$${((this.cartData.total_price || 0) / 100).toLocaleString('es-CO')} COP`;
    if (headerSubtotal) headerSubtotal.textContent = formattedSubtotal;
    if (drawerSubtotal) drawerSubtotal.textContent = formattedSubtotal;
    if (drawerTotal) drawerTotal.textContent = formattedSubtotal;

    // Free Shipping Bar Calculation
    const threshold = 99000;
    const currentTotal = (this.cartData.total_price || 0) / 100;
    const fill = document.getElementById('shipping-progress-fill');
    const text = document.getElementById('free-shipping-text');

    if (fill && text) {
      const pct = Math.min(100, (currentTotal / threshold) * 100);
      fill.style.width = `${pct}%`;
      if (currentTotal >= threshold) {
        text.innerHTML = '🎉 ¡Felicidades! Tienes <strong>ENVÍO GRATIS</strong>';
      } else {
        const diff = threshold - currentTotal;
        text.innerHTML = `Faltan <strong>$${diff.toLocaleString('es-CO')} COP</strong> para <strong>¡ENVÍO GRATIS!</strong>`;
      }
    }
  }

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
  }

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
  }

  bindEvents() {
    document.querySelectorAll('.cart-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });
  }
}

window.shopifyCart = new ShopifyCart();
