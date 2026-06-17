// ============================================================
//  SportClub — registro.js
//  POST http://localhost:3000/api/auth/register
// ============================================================

window.API_URL = window.API_URL || 'http://localhost:3000'; // ver config.js

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

    // ── Limpiar borde rojo apenas el usuario empieza a corregir ─
    [inputNombre, inputEmail, inputFecha, inputPass, inputConfirm].forEach(input => {
        if (input) input.addEventListener('input', () => input.classList.remove('input-error'));
    });

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

// Mapeo error → input. La mayoría sigue el patrón "err-X" -> "X", salvo
// err-confirm cuyo input real es "confirm_password" (no "confirm").
const MAPA_ERROR_INPUT_REGISTRO = {
    'err-confirm': 'confirm_password'
};

function mostrarError(el, texto, inputId = null) {
    if (!el) return;
    el.textContent   = texto;
    el.style.display = 'block';

    // Marcar input con borde rojo (requisito de la pauta). Si no se pasó
    // inputId explícito, lo derivamos del id del propio span de error.
    const idReal = inputId || MAPA_ERROR_INPUT_REGISTRO[el.id] || el.id.replace('err-', '');
    const input  = document.getElementById(idReal);
    if (input) input.classList.add('input-error');
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

        // Quitamos también el borde rojo del input asociado, si existe
        const idReal = MAPA_ERROR_INPUT_REGISTRO[el.id] || el.id.replace('err-', '');
        limpiarErrorInput(idReal);
    });
}

function mostrarMensaje(el, texto, mostrar) {
    if (!el) return;
    el.textContent   = texto;
    el.style.display = mostrar ? 'flex' : 'none';
}
