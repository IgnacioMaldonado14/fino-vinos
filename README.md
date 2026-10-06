# Fino · vinos & encuentros

Web editorial responsive desarrollada en **Next.js + React + TypeScript + Tailwind CSS + Framer Motion**. Es código independiente, editable en Visual Studio Code; no requiere Canva para ejecutar.

## Ver el index sin instalar dependencias

`index.html` es una vista previa autónoma con las imágenes, fuentes y estilos incluidos en el mismo archivo. Abrilo en Visual Studio Code y, con la extensión **Live Server**, hacé clic derecho → **Open with Live Server**. También podés abrirlo directamente en un navegador.

Incluye las cuatro categorías, búsqueda, fichas en modal y carrito de prueba con resumen descargable. La aplicación completa, con rutas individuales y checkout, sigue en `/app`; se ejecuta con los comandos de abajo.

## Abrir en Visual Studio Code

Requisitos: Git y **Node.js 24 LTS** (incluye npm).

```bash
git clone https://github.com/IgnacioMaldonado14/fino-vinos.git
cd fino-vinos
npm ci
code .
npm run dev
```

Abrí `http://localhost:3000` en tu navegador. Si `code .` no está disponible, usá **Archivo → Abrir carpeta** en VS Code y seleccioná `fino-vinos`. También podés iniciar el servidor con la configuración «Fino · desarrollo» en Ejecutar y depurar.

```bash
npm run build
npm start
```

Estos dos últimos comandos preparan y ejecutan la versión de producción.

## Qué incluye

- Hero, filosofía, carta, selección, origen, productor, historia preparada, contacto y footer.
- Cuatro categorías originales: Tintos, Blancos, Rosados y Espumantes.
- 59 vinos de la carta original, búsqueda sin distinguir acentos, ordenamiento y expansión de catálogo.
- Rutas individuales `/vinos/[slug]`, metadatos y datos estructurados sin ofertas comerciales falsas.
- Carrito persistente entre páginas y recargas, cantidades, subtotales, eliminación y estado vacío.
- Compra rápida desde la carta y las fichas; animación fly-to-cart de 650 ms y confirmación discreta.
- Drawer lateral en desktop; bottom sheet en móvil; menú móvil de pantalla completa.
- Ruta `/carrito` y checkout `/checkout` con resumen de selección descargable.
- Navegación por teclado, diálogos nativos con foco, skip link, reduced motion y estados accesibles.
- Fotografías locales, Next Image, WebP/AVIF, lazy loading y generación estática de las fichas.

## Estado comercial y contenido

La web es ejecutable, pero la compra funciona en **modo de prueba**. Los precios son los publicados en el sitio de referencia y deben actualizarse antes de vender. El stock no se conoce. Dos vinos tienen precio sin publicar y no se pueden agregar.

El checkout **no cobra, no envía pedidos y no guarda datos personales**. Genera un resumen en el navegador. Para ventas reales se necesita un backend que valide precios y stock, condiciones de entrega y un proveedor de pagos. No incluir credenciales en el cliente.

No se inventaron datos empresariales. Contacto, redes, dirección, horarios, historia, añadas y maridajes faltantes se muestran como pendientes. Las fichas verificadas de Salentein enlazan sus fuentes oficiales. Ocho botellas tienen fotografía del productor; las otras 51 usan un placeholder individual claramente identificado. Los paisajes de viñedos son ilustrativos, no fotografías de las fincas específicas.

La imagen de la etiqueta no confirma la añada de venta. Verificar derechos de los recursos de terceros antes de un lanzamiento comercial; ver `public/images/SOURCES.md`.

## Editar

- `data/wines.ts`: catálogo, precios, stock, campos técnicos, fuentes y procedencia.
- `data/site.ts`: marca y datos de contacto reales.
- `styles/globals.css`: sistema de diseño, colores originales y composiciones por dispositivo.
- `sections/`: secciones editoriales.
- `components/`: navegación, catálogo y carrito.
- `public/wines/`: fotografías y placeholders con el slug de cada vino.
- `docs/DESIGN.md`: análisis de identidad, arquitectura y decisiones.

Para sustituir una imagen provisoria, agregá por ejemplo `public/wines/alamos-malbec.webp` y actualizá el producto con `image: '/wines/alamos-malbec.webp'` e `imagePlaceholder: false`. El generador `node scripts/generate-placeholders.mjs` es opcional y recrea únicamente los SVG de productos marcados como provisionales.

Para un dominio público, copiá `.env.example` a `.env.local` y configurá `NEXT_PUBLIC_SITE_URL` con la URL HTTPS definitiva. Así se habilitan las URL canónicas, sitemap y la indexación. El modo local evita publicar canónicas falsas. Esta variable no conecta pagos ni confirma datos comerciales.

## Verificación

```bash
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
```

Las pruebas de navegador incluyen carrito persistente, fichas, checkout, descarga, búsqueda, controles de teclado, estados de error, reduced motion y auditoría Axe. Verifican 375, 390, 430, 768 y 1440 px.

Para usar Chromium ya instalado en Linux:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Para validar sobre un servidor de producción ya iniciado, agregá `TEST_BASE_URL=http://localhost:3000`. Las pruebas se ejecutan sobre un entorno de desarrollo o de prueba; no usarlas sobre una tienda con cobros reales.

## Publicar

El código puede desplegarse en cualquier hosting compatible con Next.js y Node. Ejecutar `npm run build` y `npm start`, o importar el repositorio en un proveedor compatible. Configurar el dominio definitivo y completar los datos comerciales antes de habilitar pedidos y cobros. Subir el código a GitHub no publica automáticamente una web en Internet.
