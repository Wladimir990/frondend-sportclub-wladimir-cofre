// ============================================================
//  SportClub — dashboard.js
//  Script compartido por todos los dashboards
//  - Protección de rutas
//  - Cargar datos reales del usuario
//  - Cerrar sesión
// ============================================================

window.API_URL = window.API_URL || 'http://localhost:3000'; // ver config.js

// ── Protección de ruta — redirige si no hay token ───────────
function protegerRuta(rolRequerido = null) {
    const token   = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    if (!token || !usuario) {
        window.location.href = 'login.html';
        return null;
    }

    // Si se requiere un rol específico
    if (rolRequerido && usuario.role !== rolRequerido) {
        // Redirigir al dashboard correcto según su rol
        const rutas = {
            user:  'dashboard-usuario.html',
            coach: 'dashboard-coach.html',
            admin: 'dashboard-admin.html'
        };
        window.location.href = rutas[usuario.role] || 'login.html';
        return null;
    }

    return usuario;
}

// ── Obtener token guardado en localStorage (helper compartido) ──
function getToken() {
    return localStorage.getItem('token');
}

// ── Cargar nombre del usuario en el header ──────────────────
function cargarNombreUsuario(idElemento = 'nombre-usuario') {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const el = document.getElementById(idElemento);
    if (el && usuario.full_name) {
        el.textContent = usuario.full_name;
    }
}

// ── Badge de rol con color (helper compartido por dashboards) ──
function badgeRol(role) {
    const colores = { admin: '#ef4444', coach: '#3b82f6', user: '#10b981' };
    const color = colores[role] || '#6b7280';
    return `<span style="background:${color};color:#fff;padding:4px 14px;
            border-radius:50px;font-size:0.78rem;font-weight:700;">${role}</span>`;
}

// ── Cerrar sesión ───────────────────────────────────────────
function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// ── Formatear fecha dd/mm/yyyy (helper compartido) ──────────
function formatearFecha(fechaStr) {
    if (!fechaStr) return '—';
    const f = new Date(fechaStr);
    if (isNaN(f)) return '—';
    return `${String(f.getDate()).padStart(2,'0')}/${String(f.getMonth()+1).padStart(2,'0')}/${f.getFullYear()}`;
}

// ── Inicializar logout en todos los dashboards ──────────────
document.addEventListener('DOMContentLoaded', () => {
    // Botón cerrar sesión
    document.querySelectorAll('.btn-cerrar-sesion, .db-action-btn--logout')
        .forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                cerrarSesion();
            });
        });
});
