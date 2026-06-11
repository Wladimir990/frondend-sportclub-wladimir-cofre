# Guía de Uso de IA y Documentación de Desarrollo — SportClub

## 1. Identificación del Proyecto y Estudiante

| Campo | Detalle |
|-------|---------|
| **Institución** | INACAP |
| **Asignatura** | Programación Front End (Código T13V31) |
| **Evaluación** | Evaluación Sumativa 1: Desarrollo de sitio web estático con HTML5 y CSS3 |
| **Docente** | Javier Ahumada |
| **Estudiante** | Saud Wladimir Cofré Encina |

---

## 2. Registro de Uso de Inteligencia Artificial

### Bitácora de Prompts y Modificaciones

---

#### Módulo 1 — Estructura Base y Landing Page

- **Herramienta:** Gemini Chat
- **Fecha:** 31/05/2026
- **Prompt utilizado:**
  > *"Crea una estructura HTML semántica con header, main, section de beneficios, planes, sobre el club y un footer profesional adaptado a un club deportivo llamado SportClub con los colores morado oscuro #2E1A47 y amarillo #F2B705."*

- **Resultado generado:** Estructura HTML base con secciones y una hoja de estilos inicial con variables `:root`.

- **Modificaciones realizadas:**
  - Se rediseñó completamente el sistema de diseño adoptando tipografía `Barlow Condensed` para display y `DM Sans` para cuerpo, eliminando el genérico Inter.
  - Se definió una paleta de variables CSS ampliada (`--brand-black`, `--brand-dark`, `--brand-panel`, `--brand-card`, `--text-primary`, `--text-secondary`, `--text-muted`, variables de transición).
  - Se añadió la sección `#contacto` con correo, teléfono, dirección, redes sociales y grilla de horarios — sección obligatoria omitida en el resultado generado.
  - Se añadió el ítem "Contacto" al menú de navegación.
  - Se enriqueció la sección "Sobre el Club" añadiendo historia breve del club (desde 2018) con diseño de línea de tiempo lateral.
  - Cada plan de suscripción ahora incluye una lista explícita de beneficios, cumpliendo la exigencia de "nombre, precio y beneficios" de la rúbrica.
  - Se diseñaron `@keyframes` CSS: `fadeUp`, `fadeIn`, `pulseGold` y `shimmer` para animaciones de entrada sin JavaScript.
  - Se implementaron orbes de fondo difuminados y líneas horizontales decorativas en la sección hero con posicionamiento absoluto y CSS puro.
  - Se añadieron `hero__stats` con 4 métricas del club (socios, sucursales, satisfacción, años) como elementos de credibilidad.
  - Se implementaron media queries en tres breakpoints: 1024px, 768px y 480px para garantizar compatibilidad responsive completa.

- **Justificación:** La IA generó una estructura funcional pero sin identidad visual diferenciadora. Las modificaciones elevan el diseño a nivel profesional, incorporan todas las secciones obligatorias de la rúbrica y añaden profundidad visual mediante técnicas CSS avanzadas que demuestran dominio del estándar CSS3.

---

#### Módulo 2 — Formularios (Login, Registro y Recuperación)

- **Herramienta:** Gemini Chat
- **Fecha:** 31/05/2026
- **Prompt utilizado:**
  > *"Crea un formulario de Login centrado en pantalla, dentro de una tarjeta visual tipo card, con identidad de SportClub y accesos directos a los dashboards de usuario, coach y administrador en el pie del formulario."*

- **Resultado generado:** Formulario HTML con inputs básicos y estilos iniciales de card.

- **Modificaciones realizadas:**
  - Se rediseñó completamente la card de autenticación con `backdrop-filter: blur(32px)`, bordes con gradiente dorado superior y sombra profunda.
  - Se añadió el componente `.auth-logo-mark` (cuadrado dorado con emoji de gimnasio) como identidad visual del formulario, reemplazando el texto plano original.
  - Se implementó el link de retorno `auth-back` hacia la landing page en todos los formularios.
  - Se diseñó la sección de accesos de revisión docente como componente `.review-section` con tres enlaces `.review-link` diferenciados por color de rol (azul/verde/rojo).
  - Se añadió el separador visual `auth-divider` entre el formulario y los accesos de revisión.
  - Se añadieron tres mensajes de feedback diferentes en el formulario de registro: error de coincidencia, error de correo inválido y mensaje de éxito — con clases semánticas `.form-msg--error` y `.form-msg--success`.
  - En recuperación, el mensaje de confirmación se integró como elemento permanente visible dentro del formulario (`form-msg--info`), cumpliendo la restricción de no usar `alert()`.
  - Se añadió el campo de teléfono opcional al formulario de registro, como información adicional pedida por la rúbrica.

- **Justificación:** La rúbrica exige formularios "completos, coherentes y visualmente profesionales" con "espacios visuales para mensajes de error, éxito y retroalimentación". Las modificaciones manuales garantizan el cumplimiento completo, elevan el nivel estético y estructuran correctamente la experiencia de usuario sin usar JavaScript.

---

#### Módulo 3 — Dashboards y Diferenciación Visual por Roles

- **Herramienta:** Gemini Chat
- **Fecha:** 31/05/2026
- **Prompt utilizado:**
  > *"Genera tres vistas de dashboard estáticos con estructura de sidebar y header compartidos, diferenciados mediante el atributo data-role en el body: azul para usuario, verde para coach y rojo para administrador."*

- **Resultado generado:** Tres archivos HTML con estructura básica de sidebar y área de contenido.

- **Modificaciones realizadas:**
  - Se rediseñó el sistema de clases de dashboards con nomenclatura BEM refinada: `db-header`, `db-sidebar`, `db-main`, `db-stat-card`, `db-table`, etc.
  - Se implementó la barra lateral (`db-sidebar`) como elemento `position: fixed` con dos secciones semánticas separadas por `db-nav-label`, y en responsive se convierte en barra horizontal con `flex-wrap`.
  - Se añadió el indicador de navegación activa `::before` (línea lateral de color del rol) en cada enlace `.db-nav-link.active`.
  - La diferenciación visual por rol se amplió para cubrir los 6 elementos exigidos: (1) borde inferior del header, (2) color del logo, (3) fondo del logo-dot, (4) color del nav activo, (5) indicador `::before` del nav, (6) `stat-number`, (7) línea inferior de stat-card en hover, (8) borde de stat-card en hover y (9) botones `.btn--role`.
  - Se diseñó el componente `.db-stat-card` con pseudo-elemento `::after` que aparece como barra de color del rol en el borde inferior en hover, sin necesidad de JavaScript.
  - Se agregó el componente `.db-profile-card` con `<dl>/<dt>/<dd>` semánticos para el perfil rápido del usuario.
  - Se completó el Dashboard Usuario con: mensaje motivacional, tabla de 5 reservas con columna de estado (badge coloreado), 3 cards de clases con ícono + descripción + botón `btn--role`, y perfil rápido con 5 campos (nombre, correo, edad, deporte favorito, plan).
  - Se completó el Dashboard Coach con: 4 métricas en stats-grid, tabla de 5 alumnos con estado, 3 cards de clases asignadas (nombre, día, hora, alumnos, badge), tabla de horario semanal con 5 filas (clase, día, hora inicio, hora fin, cantidad alumnos).
  - Se completó el Dashboard Admin con: 4 cards estadísticas (usuarios, coaches, clases, ingresos), tabla de 5 usuarios con todos los campos (RUT, nombre, rol, estado, fecha), panel de 3 reportes (clase más solicitada, usuarios activos, reservas del día), y 4 botones de configuración rápida.
  - Se añadió `link rel="preconnect"` para Google Fonts en los dashboards que no lo tenían.

- **Justificación:** La rúbrica exige diferenciación visual clara en header, navegación y botones principales, y contenido completo en cada dashboard. El resultado de la IA cubría la estructura básica pero la diferenciación visual era mínima y el contenido incompleto en múltiples secciones. Las modificaciones garantizan el cumplimiento íntegro de todos los criterios de la rúbrica al nivel "Excelente".

---

## 3. Control de Calidad y Validación Técnica

1. **HTML5 Semántico:** Se utilizaron exclusivamente etiquetas semánticas: `<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<article>`, `<footer>`, `<dl>`, `<dt>`, `<dd>`. Los `<div>` se reservan estrictamente para wrappers de layout.

2. **CSS3 avanzado:** El proyecto utiliza: variables `--custom-property`, `clamp()` para tipografía fluida, `min()` para anchos responsivos, `calc()`, `grid-template-columns: repeat(auto-fit, ...)`, `backdrop-filter: blur()`, `@keyframes` para 4 animaciones CSS, pseudo-elementos `::before` y `::after`, selectores de atributo `[data-role]`, y `aspect-ratio`.

3. **Sin JavaScript:** Todo el proyecto funciona íntegramente sin una sola línea de JavaScript. Los mensajes de feedback están presentes en el HTML como estructuras visuales con `display: none`. Las animaciones son exclusivamente CSS.

4. **Navegación funcional:** Todos los `<a href="">` apuntan a rutas válidas dentro del árbol del proyecto. No existen botones ni links sin destino en los flujos principales de navegación.

5. **Responsive Design:** Se implementaron tres breakpoints: `max-width: 1024px` (tabletas landscape), `max-width: 768px` (tabletas portrait / móviles grandes) y `max-width: 480px` (móviles pequeños).

6. **Accesibilidad básica:** Todos los `<input>` tienen `<label>` asociado mediante `for`/`id`. Se usaron `<dl>/<dt>/<dd>` para listas de definición en el perfil rápido. Los colores de texto superan el contraste mínimo WCAG AA sobre fondos oscuros.
