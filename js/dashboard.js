// ============================================================
//  SportClub — dashboard.js
//  Script compartido por todos los dashboards
//  - Protección de rutas
//  - Cargar datos reales del usuario
//  - Cerrar sesión
// ============================================================

const API_URL = 'http://localhost:3000';

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

// ── Cargar nombre del usuario en el header ──────────────────
function cargarNombreUsuario(idElemento = 'nombre-usuario') {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const el = document.getElementById(idElemento);
    if (el && usuario.full_name) {
        el.textContent = usuario.full_name;
    }
}

// ── Badge de rol con color ──────────────────────────────────
function badgeRol(role) {
    const config = {
        admin: { color: '#ef4444', label: 'Administrador' },
        coach: { color: '#3b82f6', label: 'Coach' },
        user:  { color: '#10b981', label: 'Usuario' }
    };
    const cfg = config[role] || { color: '#6b7280', label: role };
    return `<span style="background:${cfg.color};color:#fff;padding:4px 14px;
            border-radius:50px;font-size:0.78rem;font-weight:700;">${cfg.label}</span>`;
}

// ── Cerrar sesión ───────────────────────────────────────────
function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// ── Formatear fecha dd/mm/yyyy ──────────────────────────────
function formatFecha(fechaStr) {
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
