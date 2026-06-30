# Hoja de Ruta y Mapa de Tareas: FlowLogi (Drivers Cash)

Este documento organiza el mapa de tareas de **FlowLogi (Drivers Cash)**, dividiendo el ciclo de vida del proyecto en cinco fases estratégicas enfocadas en el análisis, validación, diseño conceptual y despliegue del piloto.

---

## 📅 Roadmap de Ejecución (Fases)

```
[ Fase 1: Investigación y Validación Impositiva ]
                      │
                      ▼
  [ Fase 2: Diseño de Experiencia de Usuario ]
                      │
                      ▼
[ Fase 3: Integración Financiera y Mitigación de Riesgos ]
                      │
                      ▼
     [ Fase 4: Arquitectura del Middleware ]
                      │
                      ▼
 [ Fase 5: Estrategia Go-to-Market y Piloto CABA ]
```

---

## 📝 Listas de Tareas por Fase

### 🔍 Fase 1: Investigación de Mercado y Validación Impositiva
*Objetivo: Estructurar con exactitud las reglas impositivas locales y el análisis de competidores antes del desarrollo de software.*

- `[ ]` **Análisis del Monotributo ARCA (Argentina)**:
    - [ ] Mapear las tablas de topes de facturación de servicios vigentes para 2026 (Categorías A a K).
    - [ ] Modelar el algoritmo predictivo de proyección de facturación anual acumulada de Uber/Cabify para evitar la recategorización forzosa al régimen general.
    - [ ] Definir el flujo de facturación electrónica a través de Web Services de AFIP.
- `[ ]` **Análisis de Plataformas Tecnológicas SAT (México)**:
    - [ ] Documentar los requisitos de conexión del Certificado de Sello Digital (CSD) y la firma electrónica avanzada.
    - [ ] Validar las tasas de retención automática de ISR e IVA aplicadas a conductores de DiDi y Mercado Envíos Extra.
- `[ ]` **Análisis Comparativo Técnico**:
    - [ ] Evaluar el comportamiento de las herramientas de accesibilidad en sistemas operativos Android para emular la auto-aceptación automatizada de Mystro.

---

### 🎨 Fase 2: Diseño de Experiencia de Usuario (UI/UX Mockups)
*Objetivo: Diseñar el prototipo visual móvil (responsivo) interactivo con una estética premium de alta gama.*

- `[ ]` **Sistema de Diseño Premium**:
    - [ ] Definir la paleta de colores HSL en modo oscuro con acentos violeta/neón de alta visibilidad en entornos de conducción nocturna.
    - [ ] Seleccionar las tipografías corporativas de Google Fonts (Outfit e Inter) y definir la jerarquía tipográfica.
- `[ ]` **Prototipado del Widget RPA Multiapp**:
    - [ ] Diseñar el layout del widget flotante (superposición de pantalla) con botones grandes "manos libres" adaptados para uso vehicular.
    - [ ] Crear las tarjetas de simulación de viajes mostrando de forma destacada el Margen Neto Real coloreado según rentabilidad.
- `[ ]` **Prototipado del Módulo LogiScan (Última Milla)**:
    - [ ] Diseñar la pantalla de interfaz de escaneo rápido de etiquetas OCR (cámara en vivo).
    - [ ] Crear el layout de la lista optimizada de paradas ordenadas de reparto con el módulo visual de alerta predictiva de ausencias.
- `[ ]` **Prototipado de la Billetera y Panel Fiscal**:
    - [ ] Diseñar el dashboard consolidado de saldos e ingresos de impuestos en formato de tarjetas y gráficos interactivos.

---

### 💳 Fase 3: Integración Financiera y Mitigación de Riesgos
*Objetivo: Estructurar la lógica del Cash-Out instantáneo y los mecanismos preventivos de morosidad.*

- `[ ]` **Flujo de Pasarela Fintech**:
    - [ ] Investigar la viabilidad técnica de APIs de retiro instantáneo para billeteras virtuales de la región (Mercado Pago, transferencias inmediatas de bancos locales, Pix en Brasil y SPEI en México).
    - [ ] Modelar las micro-comisiones del servicio de Cash-Out (del 3% al 5% sobre el retiro de saldo digital).
- `[ ]` **Esquema de Mitigación de Riesgos de Capital**:
    - [ ] Diseñar el sistema de límites de crédito escalonados y gamificados (ej. conductores nuevos comienzan con un límite de anticipo equivalente al costo de 1 tanque de combustible).
    - [ ] Definir los requerimientos de validación biométrica KYC (reconocimiento facial e identificación gubernamental activa) para prevenir la creación de perfiles falsos y fraudes de flotas.

---

### ⚙️ Fase 4: Arquitectura del Middleware Operativo
*Objetivo: Definir la integración técnica de accesibilidad del dispositivo móvil y procesamiento de datos.*

- `[ ]` **Lógica del Middleware**:
    - [ ] Diseñar el flujo de captura de eventos por accesibilidad de Android para interactuar con las notificaciones entrantes de las aplicaciones Uber, DiDi y Cabify en tiempo real.
    - [ ] Desarrollar la matriz de cálculo matemático para la deducción dinámica de costos:
        $$\text{Ganancia Neta} = \text{Tarifa Bruta} - (\text{Consumo Combustible} \times \text{Distancia}) - (\text{Tasa Depreciación} \times \text{Distancia}) - \text{Tasa Plataforma}$$
- `[ ]` **Motor de Geolocalización y Rutas**:
    - [ ] Estructurar la lógica de conexión con los SDKs de mapas locales (Google Maps, Waze, Mapbox) para optimizar recorridos de reparto.

---

### 🚀 Fase 5: Estrategia Go-to-Market y Piloto CABA
*Objetivo: Diseñar el plan de pruebas en terreno para validar el modelo con usuarios reales.*

- `[ ]` **Fase de Lanzamiento Piloto**:
    - [ ] Redactar el perfil y criterios de admisión para la selección de la cohorte cerrada de **50 conductores gig** en la Ciudad Autónoma de Buenos Aires (CABA).
    - [ ] Diseñar los formularios de registro digital y acuerdos de participación del piloto.
- `[ ]` **Métricas de Éxito del Piloto**:
    - [ ] Definir el cuadro de mando para medir la tasa de adopción de la billetera, retención mensual, tasa de morosidad del capital adelantado y velocidad de optimización de rutas de última milla.
