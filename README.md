# SportClub — Sistema con Login, CRUD de Usuarios y Perfil

Evaluación Sumativa 2: Desarrollo FrontEnd con API (35%)
Programación Front End (TI3V31) — INACAP La Serena
Docente: Javier Ahumada
Estudiante: Saud Wladimir Cofré Encina — 2026

---

## De qué se trata

En la evaluación pasada el sitio era estático, solo HTML y CSS, con datos fijos
escritos a mano. En esta evolucionó: ahora el frontend habla con un backend real
(Node + Express + SQLite) usando `fetch()`, así que el login, el registro y la
gestión de usuarios trabajan con datos que de verdad están guardados en una base
de datos, no inventados en el código.

Para que funcione necesitás tener corriendo el backend (`Backend-ClubDeportivo`)
en `http://localhost:3000`. Este repo es solo el frontend.

## Qué hace

- Login y registro contra la API, con validaciones y mensajes de error en pantalla
  (nada de `alert()`).
- Cuando entrás, te manda automáticamente a tu dashboard según tu rol: usuario,
  coach o admin.
- Si sos admin, podés crear, editar y eliminar usuarios desde una tabla conectada
  a la API.
- Cualquier usuario puede ver y editar su perfil, y cambiar su contraseña.

## Estructura de carpetas

```
frontend-sportclub/
├── index.html
├── css/style.css
├── js/
│   ├── config.js       → acá está la URL del backend, una sola vez
│   ├── dashboard.js     → funciones que comparten todos los dashboards
│   ├── login.js
│   ├── registro.js
│   ├── perfil.js
│   ├── usuarios.js      → CRUD de usuarios (admin)
│   └── admin.js         → estadísticas del panel admin
├── assets/img/
└── pages/
    ├── login.html
    ├── registro.html
    ├── recuperacion.html
    ├── perfil.html
    ├── usuarios.html        → gestión de usuarios (admin)
    ├── dashboard-usuario.html
    ├── dashboard-coach.html
    └── dashboard-admin.html
```

## Endpoints que se usan

| Qué hace | Método | Ruta | Necesita token |
|---|---|---|---|
| Login | POST | /api/auth/login | No |
| Registro | POST | /api/auth/register | No |
| Ver mi perfil | GET | /api/auth/me | Sí |
| Editar mi perfil | PUT | /api/auth/me | Sí |
| Cambiar contraseña | PUT | /api/auth/me/password | Sí |
| Listar usuarios | GET | /api/users | Sí |
| Ver un usuario | GET | /api/users/:id | Sí |
| Crear usuario | POST | /api/users | Sí |
| Editar usuario | PUT | /api/users/:id | Sí |
| Eliminar usuario | DELETE | /api/users/:id | Sí |

Todas las llamadas mandan el token en el header `Authorization: Bearer <token>`
cuando hace falta.

## Validaciones

Todos los formularios revisan que los campos obligatorios estén completos, que el
email tenga formato válido, y que la contraseña tenga mínimo 8 caracteres con
letras y números, con confirmación. Los errores se muestran debajo de cada campo,
en rojo, no con `alert()`.

## Diseño

Se mantuvo la misma paleta y tipografía de la evaluación anterior (fondo oscuro,
acentos morado/dorado, `Barlow Condensed` para títulos y `DM Sans` para el cuerpo),
y cada rol tiene su color: azul para usuario, verde para coach, rojo para admin.

## Cómo correrlo

1. En la carpeta del backend: `npm install` y después `npm run dev`. Tiene que
   quedar escuchando en el puerto 3000.
2. Abrí este frontend con Live Server y entrá a `pages/login.html`.
3. Desde el login hay accesos directos a los 3 dashboards para revisar sin tener
   que loguearte manualmente.

---

**Saud Wladimir Cofré Encina** — Programación Front End TI3V31 — 2026
