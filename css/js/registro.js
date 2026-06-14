// ============================================================
//  SportClub — registro.js
//  POST http://localhost:3000/api/auth/register
// ============================================================

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {

    const form         = document.getElementById('form-registro');
    const inputNombre  = document.getElementById('nombre');
    const inputEmail   = document.getElementById('email');
    const inputFecha   = document.getElementById('fecha_nacimiento');
    const inputPass    = document.getElementById('password');
    const inputConfirm = document.getElementById('confirm_password');
    const btnSubmit    = document.querySelector('.btn-submit-registro');

    const errNombre  = document.getElementById('err-nombre');
    const errEmail   = document.getElementById('err-email');
    const errPass    = document.getElementById('err-password');
    const errConfirm = document.getElementById('err-confirm');
    const msgError   = document.getElementById('msg-registro-error');
    const msgSuccess = document.getElementById('msg-registro-success');

    // ── Mostrar/ocultar contraseña ──────────────────────────
    configurarTogglePass('toggle-password',        'password');
    configurarTogglePass('toggle-confirm-password', 'confirm_password');

    // ── Validación en tiempo real (mientras escribe) ────────
    if (inputPass) {
        inputPass.addEventListener('input', () => {
            const pass = inputPass.value;
            const indicador = document.getElementById('pass-indicador');
            if (!indicador) return;

            if (pass.length === 0) {
                indicador.textContent = '';
            } else if (pass.length < 8) {
                indicador.textContent = '🔴 Muy corta';
                indicador.style.color = '#f87171';
            } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(pass)) {
                indicador.textContent = '🟡 Agrega letras y números';
                indicador.style.color = '#fbbf24';
            } else {
                indicador.textContent = '🟢 Contraseña segura';
                indicador.style.color = '#34d399';
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar todos los errores
        limpiarErrores([errNombre, errEmail, errPass, errConfirm]);
        mostrarMensaje(msgError,   '', false);
        mostrarMensaje(msgSuccess, '', false);

        // Leer valores
        const nombre   = inputNombre.value.trim();
        const email    = inputEmail.value.trim();
        const fecha    = inputFecha  ? inputFecha.value  : '';
        const password = inputPass.value.trim();
        const confirm  = inputConfirm.value.trim();

        // Validar
        const hayErrores = validarRegistro(
            nombre, email, password, confirm,
            errNombre, errEmail, errPass, errConfirm
        );
        if (hayErrores) return;

        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Registrando...';

        // Armar payload según lo que pide el backend
        const payload = {
            full_name:            nombre,
            email:                email,
            password:             password,
            role:                 'user',
            must_change_password: false,
            birth_date:           fecha || null,
            metadata: { sports: [] }
        };

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.ok || response.status === 201) {
                mostrarMensaje(msgSuccess,
                    '✅ ¡Cuenta creada correctamente! Redirigiendo al login...', true);
                form.reset();
                document.getElementById('pass-indicador').textContent = '';
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);

            } else {
                mostrarMensaje(msgError,
                    `❌ ${data.message || 'No se pudo crear la cuenta. Prueba con otro correo.'}`,
                    true);
            }

        } catch (error) {
            mostrarMensaje(msgError,
                '❌ No se pudo conectar con el servidor. Verifica que el backend esté activo.',
                true);
            console.error('Error:', error);

        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Crear mi cuenta →';
        }
    });
});

// ── Valida todos los campos ─────────────────────────────────
function validarRegistro(nombre, email, password, confirm,
                         errNombre, errEmail, errPass, errConfirm) {
    let hayErrores = false;

    if (!nombre) {
        mostrarError(errNombre, '❌ El nombre es obligatorio.');
        hayErrores = true;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        mostrarError(errEmail, '❌ El correo es obligatorio.');
        hayErrores = true;
    } else if (!regexEmail.test(email)) {
        mostrarError(errEmail, '❌ El formato del correo no es válido.');
        hayErrores = true;
    }

    if (!password) {
        mostrarError(errPass, '❌ La contraseña es obligatoria.');
        hayErrores = true;
    } else if (password.length < 8) {
        mostrarError(errPass, '❌ Mínimo 8 caracteres.');
        hayErrores = true;
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
        mostrarError(errPass, '❌ Debe tener letras y números.');
        hayErrores = true;
    }

    if (!confirm) {
        mostrarError(errConfirm, '❌ Debes repetir la contraseña.');
        hayErrores = true;
    } else if (password !== confirm) {
        mostrarError(errConfirm, '❌ Las contraseñas no coinciden.');
        hayErrores = true;
    }

    return hayErrores;
}

function configurarTogglePass(toggleId, inputId) {
    const btn   = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
        const tipo  = input.type === 'password' ? 'text' : 'password';
        input.type  = tipo;
        btn.textContent = tipo === 'password' ? '👁️' : '🙈';
    });
}

function mostrarError(el, texto, inputId = null) {
    if (!el) return;
    el.textContent   = texto;
    el.style.display = 'block';
    // Marcar input con borde rojo
    if (inputId) {
        const input = document.getElementById(inputId);
        if (input) input.classList.add('input-error');
    }
}

function limpiarErrorInput(inputId) {
    const input = document.getElementById(inputId);
    if (input) input.classList.remove('input-error');
}

function limpiarErrores(elementos) {
    elementos.forEach(el => {
        if (!el) return;
        el.textContent   = '';
        el.style.display = 'none';
    });
}

function mostrarMensaje(el, texto, mostrar) {
    if (!el) return;
    el.textContent   = texto;
    el.style.display = mostrar ? 'flex' : 'none';
}
