// ============================================================
//  SportClub — usuarios.js
//  CRUD completo de usuarios (solo rol admin)
//  Endpoints: GET/POST/PUT/DELETE /api/users
// ============================================================

// La URL base (API_URL) ya viene definida globalmente por config.js.
// IMPORTANTE: config.js debe cargarse ANTES que este archivo en el HTML:
// <script src="../js/config.js"></script>
// <script src="../js/usuarios.js"></script>

// getToken(), formatearFecha() y badgeRol() ya están definidas globalmente
// en dashboard.js (siempre se carga antes que este archivo). No se repiten
// aquí para evitar funciones duplicadas en distintos archivos.

// ── Verificar que el usuario sea admin (red de seguridad adicional;
//    protegerRuta('admin') en el HTML ya hace esta misma validación
//    antes de que este script termine de cargar) ──────────────
function verificarAdmin() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario || usuario.role !== 'admin') {
        // Sin alert(): redirección silenciosa, igual que protegerRuta()
        window.location.href = 'login.html';
    }
    return usuario;
}

// ============================================================
//  LISTAR USUARIOS
// ============================================================
async function cargarUsuarios() {
    const tbody = document.getElementById('tabla-usuarios-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#aaa;">Cargando...</td></tr>';

    try {
        const response = await fetch(`${API_URL}/api/users`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Error al cargar usuarios');

        // CORRECCIÓN CRÍTICA: Validación flexible para capturar el arreglo de usuarios correctamente
        const usuarios = Array.isArray(data) ? data : (data.data || data.users || data.resultado || []);

        tbody.innerHTML = '';

        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#aaa;">No hay usuarios registrados.</td></tr>';
            return;
        }

        usuarios.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.full_name}</td>
                <td>${u.email}</td>
                <td>${badgeRol(u.role)}</td>
                <td>${formatearFecha(u.createdAt || u.created_at)}</td>
                <td>
                    <button onclick="abrirModalEditar(${u.id})"
                        style="background:#f2b705;color:#000;border:none;padding:6px 14px;
                               border-radius:6px;cursor:pointer;margin-right:6px;font-weight:700;">
                        ✏️ Editar
                    </button>
                    <button onclick="eliminarUsuario(${u.id}, '${u.full_name}')"
                        style="background:#ef4444;color:#fff;border:none;padding:6px 14px;
                               border-radius:6px;cursor:pointer;font-weight:700;">
                        🗑️ Eliminar
                    </button>
                </td>`;
            tbody.appendChild(tr);
        });

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#f87171;">Error al cargar usuarios.</td></tr>';
        console.error('Error:', error);
    }
}

// ============================================================
//  CREAR USUARIO
// ============================================================
async function crearUsuario(e) {
    if (e) e.preventDefault();

    limpiarErroresModal();

    const nombre = document.getElementById('modal-nombre').value.trim();
    const email = document.getElementById('modal-email').value.trim();
    const rol = document.getElementById('modal-rol').value;
    const password = document.getElementById('modal-password').value.trim();
    const confirm = document.getElementById('modal-confirm').value.trim();

    let hayError = false;

    if (!nombre) { mostrarErrorCampo('err-modal-nombre', '❌ El nombre es obligatorio.'); hayError = true; }
    if (!email) { mostrarErrorCampo('err-modal-email', '❌ El email es obligatorio.'); hayError = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarErrorCampo('err-modal-email', '❌ Email inválido.'); hayError = true;
    }
    if (!password) { mostrarErrorCampo('err-modal-password', '❌ La contraseña es obligatoria.'); hayError = true; }
    else if (password.length < 8) { mostrarErrorCampo('err-modal-password', '❌ Mínimo 8 caracteres.'); hayError = true; }
    else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
        mostrarErrorCampo('err-modal-password', '❌ Debe tener letras y números.'); hayError = true;
    }
    if (password !== confirm) { mostrarErrorCampo('err-modal-confirm', '❌ Las contraseñas no coinciden.'); hayError = true; }

    if (hayError) return;

    const btnGuardar = document.getElementById('btn-guardar-usuario');
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';

    try {
        const response = await fetch(`${API_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                full_name: nombre,
                email,
                password,
                role: rol,
                must_change_password: false
            })
        });
        const data = await response.json();

        if (data.ok || response.status === 201) {
            cerrarModal();
            mostrarToast('✅ Usuario creado correctamente.');
            await cargarUsuarios();
        } else {
            mostrarErrorCampo('err-modal-general', `❌ ${data.message || 'Error al crear usuario.'}`);
        }
    } catch (error) {
        mostrarErrorCampo('err-modal-general', '❌ No se pudo conectar con el servidor.');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = '💾 Guardar Datos';
    }
}

// ============================================================
//  CARGAR DATOS PARA EDITAR
// ============================================================
async function abrirModalEditar(id) {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();

        // CORRECCIÓN: Lectura segura del objeto de un solo usuario
        const u = data.data || data.user || data;

        document.getElementById('modal-id').value = u.id;
        document.getElementById('modal-nombre').value = u.full_name;
        document.getElementById('modal-email').value = u.email;
        document.getElementById('modal-rol').value = u.role;
        document.getElementById('modal-password').value = '';
        document.getElementById('modal-confirm').value = '';

        document.getElementById('modal-titulo').textContent = '✏️ Editar Usuario';
        document.getElementById('pass-hint').style.display = 'block';

        limpiarErroresModal();
        abrirModal();

    } catch (error) {
        mostrarToast('❌ Error al cargar usuario.', true);
    }
}

// ============================================================
//  ACTUALIZAR USUARIO
// ============================================================
async function actualizarUsuario(id, nombre, email, rol, password, confirm) {
    limpiarErroresModal();
    let hayError = false;

    if (!nombre) { mostrarErrorCampo('err-modal-nombre', '❌ El nombre es obligatorio.'); hayError = true; }
    if (!email) { mostrarErrorCampo('err-modal-email', '❌ El email es obligatorio.'); hayError = true; }
    if (password && password.length < 8) {
        mostrarErrorCampo('err-modal-password', '❌ Mínimo 8 caracteres.'); hayError = true;
    } else if (password && !/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
        mostrarErrorCampo('err-modal-password', '❌ Debe tener letras y números.'); hayError = true;
    }
    if (password && password !== confirm) {
        mostrarErrorCampo('err-modal-confirm', '❌ Las contraseñas no coinciden.'); hayError = true;
    }
    if (hayError) return;

    const btnGuardar = document.getElementById('btn-guardar-usuario');
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';

    const payload = { full_name: nombre, email, role: rol };
    if (password) payload.password = password;

    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (data.ok || response.status === 200) {
            cerrarModal();
            mostrarToast('✅ Usuario actualizado correctamente.');
            await cargarUsuarios();
        } else {
            mostrarErrorCampo('err-modal-general', `❌ ${data.message || 'Error al actualizar.'}`);
        }
    } catch (error) {
        mostrarErrorCampo('err-modal-general', '❌ No se pudo conectar con el servidor.');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = '💾 Guardar Datos';
    }
}

// ============================================================
//  ELIMINAR USUARIO
// ============================================================
async function eliminarUsuario(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar a "${nombre}"?`)) return;

    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();

        if (data.ok || response.status === 200) {
            mostrarToast('✅ Usuario eliminado.');
            await cargarUsuarios();
        } else {
            mostrarToast(`❌ ${data.message || 'Error al eliminar.'}`, true);
        }
    } catch (error) {
        mostrarToast('❌ No se pudo conectar con el servidor.', true);
    }
}

// ============================================================
//  HELPERS MODAL Y UI
// ============================================================
function abrirModal() {
    document.getElementById('modal-usuario').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-usuario').style.display = 'none';
    document.getElementById('modal-id').value = '';
    document.getElementById('modal-titulo').textContent = '➕ Nuevo Usuario';
    document.getElementById('pass-hint').style.display = 'none';
    limpiarErroresModal();
}

function abrirModalNuevo() {
    document.getElementById('form-usuario').reset();
    document.getElementById('modal-id').value = '';
    document.getElementById('modal-titulo').textContent = '➕ Nuevo Usuario';
    document.getElementById('pass-hint').style.display = 'none';
    limpiarErroresModal();
    abrirModal();
}

function mostrarErrorCampo(id, texto) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = texto;
    el.style.display = 'block';

    // Además del mensaje, marcamos el input con borde rojo (requisito de la pauta)
    const inputId = id.replace('err-', '');
    const input = document.getElementById(inputId);
    if (input) input.classList.add('input-error');
}

function limpiarErroresModal() {
    ['err-modal-nombre', 'err-modal-email', 'err-modal-password',
        'err-modal-confirm', 'err-modal-general'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.textContent = ''; el.style.display = 'none'; }

            // Quitamos también el borde rojo del input asociado, si existe
            const input = document.getElementById(id.replace('err-', ''));
            if (input) input.classList.remove('input-error');
        });
}

function mostrarToast(mensaje, esError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = mensaje;
    toast.style.background = esError ? '#ef4444' : '#10b981';
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// ============================================================
//  INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    verificarAdmin();

    // Mostrar nombre del admin en el header
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const elNombre = document.getElementById('admin-nombre');
    if (elNombre) elNombre.textContent = usuario.full_name || 'Admin';

    cargarUsuarios();

    // Submit del formulario del modal
    const form = document.getElementById('form-usuario');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('modal-id').value;

            const nombre = document.getElementById('modal-nombre').value.trim();
            const email = document.getElementById('modal-email').value.trim();
            const rol = document.getElementById('modal-rol').value;
            const password = document.getElementById('modal-password').value.trim();
            const confirm = document.getElementById('modal-confirm').value.trim();

            if (id) {
                await actualizarUsuario(id, nombre, email, rol, password, confirm);
            } else {
                await crearUsuario(e);
            }
        });
    }

    // Cerrar modal al hacer clic fuera
    const modalUsuario = document.getElementById('modal-usuario');
    if (modalUsuario) {
        modalUsuario.addEventListener('click', (e) => {
            if (e.target === modalUsuario) cerrarModal();
        });
    }
});