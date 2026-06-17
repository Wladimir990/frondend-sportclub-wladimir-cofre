// ============================================================
//  SportClub — login.js
//  POST http://localhost:3000/api/auth/login
// ============================================================

window.API_URL = window.API_URL || 'http://localhost:3000'; // ver config.js

document.addEventListener('DOMContentLoaded', () => {

    const form       = document.getElementById('form-login');
    const inputEmail = document.getElementById('email');
    const inputPass  = document.getElementById('password');
    const msgError   = document.getElementById('msg-login-error');
    const msgSuccess = document.getElementById('msg-login-success');
    const btnSubmit  = document.querySelector('.btn-submit-login');

    // ── Mostrar/ocultar contraseña ──────────────────────────
    const togglePass = document.getElementById('toggle-password');
    if (togglePass) {
        togglePass.addEventListener('click', () => {
            const tipo = inputPass.type === 'password' ? 'text' : 'password';
            inputPass.type        = tipo;
            togglePass.textContent = tipo === 'password' ? '👁️' : '🙈';
        });
    }

    // Limpiar borde rojo al escribir
    inputEmail.addEventListener('input', () => inputEmail.classList.remove('input-error'));
    inputPass.addEventListener('input',  () => inputPass.classList.remove('input-error'));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        mostrarMensaje(msgError,   '', false);
        mostrarMensaje(msgSuccess, '', false);

        const email    = inputEmail.value.trim();
        const password = inputPass.value.trim();

        // Validar antes de llamar al backend
        const errorVal = validarLogin(email, password);
        if (errorVal) {
            mostrarMensaje(msgError, errorVal, true);
            // Marcar inputs con borde rojo
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                inputEmail.classList.add('input-error');
            }
            if (!password || password.length < 6) {
                inputPass.classList.add('input-error');
            }
            inputEmail.focus();
            return;
        }
        // Limpiar bordes rojos si pasa validación
        inputEmail.classList.remove('input-error');
        inputPass.classList.remove('input-error');

        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Ingresando...';

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.ok) {
                // Guardar sesión en localStorage
                localStorage.setItem('token',   data.data.token);
                localStorage.setItem('usuario', JSON.stringify(data.data.user));

                mostrarMensaje(msgSuccess,
                    `✅ ¡Bienvenido, ${data.data.user.full_name}!`, true);

                setTimeout(() => redirigirSegunRol(data.data.user.role), 900);

            } else {
                mostrarMensaje(msgError,
                    `❌ ${data.message || 'Correo o contraseña incorrectos.'}`, true);
            }

        } catch (error) {
            mostrarMensaje(msgError,
                '❌ No se pudo conectar con el servidor. Verifica que el backend esté activo.',
                true);
            console.error('Error:', error);

        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Ingresar al sistema →';
        }
    });
});

function validarLogin(email, password) {
    if (!email || !password)
        return '❌ Debes completar el correo y la contraseña.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return '❌ El formato del correo no es válido.';
    if (password.length < 6)
        return '❌ La contraseña debe tener al menos 6 caracteres.';
    return null;
}

function mostrarMensaje(el, texto, mostrar) {
    if (!el) return;
    el.textContent   = texto;
    el.style.display = mostrar ? 'flex' : 'none';
}

function redirigirSegunRol(role) {
    const rutas = {
        user:  'dashboard-usuario.html',
        coach: 'dashboard-coach.html',
        admin: 'dashboard-admin.html'
    };
    window.location.href = rutas[role] || 'dashboard-usuario.html';
}
