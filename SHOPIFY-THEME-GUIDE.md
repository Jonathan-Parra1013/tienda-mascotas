# 🐾 Cuppets Luxury Pets — Manual de Arquitectura y Guía de Instalación Shopify (.liquid)

Bienvenido a la documentación oficial del tema **Cuppets** para Shopify, desarrollado con arquitectura Liquid nativa bajo los más altos estándares de diseño UX/UI de lujo para marcas de accesorios de mascotas (perros y gatos).

---

## 📁 Estructura Completa del Tema Liquid

```
tienda-mascotas/
├── assets/
│   ├── cuppets.css             # Sistema de diseño de lujo (paleta blanca + púrpura/azul, glassmorphism)
│   ├── cuppets.js              # Controlador global (personalizador 3D, perfil de mascota, modales, toasts)
│   ├── cart.js                 # Manejador AJAX de Shopify (/cart/add.js, /cart/change.js, /cart.js)
│   └── product-form.js         # Componente web personalizado <product-form> para compras reactivas
├── config/
│   ├── settings_schema.json    # Esquema configurable en el Editor Visual de Shopify (colores, WhatsApp, envíos)
│   └── settings_data.json      # Valores por defecto de configuración y tipografías
├── layout/
│   └── theme.liquid            # Plantilla maestra con meta tags, cabecera, drawers y pie de página
├── sections/
│   ├── announcement-bar.liquid # Barra superior con cupón y enlace VIP a WhatsApp
│   ├── header.liquid           # Navegación fija con selector de especies (Todos/Perros/Gatos) y badge de peludito
│   ├── hero-banner.liquid      # Hero con llamadas a la acción dobles y tarjetas flotantes animadas
│   ├── trust-bar.liquid        # 4 pilares de confianza (Envíos gratis, Calidad garantizada, Pagos seguros)
│   ├── categories-grid.liquid  # Grilla masonry de categorías (Collares, Arneses, Placas, Correas, Ropa)
│   ├── featured-collection.liquid # Carrusel/Grilla dinámica de productos destacados de Shopify
│   ├── tag-customizer.liquid   # Grabador 3D interactivo en vivo de placas de identificación metálicas
│   ├── about-cuppets.liquid    # Historia de la marca y comparativa de calidad
│   ├── testimonials.liquid     # Testimonios con insignias de compradores verificados
│   ├── faq.liquid              # Acordeón interactivo de preguntas frecuentes
│   └── footer.liquid           # Pie de página 4 columnas con pasarelas de pago colombianas
├── snippets/
│   ├── breadcrumbs.liquid      # Migas de pan de navegación
│   ├── product-card.liquid     # Tarjeta de producto con hover, tags y botón de compra directa
│   ├── cart-drawer.liquid      # Carrito deslizante con barra de envío gratis ($99.000 COP) y checkout WhatsApp
│   ├── cart-item.liquid        # Elemento individual de carrito con control de cantidades AJAX
│   ├── search-modal.liquid     # Modal de búsqueda predictiva con sugerencias rápidas
│   ├── account-drawer.liquid   # Drawer de autenticación (Login y Registro rápido)
│   ├── pet-profile-drawer.liquid # Creador y configurador de perfil de mascota ("Mi Peludito")
│   ├── icon-cart.liquid        # Icono SVG Canasta
│   ├── icon-search.liquid      # Icono SVG Búsqueda
│   ├── icon-user.liquid        # Icono SVG Usuario
│   ├── icon-paw.liquid         # Icono SVG Huellita Cuppets
│   ├── icon-x.liquid           # Icono SVG Cerrar
│   └── meta-tags.liquid        # Metadatos SEO, Open Graph y Twitter Cards
└── templates/
    ├── index.liquid            # Página de inicio
    ├── collection.liquid       # Catálogo con filtros laterales por especie y ordenamiento
    ├── product.liquid          # Detalle de producto con selector de variantes y grabado personalizado
    ├── cart.liquid             # Página de carrito completa (fallback)
    ├── page.liquid             # Plantilla genérica para páginas legales
    ├── page.about.liquid       # Plantilla especializada para "Sobre Nosotros"
    ├── page.pet-profile.liquid # Plantilla dedicada para "Mi Peludito & Configuración"
    ├── search.liquid           # Resultados de búsqueda
    └── 404.liquid              # Página de error 404 personalizada
```

---

## 🎨 Paleta de Colores y Tipografías

- **Fondo Principal**: Blanco Puro (`#FFFFFF`) y Superficie Suave (`#F8F9FE`)
- **Púrpura Primario**: `#5C3BFF` (Morado vibrante tirando a azul eléctrico)
- **Púrpura Oscuro / Profundo**: `#4C1D95`
- **Púrpura Claro / Acentos**: `#7C3AED`
- **Degradado Premium**: `linear-gradient(135deg, #5C3BFF 0%, #7C3AED 50%, #3B82F6 100%)`
- **Tipografía de Títulos**: `Cinzel` / `Cinzel Decorative` (Google Fonts)
- **Tipografía de Cuerpo**: `Outfit` (Google Fonts)

---

## 🚀 Cómo Instalar el Tema en Shopify

1. **Descargar / Empaquetar**:
   Comprime las siguientes carpetas en un archivo `.zip`:
   - `assets/`
   - `config/`
   - `layout/`
   - `sections/`
   - `snippets/`
   - `templates/`

2. **Subir a tu Panel de Shopify**:
   - Ingresa a tu panel de administración de Shopify (`https://tu-tienda.myshopify.com/admin`).
   - Ve a **Canales de venta** > **Tienda online** > **Temas**.
   - En la sección *Biblioteca de temas*, haz clic en **Agregar tema** > **Subir archivo zip**.
   - Selecciona el archivo `cuppets-shopify-theme.zip`.
   - Haz clic en **Subir archivo**.

3. **Personalizar**:
   - Haz clic en **Personalizar** para abrir el Editor de temas de Shopify.
   - Podrás configurar tu número de WhatsApp para pedidos directos, el umbral de envío gratis, logos y banners.
