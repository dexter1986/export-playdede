📋 Guía de Usuario Actualizada - Exportador PlayDede CSV

🚀 Descripción General
Este script permite exportar tus series, películas, animes y capítulos de PlayDede a archivos CSV organizados, facilitando el backup y organización de tu contenido.

📥 Cómo Cargar el Script

Método 1: URL Directa (Recomendado)
Copia este texto:
javascript:import('https://cdn.jsdelivr.net/gh/dexter1986/export-playdede@V1/export.js');
Pégalo directamente en la barra de direcciones y presiona Enter
No copies el "javascript:" - el navegador lo añade automáticamente

Método 2: Bookmarklet 
Crea un nuevo marcador en tu navegador
En la URL copia y pega este código:
javascript:import('https://cdn.jsdelivr.net/gh/dexter1986/export-playdede@V1/export.js');
Nombra el marcador como "Export PlayDede"
Ve a playdede.club y inicia sesión
Haz clic en el marcador para cargar el script

Método 3: Consola del Navegador (Experto, requiere bloquear playdede.club/analytics.js)
Ve a playdede.club e inicia sesión
Presiona F12 o clic derecho → Inspeccionar
Ve a la pestaña "Consola"
Pega el siguiente código y presiona Enter:
import('https://cdn.jsdelivr.net/gh/dexter1986/export-playdede@V1/export.js');


🎯 Funcionalidades Disponibles
1. 📊 Exportar Series
Qué exporta: Todas tus series (favoritas, siguiendo, pendientes, vistas)
Formato: CSV con título, géneros, ID, tipo y rating
Incluye: Información completa de cada serie

2. 🎬 Exportar Películas
Qué exporta: Todas tus películas (favoritas, pendientes, vistas)
Formato: CSV con título, géneros, ID y tipo
Incluye: Datos completos de cada película

3. 🎌 Exportar Animes
Qué exporta: Todos tus animes (favoritos, siguiendo, pendientes, vistos)
Formato: CSV con título, géneros, ID, tipo y rating
Incluye: Información detallada de cada anime

4. 📺 Exportar Capítulos
Qué exporta: Capítulos de series y animes
Características:

✅ Selección múltiple de tipos de contenido

✅ Detección automática de capítulos vistos/no vistos

✅ Formato estándar de episodio (Ej: "1x02")

✅ Información completa por temporada

✅ Procesamiento inteligente por lotes

🖱 Cómo Usar - Paso a Paso

Primer Uso:
Navega a playdede.club
Inicia sesión con tu cuenta
Ejecuta el script usando uno de los métodos anteriores
Confirma la carga con el mensaje: "✅ Script de exportación cargado"

Exportación Básica:
Busca el menú "Descargar CSV 📥" en la barra superior

Haz clic para desplegar las opciones

Selecciona el tipo de contenido a exportar

Espera a que termine el procesamiento

Descarga el archivo CSV automáticamente

Exportación Avanzada (Capítulos):
Haz clic en "Capítulos"

Selecciona en el diálogo qué quieres exportar:

🎬 Series que sigo - Series en seguimiento activo

🎬 Series pendientes - Series por ver

🎬 Series favoritas - Series marcadas como favoritas

🎬 Series vistas - Series completadas

🎌 Animes que sigo - Animes en emisión que sigues

🎌 Animes pendientes - Animes por ver

🎌 Animes favoritos - Animes marcados como favoritos

🎌 Animes vistos - Animes completados

Confirma la selección

Espera el procesamiento (puede tomar tiempo)

⚡️ Características Técnicas Mejoradas
✅ Con la Nueva Versión V1:
Carga más rápida usando ES6 modules

Mayor compatibilidad con navegadores modernos

Mejor manejo de memoria

Código más eficiente

🔧 Funcionalidades Técnicas:
Paginación automática: Extrae TODAS las páginas automáticamente

Procesamiento por lotes: Evita sobrecargar el servidor

Encoding UTF-8 con BOM: Compatibilidad perfecta con Excel

Validación de datos: IDs verificados y limpios

Manejo robusto de errores: Continúa aunque falle algún elemento

Timeout inteligente: Pausas entre peticiones

📊 Estructura de Archivos CSV:
Series/Animes/Películas:

Title, Genres, IdThetvbb, Type, Rating
Capítulos (Completo):

Tipo, Serie, Temporada, Episodio, Número, Título Capítulo, Visto, Fecha Emisión, URL Capítulo, URL Serie, Géneros Serie, Rating Serie
⏱️ Tiempos de Procesamiento Estimados
Tipo de Exportación	Tiempo Estimado	Depende de
Series	10-30 segundos	Cantidad de series
Películas	10-20 segundos	Número de películas
Animes	10-30 segundos	Cantidad de animes
Capítulos	2-15 minutos	Series seleccionadas + episodios por serie

🛠 Solución de Problemas

❌ Problemas Comunes y Soluciones:
Excel muestra caracteres extraños:

1. Abre Excel → Datos → Obtener datos → Desde archivo de texto/CSV
2. Selecciona tu archivo CSV
3. En "Origen del archivo" elige "65001 : Unicode (UTF-8)"
4. Clic en "Cargar"
Script no se ejecuta:

✅ Verifica que estés en https://playdede.club

✅ Asegúrate de haber iniciado sesión

✅ Usa el método de URL directa (más confiable)

✅ Recarga la página e intenta de nuevo

Error de CORS:

✅ El método import() soluciona problemas de CORS

✅ Usa siempre la versión V1 del script

Procesamiento muy lento:

⏳ Los capítulos requieren visitar cada serie individualmente

⏳ El script incluye pausas para ser respetuoso con el servidor

⏳ Es normal que tome varios minutos para muchas series

No aparece el menú:

🔄 Recarga la página y ejecuta el script nuevamente

👀 Busca "Descargar CSV" en la barra superior derecha

📱 En móvil, busca en el menú hamburguesa

🔄 Control de Versiones
Versión Actual: V1

✅ Método import() más eficiente

✅ Mejor compatibilidad

✅ Carga más rápida

✅ Menos consumo de memoria

Para actualizar:

Solo necesitas usar el nuevo enlace V1

No se requieren cambios en tu bookmarklet

📞 Soporte y Actualizaciones
Canales de ayuda:

Esta guía - Soluciona el 90% de los problemas

Consola del navegador (F12) - Para errores técnicos

Revisa la versión - Asegúrate de usar V1

El script se actualiza automáticamente cuando usas los enlaces CDN.
