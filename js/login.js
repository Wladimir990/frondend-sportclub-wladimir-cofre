// ============================================================
//  SportClub — login.js
//  Conecta el formulario de login con el backend
//  POST http://localhost:3000/api/auth/login
// ============================================================

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {

    const form       = document.getElementById('form-login');
    const inputEmail = document.getElementById('email');
    const inputPass  = document.getElementById('password');
    const msgError   = document.getElementById('msg-login-error');
    const msgSuccess = document.getElementById('msg-login-success');
    const btnSubmit  = document.querySelector('.btn-submit-login');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Limpiar mensajes anteriores
        mostrarMensaje(msgError,   '', false);
        mostrarMensaje(msgSuccess, '', false);

        // 2. Leer valores del formulario
        const email    = inputEmail.value.trim();
        const password = inputPass.value.trim();

        // 3. Validar en frontend antes de llamar al backend
        const errorVal = validarLogin(email, password);
        if (errorVal) {
            mostrarMensaje(msgError, errorVal, true);
            return;
        }

        // 4. Deshabilitar botón mientras espera
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Ingresando...';

        // 5. Llamada al backend con fetch
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.ok) {
                // Guardar token y usuario en localStorage
                localStorage.setItem('token',   data.data.token);
                localStorage.setItem('usuario', JSON.stringify(data.data.user));

                mostrarMensaje(msgSuccess, `✅ ¡Bienvenido, ${data.data.user.full_name}!`, true);

                // Redirigir al dashboard según el rol después de 900ms
                setTimeout(() => redirigirSegunRol(data.data.user.role), 900);

            } else {
                mostrarMensaje(msgError, `❌ ${data.message || 'Correo o contraseña incorrectos.'}`, true);
            }

        } catch (error) {
            mostrarMensaje(msgError, '❌ No se pudo conectar con el servidor. Verifica que el backend esté activo.', true);
            console.error('Error de conexión:', error);

        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Ingresar al sistema →';
        }
    });
});

// ── Valida email y contraseña antes de enviar ──────────────
function validarLogin(email, password) {
    if (!email || !password)
        return '❌ Debes completar el correo y la contraseña.';

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email))
        return '❌ El formato del correo no es válido.';

    if (password.length < 6)
        return '❌ La contraseña debe tener al menos 6 caracteres.';

    return null;
}

// ── Muestra u oculta un div de mensaje en pantalla ─────────
function mostrarMensaje(el, texto, mostrar) {
    if (!el) return;
    el.textContent    = texto;
    el.style.display  = mostrar ? 'flex' : 'none';
}

// ── Redirige al dashboard correcto según el rol ─────────────
function redirigirSegunRol(role) {
    const rutas = {
        user:  'dashboard-usuario.html',
        coach: 'dashboard-coach.html',
        admin: 'dashboard-admin.html'
    };
    window.location.href = rutas[role] || 'dashboard-usuario.html';
}
