// ============================================================
//  SportClub — registro.js
//  Conecta el formulario de registro con el backend
//  POST http://localhost:3000/api/auth/register
// ============================================================

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {

    const form          = document.getElementById('form-registro');
    const inputNombre   = document.getElementById('nombre');
    const inputEmail    = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const inputFecha    = document.getElementById('fecha_nacimiento');
    const inputPass     = document.getElementById('password');
    const inputConfirm  = document.getElementById('confirm_password');
    const btnSubmit     = document.querySelector('.btn-submit-registro');

    // Referencias a los divs de mensajes de error por campo
    const errNombre  = document.getElementById('err-nombre');
    const errEmail   = document.getElementById('err-email');
    const errPass    = document.getElementById('err-password');
    const errConfirm = document.getElementById('err-confirm');
    const msgError   = document.getElementById('msg-registro-error');
    const msgSuccess = document.getElementById('msg-registro-success');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Limpiar todos los mensajes
        limpiarErrores([errNombre, errEmail, errPass, errConfirm]);
        mostrarMensaje(msgError,   '', false);
        mostrarMensaje(msgSuccess, '', false);

        // 2. Leer valores
        const nombre   = inputNombre.value.trim();
        const email    = inputEmail.value.trim();
        const telefono = inputTelefono ? inputTelefono.value.trim() : '';
        const fecha    = inputFecha ? inputFecha.value : '';
        const password = inputPass.value.trim();
        const confirm  = inputConfirm.value.trim();

        // 3. Validar todos los campos
        const hayErrores = validarRegistro(
            nombre, email, password, confirm,
            errNombre, errEmail, errPass, errConfirm
        );
        if (hayErrores) return;

        // 4. Deshabilitar botón mientras espera
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Registrando...';

        // 5. Armar el objeto que pide el backend
        const payload = {
            full_name:            nombre,
            email:                email,
            password:             password,
            role:                 'user',
            must_change_password: false,
            birth_date:           fecha || null,
            metadata: {
                sports: []
            }
        };

        // 6. Llamada al backend con fetch
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.ok || response.status === 201) {
                mostrarMensaje(msgSuccess, '✅ ¡Cuenta creada correctamente! Redirigiendo al login...', true);
                form.reset();
                setTimeout(() => { window.location.href = 'login.html'; }, 1800);

            } else {
                mostrarMensaje(msgError, `❌ ${data.message || 'No se pudo crear la cuenta. Intenta con otro correo.'}`, true);
            }

        } catch (error) {
            mostrarMensaje(msgError, '❌ No se pudo conectar con el servidor. Verifica que el backend esté activo.', true);
            console.error('Error de conexión:', error);

        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Crear mi cuenta →';
        }
    });
});

// ── Valida todos los campos del registro ───────────────────
// Devuelve true si HAY errores, false si todo está bien
function validarRegistro(nombre, email, password, confirm,
                         errNombre, errEmail, errPass, errConfirm) {
    let hayErrores = false;

    // Nombre
    if (!nombre) {
        mostrarError(errNombre, '❌ El nombre es obligatorio.');
        hayErrores = true;
    }

    // Email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        mostrarError(errEmail, '❌ El correo es obligatorio.');
        hayErrores = true;
    } else if (!regexEmail.test(email)) {
        mostrarError(errEmail, '❌ El formato del correo no es válido.');
        hayErrores = true;
    }

    // Contraseña: mínimo 8 caracteres y debe tener letras y números
    const regexPass = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!password) {
        mostrarError(errPass, '❌ La contraseña es obligatoria.');
        hayErrores = true;
    } else if (password.length < 8) {
        mostrarError(errPass, '❌ La contraseña debe tener al menos 8 caracteres.');
        hayErrores = true;
    } else if (!regexPass.test(password)) {
        mostrarError(errPass, '❌ La contraseña debe tener letras y números.');
        hayErrores = true;
    }

    // Confirmar contraseña
    if (!confirm) {
        mostrarError(errConfirm, '❌ Debes repetir la contraseña.');
        hayErrores = true;
    } else if (password !== confirm) {
        mostrarError(errConfirm, '❌ Las contraseñas no coinciden.');
        hayErrores = true;
    }

    return hayErrores;
}

// ── Muestra un mensaje de error bajo un campo ───────────────
function mostrarError(el, texto) {
    if (!el) return;
    el.textContent   = texto;
    el.style.display = 'block';
}

// ── Limpia todos los mensajes de error de campo ─────────────
function limpiarErrores(elementos) {
    elementos.forEach(el => {
        if (!el) return;
        el.textContent   = '';
        el.style.display = 'none';
    });
}

// ── Muestra u oculta un div de mensaje general ──────────────
function mostrarMensaje(el, texto, mostrar) {
    if (!el) return;
    el.textContent   = texto;
    el.style.display = mostrar ? 'flex' : 'none';
}
