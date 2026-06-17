// ============================================================
//  SportClub — admin.js
//  Control y Analítica del Dashboard del Administrador
//  Periodo: 2026 · INACAP (T13V31)
// ============================================================

// La URL base (API_URL) ya viene definida globalmente por config.js.
// IMPORTANTE: config.js debe cargarse ANTES que este archivo en el HTML.

// getToken() ya está definida globalmente en dashboard.js
// (siempre se carga antes que este archivo en dashboard-admin.html).

/**
 * Formatea valores numéricos a moneda peso chileno (CLP)
 */
function formatMonedaCLP(valor) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(valor);
}

/**
 * Carga y procesa de forma agregada las estadísticas del sistema
 * Consume: GET /api/users
 */
async function cargarEstadisticasDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/users`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const usuarios = data.data || data;

        if (!Array.isArray(usuarios)) return;

        // Filtrado de datos por rol para los contadores
        const totalUsuarios = usuarios.length;
        const totalCoaches = usuarios.filter(u => u.role === 'coach').length;
        const totalAdmins = usuarios.filter(u => u.role === 'admin').length;
        const totalSocios = usuarios.filter(u => u.role === 'user').length;

        // Inyección dinámica en las tarjetas de estadísticas
        const elTotal = document.getElementById('stat-total-usuarios');
        const elCoach = document.getElementById('stat-total-coaches');
        const elAdmin = document.getElementById('stat-total-admins');
        const elIngre = document.getElementById('stat-ingresos');

        if (elTotal) elTotal.textContent = totalUsuarios;
        if (elCoach) elCoach.textContent = totalCoaches;
        if (elAdmin) elAdmin.textContent = totalAdmins;

        // Modelo de negocio: Cálculo estimado basado en valor de membresía Premium ($29.900)
        if (elIngre) {
            const ingresosEstimados = totalSocios * 29900;
            elIngre.textContent = formatMonedaCLP(ingresosEstimados);
        }

        // Renderizado del bloque analítico de retención
        const elReporteActivos = document.getElementById('reporte-activos');
        const elPorcentaje = document.getElementById('reporte-porcentaje');

        if (elReporteActivos && elPorcentaje) {
            // Simulación analítica del 87% de retención sobre la muestra real del backend
            const sociosActivos = Math.floor(totalUsuarios * 0.87);
            elReporteActivos.textContent = `${sociosActivos} de ${totalUsuarios} usuarios registran interacciones estables.`;
            elPorcentaje.textContent = '87% de retención';
        }

    } catch (error) {
        console.error('Error analítico al calcular estadísticas:', error);
    }
}

/**
 * Handler de eliminación directa desde la fila del panel
 * Mantiene la reactividad recargando los contadores y la tabla
 */
async function eliminarUsuarioDesdeDashboard(id, nombre) {
    if (!id) return;

    // Alerta de confirmación nativa permitida previo a mutaciones destructivas en DB
    if (!confirm(`¿Está completamente seguro de eliminar de forma permanente la cuenta de "${nombre}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok || data.ok) {
            // Notificación elegante mediante el Toast global expuesto en usuarios.js
            if (typeof mostrarToast === 'function') {
                mostrarToast('✅ Cuenta eliminada del sistema correctamente.');
            }

            // Recarga coordinada de los componentes asíncronos de la vista
            if (typeof cargarUsuariosAdmin === 'function') await cargarUsuariosAdmin();
            await cargarEstadisticasDashboard();
        } else {
            if (typeof mostrarToast === 'function') {
                mostrarToast(`❌ Operación denegada: ${data.message || 'Error del servidor'}`, true);
            }
        }
    } catch (error) {
        console.error('Fallo crítico en operación DELETE:', error);
        if (typeof mostrarToast === 'function') {
            mostrarToast('❌ Error de comunicación. Backend inaccesible.', true);
        }
    }
}

// Interceptor de inicio para sincronizar analíticas al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const sesionUsuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    // Verificación estricta complementaria a dashboard.js
    if (sesionUsuario.role === 'admin') {
        cargarEstadisticasDashboard();
    }
});