// ============================================================
//  SportClub — perfil.js
//  Ver y editar perfil + cambiar contraseña
//  Endpoints: GET/PUT /api/auth/me | PUT /api/auth/me/password
// ============================================================

const API_URL = 'http://localhost:3000';

function getToken() { return localStorage.getItem('token'); }

function formatearFecha(fechaStr) {
    if (!fechaStr) return '—';
    const f = new Date(fechaStr);
    return `${String(f.getDate()).padStart(2,'0')}/${String(f.getMonth()+1).padStart(2,'0')}/${f.getFullYear()}`;
}

function fechaParaInput(fechaStr) {
    if (!fechaStr) return '';
    return new Date(fechaStr).toISOString().split('T')[0];
}

function badgeRol(role) {
    const colores = { admin:'#ef4444', coach:'#3b82f6', user:'#10b981' };
    const color = colores[role] || '#6b7280';
    return `<span style="background:${color};color:#fff;padding:4px 14px;
            border-radius:50px;font-size:0.78rem;font-weight:700;">${role}</span>`;
}

// ============================================================
//  CARGAR PERFIL DESDE API
// ============================================================
async function cargarPerfil() {
    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        const u = data.data || data;

        // Guardar en localStorage actualizado
        localStorage.setItem('usuario', JSON.stringify(u));

        // Mostrar datos en la vista
        setTexto('perfil-nombre',  u.full_name);
        setTexto('perfil-email',   u.email.toLowerCase());
        setTexto('perfil-rol',     '');
        const rolEl = document.getElementById('perfil-rol');
        if (rolEl) rolEl.innerHTML = badgeRol(u.role);

        setTexto('perfil-fecha', formatearFecha(u.birth_date));
        setTexto('perfil-registro', formatearFecha(u.createdAt || u.created_at));

        // Avatar con iniciales
        const avatar = document.getElementById('perfil-avatar');
        if (avatar) avatar.textContent = u.full_name.charAt(0).toUpperCase();

        // Rellenar formulario de edición
        setVal('edit-nombre', u.full_name);
        setVal('edit-fecha',  fechaParaInput(u.birth_date));
        setVal('edit-metadata', u.metadata ? JSON.stringify(u.metadata) : '');

        // Email no editable
        const editEmail = document.getElementById('edit-email');
        if (editEmail) {
            editEmail.value    = u.email;
            editEmail.disabled = true;
            editEmail.style.opacity = '0.5';
        }

    } catch (error) {
        console.error('Error al cargar perfil:', error);
        if (error.message === 'Unauthorized' || error.message === 'Token inválido') {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    }
}

// ============================================================
//  GUARDAR CAMBIOS DEL PERFIL
// ============================================================
async function guardarPerfil(e) {
    e.preventDefault();
    limpiarErrores(['err-edit-nombre', 'err-edit-general']);

    const nombre = document.getElementById('edit-nombre').value.trim();
    const fecha  = document.getElementById('edit-fecha').value;
    const meta   = document.getElementById('edit-metadata').value.trim();

    if (!nombre) {
        mostrarError('err-edit-nombre', '❌ El nombre es obligatorio.');
        return;
    }

    const btnGuardar = document.getElementById('btn-guardar-perfil');
    btnGuardar.disabled    = true;
    btnGuardar.textContent = 'Guardando...';

    const payload = { full_name: nombre, birth_date: fecha || null };
    if (meta) {
        try { payload.metadata = JSON.parse(meta); }
        catch { payload.metadata = { otros: meta }; }
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            method:  'PUT',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (data.ok || response.status === 200) {
            mostrarFeedback('msg-perfil-ok', '✅ Perfil actualizado correctamente.');
            cargarPerfil();
        } else {
            mostrarError('err-edit-general', `❌ ${data.message || 'Error al actualizar.'}`);
        }
    } catch (error) {
        mostrarError('err-edit-general', '❌ No se pudo conectar con el servidor.');
    } finally {
        btnGuardar.disabled    = false;
        btnGuardar.textContent = '✅ Guardar cambios';
    }
}

// ============================================================
//  CAMBIAR CONTRASEÑA
// ============================================================
async function cambiarPassword(e) {
    e.preventDefault();
    limpiarErrores(['err-pass-actual','err-pass-nueva','err-pass-confirm','err-pass-general']);

    const actual   = document.getElementById('pass-actual').value.trim();
    const nueva    = document.getElementById('pass-nueva').value.trim();
    const confirmar = document.getElementById('pass-confirmar').value.trim();

    let hayError = false;

    if (!actual) { mostrarError('err-pass-actual', '❌ Ingresa tu contraseña actual.'); hayError = true; }
    if (!nueva)  { mostrarError('err-pass-nueva',  '❌ Ingresa la nueva contraseña.'); hayError = true; }
    else if (nueva.length < 8) { mostrarError('err-pass-nueva', '❌ Mínimo 8 caracteres.'); hayError = true; }
    else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(nueva)) {
        mostrarError('err-pass-nueva', '❌ Debe tener letras y números.'); hayError = true;
    }
    if (nueva !== confirmar) { mostrarError('err-pass-confirm', '❌ Las contraseñas no coinciden.'); hayError = true; }
    if (hayError) return;

    const btn = document.getElementById('btn-cambiar-pass');
    btn.disabled    = true;
    btn.textContent = 'Actualizando...';

    try {
        const response = await fetch(`${API_URL}/api/auth/me/password`, {
            method:  'PUT',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ current_password: actual, new_password: nueva })
        });
        const data = await response.json();

        if (data.ok || response.status === 200) {
            mostrarFeedback('msg-pass-ok', '✅ Contraseña actualizada correctamente.');
            document.getElementById('form-password').reset();
        } else {
            mostrarError('err-pass-general', `❌ ${data.message || 'Contraseña actual incorrecta.'}`);
        }
    } catch (error) {
        mostrarError('err-pass-general', '❌ No se pudo conectar con el servidor.');
    } finally {
        btn.disabled    = false;
        btn.textContent = '🔒 Actualizar contraseña';
    }
}

// ============================================================
//  HELPERS
// ============================================================
function setTexto(id, texto) {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
}

function setVal(id, valor) {
    const el = document.getElementById(id);
    if (el) el.value = valor || '';
}

function mostrarError(id, texto) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent   = texto;
    el.style.display = 'block';
}

function limpiarErrores(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = ''; el.style.display = 'none'; }
    });
}

function mostrarFeedback(id, texto) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent   = texto;
    el.style.display = 'flex';
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

// ============================================================
//  INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    if (!getToken()) {
        window.location.href = 'login.html';
        return;
    }

    cargarPerfil();

    document.getElementById('form-editar-perfil')
        .addEventListener('submit', guardarPerfil);

    document.getElementById('form-password')
        .addEventListener('submit', cambiarPassword);

    // Cerrar sesión
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
});
