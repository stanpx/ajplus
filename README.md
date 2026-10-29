# AJ+ - Plugin para Kino

Plugin oficial para [Kino](https://kinotvapp.github.io/kino-plugins/) que agrega contenido de los canales de YouTube de la red **Al Jazeera** y **AJ+**, transmisiones de **TV en Vivo**, y las coberturas en video de su sitio web oficial.

## Características

- **TV en Vivo (Canales Oficiales 24/7):**
  - Al Jazeera Arabic (قناة الجزيرة - البث الحي)
  - Al Jazeera English Live
  - Al Jazeera Mubasher (الجزيرة مباشر)
- **Sitio Web Oficial:** Extracción directa de las coberturas y reportajes de video publicados en [aljazeera.com/videos](https://www.aljazeera.com/videos).
- **Canales de YouTube:**
  - AlJazeera Arabic قناة الجزيرة
  - AJ+ (English)
  - Al Jazeera Documentary الجزيرة الوثائقية
  - Al Jazeera English
  - AJ+ ESPAÑOL
  - الجزيرة الآن
  - الجزيرة - برامج
  - AJ+ كبريت
  - AJ+ français
  - حكايه فيلم
  - AJ+ عربي
  - AJ+ ساحة
  - Al Jazeera Balkans
- **Reproducción nativa:** Transmisiones en HLS adaptativo y formatos progresivos MP4 con soporte para subtítulos (VTT).
- **Búsqueda integrada:** Encuentra noticias, coberturas y programas completos por palabra clave.
- **Firmado por su autor:** Verificación criptográfica con Ed25519 para garantizar la autenticidad e integridad de cada actualización.

## Instalación en Kino

1. En la aplicación Kino (Android TV o móvil), ve a **Ajustes ▸ Plugins** (o menú ☰ ▸ Plugins).
2. Pestaña **De la comunidad**.
3. Busca **AJ+** o escribe el repositorio `stanpx/ajplus`.
4. Pulsa en **Instalar**.

## Verificación Local

```bash
# Validar estructura y manifiesto
node sdk/validate.mjs . --repo stanpx/ajplus

# Probar funciones
node sdk/run.mjs . home
node sdk/run.mjs . live categories
node sdk/run.mjs . live channels noticias
node sdk/run.mjs . search "gaza"
node sdk/run.mjs . resolve "video:dQw4w9WgXcQ"
```
