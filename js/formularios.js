document.addEventListener('DOMContentLoaded', () => {
    
    
    // ========================================================================
    //                          LÓGICA DE REGISTRO
    // ========================================================================
    const regexEmail = /^[\w.-]{3,50}@[a-zA-Z0-9.-]+\.(com|org|net)$/;
    const regexContraseña = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!%$@._-]).{8,12}$/;
    const formRegistro = document.getElementById('form-registro');
    let inputEmailRegistro = document.getElementById('email-registro');
    let inputContraseñaRegistro = document.getElementById('contraseña-registro');
    const inputCheckRegistro = document.getElementById('check');
    const botonSubmitRegistro = document.querySelector('.submit-registro');

    if (formRegistro && inputEmailRegistro && inputContraseñaRegistro && inputCheckRegistro && botonSubmitRegistro) {
        botonSubmitRegistro.disabled = true;

        const verificarValidacionesRegistro = () => {
            let emailOk = regexEmail.test(inputEmailRegistro.value.trim());
            let passwordOk = regexContraseña.test(inputContraseñaRegistro.value.trim());
            let checkOk = inputCheckRegistro.checked;

            if (emailOk && passwordOk && checkOk) {
                botonSubmitRegistro.disabled = false;
                botonSubmitRegistro.style.opacity = "1";
                botonSubmitRegistro.style.cursor = "pointer";
            } else {
                botonSubmitRegistro.disabled = true;
                botonSubmitRegistro.style.opacity = "0.5";
                botonSubmitRegistro.style.cursor = "not-allowed";
            }
        };

        inputEmailRegistro.addEventListener('input', verificarValidacionesRegistro);
        inputContraseñaRegistro.addEventListener('input', verificarValidacionesRegistro);
        inputCheckRegistro.addEventListener('change', verificarValidacionesRegistro);

        verificarValidacionesRegistro();

        botonSubmitRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            const currentEmail = inputEmailRegistro.value.trim();
            const currentPassword = inputContraseñaRegistro.value.trim();

            if (botonSubmitRegistro.disabled === false) {
                let listaUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
                const usuarioExistente = listaUsuarios.find(user => user.email === currentEmail);

                if (usuarioExistente) {
                    alert("Este email ya está registrado. Por favor usa otro o inicia sesión.");
                    return;
                }

                const nuevoUsuario = { email: currentEmail, password: currentPassword };
                listaUsuarios.push(nuevoUsuario);
                localStorage.setItem('usuariosRegistrados', JSON.stringify(listaUsuarios));

                alert("¡Registro exitoso! Ahora inicia sesión con tu nueva cuenta.");
                window.location.href = 'login.html';
            } else {
                alert("Por favor, completa correctamente todos los campos.");
            }
        });
    }

    // ========================================================================
    //                           LÓGICA DE LOGIN
    // ========================================================================
    const formLogin = document.getElementById('form-login');
    const inputEmailLogin = document.getElementById('email-login');
    const inputContraseñaLogin = document.getElementById('contraseña-login');
    const submitLogin = document.querySelector('.submit-login');

    if (formLogin && inputEmailLogin && inputContraseñaLogin && submitLogin) {
        submitLogin.disabled = true;
        submitLogin.style.opacity = "0.5";
        submitLogin.style.cursor = "not-allowed";

        const actualizarEstadoBotonLogin = () => {
            const emailActual = inputEmailLogin.value.trim();
            const contraseñaActual = inputContraseñaLogin.value.trim();
            const isPasswordValid = regexContraseña.test(contraseñaActual);
            const isEmailNotEmpty = emailActual !== "";

            if (isEmailNotEmpty && isPasswordValid) {
                submitLogin.disabled = false;
                submitLogin.style.opacity = "1";
                submitLogin.style.cursor = "pointer";
            } else {
                submitLogin.disabled = true;
                submitLogin.style.opacity = "0.5";
                submitLogin.style.cursor = "not-allowed";
            }
        };

        inputEmailLogin.addEventListener('input', actualizarEstadoBotonLogin);
        inputContraseñaLogin.addEventListener('input', actualizarEstadoBotonLogin);
        actualizarEstadoBotonLogin();

        submitLogin.addEventListener('click', (e) => {
            e.preventDefault();
            const emailIngresado = inputEmailLogin.value.trim();
            const passwordIngresado = inputContraseñaLogin.value.trim();
            const listaUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

            const usuarioValido = listaUsuarios.find(user =>
                user.email === emailIngresado && user.password === passwordIngresado
            );

            if (usuarioValido) {
                console.log("Inicio de sesión exitoso!");
                localStorage.setItem('sesionActiva', 'true');
                localStorage.setItem('usuarioActivoEmail', usuarioValido.email);
                alert("¡Bienvenido!");
                window.location.href = '../index.html';
            } else {
                alert("Error: Email o contraseña incorrectos, o usuario no registrado.");
            }
        });
    }

    // ========================================================================
    //                   LÓGICA DEL FORMULARIO DE SESIÓN (Logout)
    // ========================================================================
    const inputEmailPrincipal = document.getElementById('email');
    const btnSesion = document.getElementById('boton-sesion');
    const isSessionActive = localStorage.getItem('sesionActiva') === 'true';
    const activeUserEmail = localStorage.getItem('usuarioActivoEmail');

    if (inputEmailPrincipal) {
        if (isSessionActive && activeUserEmail) {
            inputEmailPrincipal.value = activeUserEmail;
        } else {
            inputEmailPrincipal.value = "";
        }
    }

    if (btnSesion) {
        if (isSessionActive) {
            btnSesion.textContent = 'Cerrar Sesión';
            btnSesion.classList.add('btn-logout');
            btnSesion.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('sesionActiva');
                localStorage.removeItem('usuarioActivoEmail');
                window.location.href = 'login.html';
            });
        } else {
            btnSesion.textContent = 'Iniciar Sesión';
            btnSesion.classList.add('btn-login');
            btnSesion.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'login.html';
            });
        }
    }

    // ========================================================================
    //                     LÓGICA DE RECUPERAR CONTRASEÑA
    // ========================================================================
    const contenedorRecuperar = document.querySelector('.main-recuperar');

    if (contenedorRecuperar) {
        const inputEmailRecuperar = document.getElementById('email');
        const inputCheckRecuperar = document.getElementById('check');
        const btnSubmitRecuperar = contenedorRecuperar.querySelector('button.submit');

        if (inputEmailRecuperar && inputCheckRecuperar && btnSubmitRecuperar) {
            btnSubmitRecuperar.disabled = true;
            btnSubmitRecuperar.style.opacity = "0.5";
            btnSubmitRecuperar.style.cursor = "not-allowed";

            const validarFormularioRecupero = () => {
                const emailOk = regexEmail.test(inputEmailRecuperar.value.trim());
                const checkOk = inputCheckRecuperar.checked;

                if (emailOk && checkOk) {
                    btnSubmitRecuperar.disabled = false;
                    btnSubmitRecuperar.style.opacity = "1";
                    btnSubmitRecuperar.style.cursor = "pointer";
                } else {
                    btnSubmitRecuperar.disabled = true;
                    btnSubmitRecuperar.style.opacity = "0.5";
                    btnSubmitRecuperar.style.cursor = "not-allowed";
                }
            };

            inputEmailRecuperar.addEventListener('input', validarFormularioRecupero);
            inputCheckRecuperar.addEventListener('change', validarFormularioRecupero);

            btnSubmitRecuperar.addEventListener('click', (e) => {
                e.preventDefault();
                if (!btnSubmitRecuperar.disabled) {
                    const emailIngresado = inputEmailRecuperar.value.trim();
                    const listaUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
                    const usuarioExiste = listaUsuarios.find(user => user.email === emailIngresado);

                    if (usuarioExiste) {
                        alert(`Se han enviado las instrucciones de recuperación a: ${emailIngresado}`);
                        window.location.href = 'login.html';
                    } else {
                        alert("Error: Este correo no se encuentra registrado en nuestra base de datos.");
                    }
                }
            });
        }
    }

    // ========================================================================
    //                      LÓGICA DE DATOS PERSONALES
    // ========================================================================
    const formDatosPersonales = document.querySelector('.form-datos-personales');

    if (formDatosPersonales) {
        const inputNombre = document.getElementById('nombre');
        const inputApellido = document.getElementById('apellido');
        const inputDireccion = document.getElementById('direccion');
        const inputFecha = document.getElementById('fecha-nacimiento');
        const inputTelefono = document.getElementById('telefono');
        const inputEmailSec = document.getElementById('email-secundario');
        const btnGuardar = document.querySelector('.boton-guardar');
        const nombreCuenta = document.querySelector('#nombre-cuenta');

        const storageKey = activeUserEmail ? `perfil_${activeUserEmail}` : null;

        const limpiarCampos = () => {
            inputNombre.value = "";
            inputApellido.value = "";
            inputDireccion.value = "";
            inputFecha.value = "";
            inputTelefono.value = "";
            inputEmailSec.value = "";
            if (nombreCuenta) nombreCuenta.textContent = "Cuenta";
        };

        if (isSessionActive && storageKey) {
            const datosGuardados = localStorage.getItem(storageKey);
            if (datosGuardados) {
                const perfil = JSON.parse(datosGuardados);
                inputNombre.value = perfil.nombre || "";
                inputApellido.value = perfil.apellido || "";
                inputDireccion.value = perfil.direccion || "";
                inputFecha.value = perfil.fecha || "";
                inputTelefono.value = perfil.telefono || "";
                inputEmailSec.value = perfil.emailSec || "";
                if (nombreCuenta && perfil.nombre) {
                    nombreCuenta.textContent = `${perfil.nombre} ${perfil.apellido}`;
                }
            } else {
                limpiarCampos();
            }
        } else {
            limpiarCampos();
        }

        const regexNombreApellido = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]{3,50}$/;
        const regexTelefono = /^[0-9+\-() ]{7,15}$/;

        const esMayorDe16 = (fechaString) => {
            if (!fechaString) return false;
            const fechaNac = new Date(fechaString);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
            return edad >= 16;
        };

        const validarFormularioDatos = () => {
            if (!isSessionActive) {
                btnGuardar.disabled = true;
                return;
            }

            const emailActual = localStorage.getItem('usuarioActivoEmail');
            const emailSecundarioInput = inputEmailSec.value.trim();
            const nombreOk = regexNombreApellido.test(inputNombre.value.trim());
            const apellidoOk = regexNombreApellido.test(inputApellido.value.trim());
            const direccionOk = inputDireccion.value.trim() !== "";
            const fechaOk = esMayorDe16(inputFecha.value);
            const telefonoOk = regexTelefono.test(inputTelefono.value.trim());
            const emailSecFormatoOk = regexEmail.test(emailSecundarioInput);
            const emailSecDiferenteOk = emailSecundarioInput !== emailActual;  
            const emailSecOk = emailSecFormatoOk && emailSecDiferenteOk;

            if (nombreOk && apellidoOk && direccionOk && fechaOk && telefonoOk && emailSecOk) {
                btnGuardar.disabled = false;
                btnGuardar.style.opacity = "1";
                btnGuardar.style.cursor = "pointer";
            } else {
                btnGuardar.disabled = true;
                btnGuardar.style.opacity = "0.5";
                btnGuardar.style.cursor = "not-allowed";
            }
        };

        inputNombre.addEventListener('input', validarFormularioDatos);
        inputApellido.addEventListener('input', validarFormularioDatos);
        inputDireccion.addEventListener('input', validarFormularioDatos);
        inputFecha.addEventListener('input', validarFormularioDatos);
        inputFecha.addEventListener('change', validarFormularioDatos);
        inputTelefono.addEventListener('input', validarFormularioDatos);
        inputEmailSec.addEventListener('input', validarFormularioDatos);
        validarFormularioDatos();

        btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();
            if (!btnGuardar.disabled && isSessionActive && storageKey) {
                const perfilUsuario = {
                    nombre: inputNombre.value.trim(),
                    apellido: inputApellido.value.trim(),
                    direccion: inputDireccion.value.trim(),
                    fecha: inputFecha.value,
                    telefono: inputTelefono.value.trim(),
                    emailSec: inputEmailSec.value.trim()
                };
                localStorage.setItem(storageKey, JSON.stringify(perfilUsuario));
                alert("¡Tus datos personales se han guardado exitosamente!");
                if (nombreCuenta) {
                    nombreCuenta.textContent = `${perfilUsuario.nombre} ${perfilUsuario.apellido}`;
                }
            } else if (!isSessionActive) {
                alert("Debes iniciar sesión para guardar datos.");
            }
        });
    }
});