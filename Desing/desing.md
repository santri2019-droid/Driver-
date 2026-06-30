# Drivers Cash - Manual de Diseño y Dirección Estética (Estilo Cabify Verde)

Este documento define la identidad visual, paleta de colores, tipografía, componentes y lineamientos de diseño para **Drivers Cash**, inspirados en la estética moderna, limpia y fluida de la aplicación Cabify, pero adaptando la paleta de colores principal para sustituir los tonos violetas por una gama premium de **verdes vibrantes y verdes bosque**.

---

## 1. Concepto de Diseño

La estética se basa en un **diseño de interfaz nocturno (Dark Mode) de alta gama**, caracterizado por:
*   **Esquinas muy redondeadas** (12px a 20px) para transmitir amabilidad y fluidez.
*   **Altos contrastes** sobre fondos oscuros usando una paleta monocromática oscura y acentos sumamente vibrantes.
*   **Iconografía lineal minimalista**, con trazos limpios y directos.
*   **Espaciado generoso (padding)** que proporciona aire a los textos y resalta la legibilidad mientras se conduce.

---

## 2. Paleta de Colores (Gama de Verdes)

Reemplazamos el característico violeta de Cabify por una gama de verdes modernos (esmeralda, menta y bosque oscuro) para otorgar un carácter ecológico, financiero ("Cash") y de alto rendimiento.

### Colores de Fondo y Superficies (Neutros Oscuros)
*   **Fondo Principal (App Background):** `#0C100D` (Negro carbón con un matiz sutil de verde pino).
*   **Fondo de Tarjetas (Card Background):** `#161D18` (Gris oscuro verdoso para dar volumen y separación).
*   **Bordes / Divisores:** `#263229` (Borde sutil para delimitar elementos sin sobrecargar visualmente).
*   **Superficie de Control Activa (ej. Día Calendario Activo):** `#1F2E23` (Fondo verde oscuro traslúcido).

### Colores de Acento (Gama de Verdes)
*   **Verde Principal (Brand Green / Acento):** `#00E676` o `#0AE182` (Verde menta brillante, de alta visibilidad, usado para botones principales, indicadores activos y estados exitosos).
*   **Verde Oscuro (Brand Green Dark):** `#00A956` (Para estados de interacción hover/active en botones).
*   **Verde Claro / Brillo (Glow Green):** `#69F0AE` (Para bordes de enfoque y detalles de texto muy pequeños).
*   **Verde Traslúcido (Translucent Green):** `rgba(10, 225, 130, 0.15)` (Usado para tracks de barras deslizantes o fondos de badges).

### Colores de Soporte
*   **Texto Principal / Títulos:** `#FFFFFF` (Blanco puro para máxima lectura).
*   **Texto Secundario / Subtítulos:** `#A3B4A6` (Gris salvia suave para jerarquía secundaria).
*   **Texto Muted / Deshabilitado:** `#5D6D61` (Gris apagado para textos secundarios lejanos y estados inactivos).
*   **Alerta / Peligro / Cancelar:** `#E53935` (Rojo vivo) o fondo `#3D1B1B` con texto `#FF8A80` (Para botones como "Cancelar viaje").
*   **Azul de Recursos (Ayuda):** `#1A365D` (Fondo) y `#90CDF4` (Texto) para mantener una sección diferenciada de asistencia.

---

## 3. Tipografía y Jerarquía Visual

La tipografía debe emular la fuente geométrica sans-serif de Cabify (estilo *Outfit*, *Inter* o *Cabify Sans*). Se caracteriza por caracteres redondos y modernos.

*   **Títulos de Pantalla (H1):** `font-size: 24px`, `font-weight: 700`, color `#FFFFFF`.
*   **Títulos de Tarjetas / Subtítulos Importantes (H2):** `font-size: 18px`, `font-weight: 600`, color `#FFFFFF`.
*   **Textos Informativos / Cuerpo (Body):** `font-size: 15px`, `font-weight: 400`, color `#A3B4A6` (para descripciones) y `#FFFFFF` (para datos cruciales como direcciones o montos).
*   **Etiquetas de Categorías / Metadatos (Muted Uppercase):** `font-size: 12px`, `font-weight: 700`, `letter-spacing: 1px`, transformado a `uppercase`, color `#A3B4A6`.
*   **Montos Grandes (Precios/Ganancias):** `font-size: 26px` a `32px`, `font-weight: 700`, color `#FFFFFF`.

---

## 4. Componentes y Estructuras Visuales

### A. Tarjetas de Información (Cards)
Estructuras contenedoras con fondo `#161D18`, bordes redondeados de `16px` y opcionalmente un borde sutil de `1px` en `#263229`.
*   **Cabecera de Tarjeta (Vista Anticipada/Destacada):**
    *   Fondo: Degradado de `#00A956` a `#0AE182` con opacidad o color sólido `#00A956`.
    *   Texto: `uppercase`, negrita, tamaño `12px`, color `#FFFFFF` o `#0C100D`.
*   **Cuerpo:** Espaciado interno de `16px` a `20px`.

### B. Botones
*   **Botón Principal (Activo / Confirmar):**
    *   Fondo: `#0AE182` (Verde brillante).
    *   Texto: `#0C100D` (Negro/Verde oscuro) para alto contraste, `font-weight: 700`, centrado.
    *   Border-radius: `12px` (Esquinas redondeadas pero no completamente circulares).
*   **Botón Secundario (Outline / Editar):**
    *   Fondo: `transparent` o `#1F2E23` (verde traslúcido).
    *   Borde: `#0AE182` o `#00A956`.
    *   Texto: `#0AE182`, `font-weight: 700`.
*   **Botón Alerta / Cancelar:**
    *   Fondo: `#3D1B1B` (Rojo/marrón oscuro apagado).
    *   Texto: `#FF8A80` (Rojo claro suave).
    *   Border-radius: `12px`.

### C. Línea de Tiempo de Ruta (Timeline)
Para representar los viajes (Origen $\rightarrow$ Destino):
*   **Punto de Origen:** Círculo con borde verde de `2px` (`#0AE182`) y centro transparente.
*   **Punto de Destino:** Círculo relleno de verde sólido (`#0AE182`).
*   **Línea Conectora:** Trazo vertical discontinuo o continuo delgado en `#263229` o `#5D6D61`.
*   **Texto de Dirección:** Dirección en color `#FFFFFF`, hora al lado en color `#A3B4A6`.

### D. Elemento Deslizante (Swipe to Action / "Deslizar al llegar")
*   **Track (Contenedor de fondo):** Fondo `#161D18` con track interno traslúcido `rgba(10, 225, 130, 0.15)`.
*   **Botón Deslizante (Handle):** `#0AE182` con icono de flecha hacia la derecha `→` o `double_arrow` en blanco o verde oscuro.
*   **Texto central instructivo:** "Deslizar al llegar", centrado, tamaño `16px`, negrita, color `#0C100D` o `#FFFFFF`.

### E. Pestañas (Tabs)
*   **Pestaña Activa:** Texto blanco `#FFFFFF`, con un indicador inferior (subrayado) verde brillante de `3px` de grosor y bordes redondeados.
*   **Pestaña Inactiva:** Texto gris muted `#5D6D61`, sin indicador inferior.
