# Wavy Carpets

Tienda React + TypeScript + Vite, con Firebase y publicación existente en GitHub Pages. Mantiene la paleta crema, rojo, mostaza y oliva y la tipografía original.

## Desarrollo

- `npm ci`
- `npm run dev -- --host 127.0.0.1`
- `npm run build` (TypeScript + Vite)

Los pushes a `main` ejecutan `.github/workflows/deploy-pages.yml`. El sitio se sirve bajo `/wavey-carpets/`. No cambiar esta base sin actualizar los metadatos y el sitemap.

## Textos y SEO (noviembre de 2026)

La portada, la tienda, el taller y la solicitud explican el producto y el proceso. Se priorizaron las expresiones **alfombras personalizadas**, **alfombras hechas a mano**, **alfombras de diseño**, **tufting artesanal** y **alfombras a medida**. Son términos observados en páginas del rubro, no datos medidos de volumen ni una garantía de ranking:

- https://cruxtuft.com.ar/
- https://www.reptarrugs.com.ar/alfombras-personalizadas/
- https://bairesrugs.com/

Se reemplazó el título de Vite por metadatos de marca, descripción, idioma español, canonical, Open Graph, icono y JSON-LD de Organization. El sitemap enumera solo la portada: las rutas de HashRouter no son páginas indexables independientes. Una futura migración a rutas reales y prerenderizado/SSR permitiría trabajar SEO individual de categorías y productos. No se atribuyeron reseñas, plazos ni materiales no confirmados en el marcado.

## Movimiento vintage

Galería con fundido entre fotos, postal inclinada, sello oscilante, estrella rotativa, cinta horizontal y tarjetas con respuesta al hover. Hay controles de foto y pausa; se respeta `prefers-reduced-motion` y el cambio automático se suspende cuando la pestaña está oculta. Las preguntas frecuentes usan `details` nativo.

## Contacto y catálogo

El formulario existente guarda solicitudes en Firebase. No probarlo enviando datos ficticios a producción. El WhatsApp de ejemplo `1234567890` se retiró del flujo: solo se muestra si se configura `VITE_WHATSAPP_PHONE` con el número real en formato internacional, sin signos. También se retiraron redes genéricas, email y horarios de ejemplo del pie. Las colecciones se presentan como inspiración, sin precios ni valoraciones inventados. El catálogo, la búsqueda y la ficha muestran únicamente productos de Firebase. Durante la consulta se muestran indicadores de carga; un catálogo vacío o un error no habilitan productos de ejemplo. La sesión reutiliza las consultas completadas para evitar repetirlas al navegar. Las imágenes ausentes usan un marcador neutro.
