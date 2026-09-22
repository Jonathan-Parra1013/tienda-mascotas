/* ==========================================================================
   CUPPETS SHOPIFY THEME - PRODUCT FORM & VARIANT HANDLER
   ========================================================================== */

class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    if (this.form) {
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    }
  }

  async onSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(this.form);
    
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (window.shopifyCart) {
        window.shopifyCart.fetchCart();
        window.shopifyCart.openDrawer();
      }
      if (window.showToast) {
        window.showToast('¡Añadido exitosamente a la canasta!', 'success');
      }
    } catch (err) {
      console.warn('Form submission in demo environment:', err);
    }
  }
}

if (!customElements.get('product-form')) {
  customElements.define('product-form', ProductForm);
}
