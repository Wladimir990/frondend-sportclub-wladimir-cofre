# 🏋️ SportClub — Sistema Web Estático

**Evaluación Sumativa 1: Desarrollo de sitio web estático utilizando HTML5 y CSS3 (20%)**

| Campo | Detalle |
|-------|---------|
| **Institución** | INACAP |
| **Asignatura** | Programación Front End (TI3V31) |
| **Docente** | Javier Ahumada |
| **Estudiante** | Saud Wladimir Cofré Encina |
| **Año** | 2026 |

---

## 🌐 Demo en vivo

> [Ver sitio en GitHub Pages](https://TU-USUARIO.github.io/sportclub)

---

## 📋 Descripción del Proyecto

SportClub es un sistema web estático desarrollado con HTML5 y CSS3 puro (sin JavaScript) para un club deportivo que busca digitalizar sus procesos internos. Incluye landing page completa, formularios de autenticación y tres dashboards diferenciados visualmente por rol de usuario.

---

## 🗂️ Estructura del Proyecto

```
sportclub/
│
├── index.html                    ← Landing Page principal
│
├── css/
│   └── style.css                 ← Hoja de estilos global
│
├── js/                           ← (Reservado, sin JS en esta evaluación)
│
├── assets/
│   └── img/                      ← Imágenes y recursos
│
├── pages/
│   ├── login.html                ← Formulario de inicio de sesión
│   ├── registro.html             ← Formulario de registro
│   ├── recuperacion.html         ← Recuperación de contraseña
│   ├── dashboard-usuario.html    ← Dashboard rol Usuario (azul)
│   ├── dashboard-coach.html      ← Dashboard rol Coach (verde)
│   └── dashboard-admin.html      ← Dashboard rol Administrador (rojo)
│
├── README.md
└── IA.md
```

---

## 🧩 Módulos desarrollados

### Landing Page
- ✅ Header fijo con logo y navegación completa (Inicio, Beneficios, Planes, Sobre el Club, Contacto, Login)
- ✅ Hero section con título, descripción, botones y estadísticas del club
- ✅ Beneficios: 6 cards con número, ícono, título y descripción
- ✅ Planes: 3 planes con nombre, precio, período y lista de beneficios por plan
- ✅ Sobre el Club: historia breve, misión, visión y valores
- ✅ Contacto: correo, teléfono, dirección, redes sociales y horarios
- ✅ Footer completo con navegación, contacto, redes y accesos de revisión

### Formularios
- ✅ **Login**: campos correo/contraseña, botón ingresar, link recuperación, link registro, mensajes de feedback preparados, accesos rápidos a los 3 dashboards
- ✅ **Registro**: nombre, correo, teléfono (opcional), contraseña, confirmar contraseña, 3 mensajes de feedback visuales (error coincidencia, error correo, éxito)
- ✅ **Recuperación**: campo correo, mensaje de confirmación integrado (sin `alert()`), link de volver

### Dashboards
| Dashboard | Color | Contenido obligatorio cubierto |
|-----------|-------|-------------------------------|
| **Usuario** | 🔵 Azul | Bienvenida + mensaje motivacional, 5 reservas (clase, día, hora, coach, estado), 3 clases disponibles con ícono + descripción + botón, perfil rápido completo |
| **Coach** | 🟢 Verde | Panel resumen 4 métricas, tabla 5 alumnos (nombre, correo, clase, estado), 3 clases asignadas cards (nombre, día, hora), horario semanal tabla 5 filas (clase, día, hora inicio, fin, alumnos) |
| **Admin** | 🔴 Rojo | 4 cards estadísticas (usuarios, coaches, clases, ingresos), tabla 5 usuarios (RUT, nombre, rol, estado, fecha), panel reportes 3 cards, configuración rápida 4 botones |

---

## 🎨 Sistema de diseño

### Tipografía
- **Display / Títulos:** `Barlow Condensed` (condensada, deportiva, 900 weight)
- **Cuerpo / Texto:** `DM Sans` (legible, moderna, 300-700)

### Paleta corporativa

| Variable | Color | Uso |
|----------|-------|-----|
| `--brand-gold` | `#F2B705` | Acento principal, CTAs |
| `--brand-purple` | `#2E1A47` | Color corporativo secundario |
| `--brand-black` | `#080610` | Fondo principal |
| `--usuario-color` | `#3B82F6` | Identidad Dashboard Usuario |
| `--coach-color` | `#10B981` | Identidad Dashboard Coach |
| `--admin-color` | `#EF4444` | Identidad Dashboard Admin |

### Animaciones CSS puras
- `fadeUp`: entrada progresiva de elementos hero
- `fadeIn`: carga general de dashboards
- `pulseGold`: efecto de pulso en el indicador del eyebrow
- `shimmer`: efecto de brillo en textos destacados

---

## ✅ Criterios de evaluación cubiertos

- [x] Landing Page completa y profesional con todas las secciones
- [x] Formularios completos con estructura visual de feedback preparada
- [x] Dashboard Usuario con todos los contenidos requeridos
- [x] Dashboard Coach con todos los contenidos requeridos
- [x] Dashboard Administrador con todos los contenidos requeridos
- [x] Diferenciación visual por rol: header, logo, nav activa, stat-numbers, botones de acción, hover de cards
- [x] HTML5 semántico (`header`, `nav`, `main`, `aside`, `section`, `article`, `footer`, `dl`, `dt`, `dd`)
- [x] CSS3 moderno: variables `:root`, Grid, Flexbox, `clamp()`, `@keyframes`, `backdrop-filter`
- [x] Diseño responsive con media queries (1024px, 768px, 480px)
- [x] Sin JavaScript, sin `alert()` para mensajes
- [x] Todos los enlaces funcionales y sin destinos rotos
- [x] `README.md` e `IA.md` incluidos

---

## 🛠️ Tecnologías

- **HTML5** — Estructura semántica completa
- **CSS3** — Variables, Grid, Flexbox, animaciones, responsive
- **Google Fonts** — Barlow Condensed + DM Sans

> ⚠️ **Sin JavaScript** — Proyecto 100% HTML + CSS según los requisitos de la evaluación.

---

## 👨‍💻 Autor

**Saud Wladimir Cofré Encina**
Estudiante INACAP · Programación Front End T13V31 · 2026
