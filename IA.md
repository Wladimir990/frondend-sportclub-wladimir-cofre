# Uso de IA — SportClub (Evaluación 2)

INACAP La Serena — Programación Front End (TI3V31)
Docente: Javier Ahumada
Estudiante: Saud Wladimir Cofré Encina — 2026

---

Acá registro en qué momentos usé IA (Claude, de Anthropic) durante esta evaluación
y qué hice con lo que me dio. La usé sobre todo para destrabar errores y revisar
que el proyecto cumpliera lo que pedía la pauta, no para que me armara el sitio
de cero — eso ya lo tenía hecho desde la Evaluación 1 y lo fui conectando a la
API yo mismo.

## 1. El dashboard no cargaba los datos

Me tiraba error en la consola al entrar al panel de admin: `Failed to fetch` y
`net::ERR_CONNECTION_REFUSED`. Le mandé las capturas de la consola a Claude y me
explicó que ese error específico significa que el navegador ni siquiera logra
conectarse al backend — no es un problema del código del frontend, es que el
servidor no está corriendo. Revisé y efectivamente no tenía levantado el backend
con `npm run dev`. Lo prendí y el error desapareció.

## 2. Error raro de "Identifier ya declarado"

Después me apareció `Identifier 'API_URL' has already been declared`. Resulta que
yo había puesto `const API_URL = '...'` repetido en varios archivos JS distintos
(`dashboard.js`, `login.js`, `perfil.js`, `registro.js`, `usuarios.js`, `admin.js`),
y cuando dos de esos archivos se cargan juntos en la misma página, el navegador
explota porque no podés declarar la misma constante dos veces en el mismo scope.

Con Claude armamos una solución que evita que esto vuelva a pasar nunca, sin
importar qué combinación de scripts cargue cada página: en vez de `const`, usar
`window.API_URL = window.API_URL || 'http://localhost:3000';` en `config.js`. Una
asignación a `window` se puede repetir sin error, a diferencia de un `const`. Saqué
las declaraciones repetidas de los demás archivos y dejé `config.js` como la única
fuente de la URL del backend.

## 3. La página de "Gestionar Usuarios" estaba mal armada

Me di cuenta de que el link "Gestionar Usuarios" del menú del admin llevaba a
`usuarios.html`, pero ese archivo tenía pegado por error el contenido del
dashboard del usuario normal (el de "Bienvenido, Javier"), no la tabla de gestión
de cuentas. Con Claude armamos la página correcta: título, descripción, tabla con
ID/nombre/email/rol/fecha/acciones y el botón de "Nuevo Usuario", reutilizando el
mismo `usuarios.js` que ya tenía hecho el CRUD, y manteniendo el mismo estilo
visual oscuro/dorado que el resto del sitio (la pauta traía una imagen de
referencia con otro diseño, pero esa imagen solo mostraba qué tenía que tener la
página, no de qué color tenía que ser).

## 4. Revisión final contra la pauta

Le pasé la pauta completa en PDF y le pedí que me dijera qué me faltaba para la
nota máxima. Encontré dos cosas que arreglar:

- Tenía las mismas funciones (`getToken`, `badgeRol`, `formatearFecha`) copiadas
  en varios archivos con pequeñas diferencias. Las dejé escritas una sola vez en
  `dashboard.js`, que es el archivo que cargan todas las páginas, y borré las
  copias del resto.
- En `usuarios.js` había un `alert('Acceso denegado...')` que se me había
  colado en una función de seguridad extra (`verificarAdmin`). La pauta exige
  que los mensajes se muestren en pantalla, no con `alert()` nativo, así que lo
  saqué y dejé que redirija en silencio, igual que ya hacía `protegerRuta()`.
- El `README.md` y este mismo `IA.md` todavía hablaban del proyecto de la
  Evaluación 1 (la versión sin JavaScript). Los reescribí para que cuenten lo
  que realmente hace este proyecto ahora.

Después de cada cambio probé que el sitio siguiera funcionando (login, crear
usuario, editar, eliminar, ver perfil) antes de dar por terminado.

## 5. Faltaba la landing page real

Mi `index.html` real (el de la Evaluación 1, con hero, beneficios, planes, sobre
el club y contacto) se había perdido o nunca quedó subido: en su lugar había un
formulario de login genérico sin relación con SportClub, que además apuntaba a
un `styles.css` que no existe (mi archivo real es `style.css`). Como todas las
páginas del proyecto enlazan de vuelta a `index.html` (el logo de cada
dashboard, el botón "Volver al inicio" de login/registro), esto se notaba
apenas alguien navegaba el sitio. Con Claude reconstruí la landing page
completa usando únicamente clases que ya existían en mi propio `style.css`
(nada inventado), así que mantiene exactamente la identidad visual
morado/dorado original.

## 6. Revisión visual fina contra los requisitos de la pauta

Volví a pasar la pauta completa (con las imágenes de referencia de los
módulos "Usuarios" y "Perfil") y encontré dos detalles puntuales que se me
habían escapado en la revisión anterior:

- En el modal de "Nuevo Usuario" del admin y en el formulario de "Mi Perfil",
  cuando un campo tenía error solo se mostraba el texto en rojo debajo, pero el
  input no se marcaba con borde rojo (sí pasaba correctamente en login y
  registro). La pauta lo pide como obligatorio, así que agregué la misma clase
  `input-error` que ya usaba en los otros formularios.
- El botón "Nuevo Usuario" / "Registrar Usuario" estaba en rojo (el color de mi
  rol admin), pero la pauta pide explícitamente azul o verde para ese botón en
  particular. Lo cambié a verde.
- También agregué que el nombre se muestre capitalizado en "Mi Perfil", que es
  un detalle de formato que pedía la pauta y no tenía implementado.

## 7. Bug silencioso en registro.js: el borde rojo nunca se aplicaba

Al revisar de nuevo con Claude antes de dar el proyecto por cerrado, encontramos
que en `registro.js` la función `mostrarError()` sí tenía el código para poner
el input en rojo, pero ese código dependía de un parámetro (`inputId`) que
ninguna de las llamadas reales le pasaba — quedó como código "muerto" que nunca
se ejecutaba. El mensaje de error sí se mostraba, pero el input nunca se
marcaba con el borde rojo, igual que el bug que ya había corregido antes en el
modal de admin y en el perfil. Lo arreglamos así: ahora la función deriva el
input correspondiente directamente del `id` del propio mensaje de error (con
un caso especial para `confirm_password`, que no calza por nombre con su
mensaje `err-confirm`), y además agregué que el borde rojo se quite apenas el
usuario empieza a corregir el campo, igual que ya pasaba en el login.
