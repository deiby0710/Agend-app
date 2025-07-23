btnIngresar.addEventListener("click", (event) => {
    event.preventDefault();

    const usuarioRaw = document.getElementById("usuario").value;
    const contraseña = document.getElementById("contraseña").value.trim();

    // Validar campos vacíos
    if (!usuarioRaw || !contraseña) {
        Swal.fire({
            title: "Campos Vacíos",
            text: "Debe ingresar el usuario y la contraseña.",
            icon: "warning",  
            heightAuto: false
        });
        return;
    }

    // Validar formato: solo mayúsculas, permitir un solo espacio en medio, sin espacios al inicio o final
    const regexUsuario = /^[A-Z]+(?: [A-Z]+)?$/;
    if (!regexUsuario.test(usuarioRaw)) {
        Swal.fire({
            title: "Usuario inválido",
            text: "El usuario debe estar en mayúsculas y sin espacios al inicio o final.",
            icon: "error",  
            heightAuto: false
        });
        return;
    }

    const usuario = usuarioRaw.trim(); // solo se usa después de validar el formato

    const regexContraseña = /^[0-9]+$/;
    if (!regexContraseña.test(contraseña)) {
        Swal.fire({
            title: "Contraseña inválida",
            text: "La contraseña debe contener solo números.",
            icon: "error",  
            heightAuto: false
        });
        return;
    }

    // Validar credenciales exactas (3 usuarios permitidos)
    const usuariosValidos = {
        "PALERMO": "150525",
        "FATIMA": "169876",
        "SAN IGNACIO": "137149",
        "IPIALES SANITAS": "936846"
    };

    if (usuariosValidos[usuario] === contraseña) {
        window.location.href = `primera.html?sede=${encodeURIComponent(usuario)}`;
    } else {
        Swal.fire({
            title: "Acceso denegado",
            text: "Usuario o contraseña incorrectos.",
            icon: "error",  
            heightAuto: false
        });
    }
});