# Fino · identidad y arquitectura

## Referencia analizada

Sitio: https://finovino.my.canva.site/page-2 (incluye las seis páginas en su bootstrap público). Se revisaron el contenido exportado, imágenes de carta, copas e ilustración. El sitio presenta «Fino», «Catálogos de vinos y bebidas» y «Elegí tu próximo brindis».

Paleta extraída: rosa #ffd6d6, bordó #641b1b, acento vino #8d2623, rosa empolvado #ecdada, texto secundario #304254. La carta utiliza fondos crema rosados, líneas finas, serif editorial y nombres/precios alineados. Los accesos a categorías son círculos con copas. Los botones originales son cápsulas bordó. Hay abundante espacio y composiciones centradas; la ilustración característica muestra una mano levantando una copa.

Las fuentes declaradas son The Seasons (logo), Telegraf (botones), Nexa (subtítulo), IM Fell (frase) y Arimo. Para una distribución independiente con licencia abierta se usan Cormorant Garamond y DM Sans, conservando la oposición serif/sans, espaciado y elegancia. Las licencias OFL se distribuyen con los paquetes @fontsource. No se copian las fuentes comerciales de Canva.

Las cuatro categorías exactas son Tintos, Blancos, Rosados y Espumantes. Los 59 nombres y precios se transcribieron de las imágenes publicadas. Son precios de referencia, no una cotización actual. Dos tintos no tienen precio publicado. El sitio no aporta stock, contacto, historia empresarial, añadas o maridajes: no se inventan.

## Arquitectura

- Next.js App Router: /, /vinos/[slug], /carrito, /checkout.
- /data: catálogo tipado, fuentes, productores, contacto pendiente.
- /components: navegación, ilustraciones, catálogo, compra rápida, carrito y diálogo accesible.
- /sections: hero, filosofía, selección, origen, productores, historia, contacto.
- /styles: tokens y composiciones responsive; Tailwind disponible para utilidades.
- /public: imágenes locales, originales conservados y placeholders individuales.
- React Context: carrito persistente, hidratación validada, cantidades enteras y sin duplicados. Los datos y precios siempre se resuelven desde el catálogo.

Desktop: hero asimétrico, grid editorial y relato de origen con intro sticky. Tablet: composición de dos columnas. Mobile: hero apilado, tabs desplazables, cards verticales y carrito como bottom sheet. Menú y carrito usan dialog nativo con foco, cierre por Escape y retorno al disparador.

## Fuentes complementarias

Bodegas Salentein confirma la región, notas, temperaturas y fotos de Reserva Malbec, Reserva Chardonnay, Reserva Rosado y Extra Brut. Se enlazan las fuentes individuales desde cada ficha. La sección de origen usa estos cuatro representantes, uno por categoría, sin atribuir lugares inventados a los otros vinos.

Las fotografías ambientales de Unsplash son de uso ilustrativo. La bodega fotografiada y los recortes de botellas Salentein proceden del sitio oficial de la bodega. Las fotografías de botellas aún ausentes se muestran como «Imagen provisoria», en SVG individuales fácilmente sustituibles.

## Compra

La interfaz de compra funciona en modo de prueba: precios históricos, stock no confirmado, sin pagos ni envío de pedidos. El checkout prepara un resumen descargable. Antes de vender se requieren precios/moneda/stock confirmados, contacto real, backend y proveedor de pagos. No se marcan como pagadas compras que no se procesaron.
