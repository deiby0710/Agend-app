document.addEventListener("DOMContentLoaded", () => {
    const btnBuscar = document.getElementById("btnEnviar");
    const responseData = document.getElementById("responseData");
    const errorMessage = document.getElementById("errorMessage");
    const btnContinuar = document.getElementById("btnContinuar");
    const btnAgendamiento = document.getElementById("btnAgendamiento");

    if (!btnBuscar) {
        console.error("❌ Error: No se encontró el botón con id 'btnEnviar'");
        return;
    }

    function obtenerParametroURL(nombre) {
        const params = new URLSearchParams(window.location.search);
        return params.get(nombre);
    }

    const sede = obtenerParametroURL("sede");

    // Deshabilitar botón "Continuar" al inicio
    btnContinuar.style.opacity = "0.5";

    btnBuscar.addEventListener("click", async (event) => {
        event.preventDefault(); // Evita recargar la página

        const tipoIdentificacion = document.getElementById("tipoId").value;
        const cedula = document.getElementById("cedula").value;
        const celular = document.getElementById("celular").value;

        // Validación de campos vacíos
        if (!tipoIdentificacion || !cedula || !celular) {
            Swal.fire({
                title: "Error",
                text: "Debes ingresar todos los datos",
                icon: "error",
                heightAuto: false
            });
            return;
        }

        // Validación de longitud exacta del celular
        if (celular.length < 10) {
            Swal.fire({
                title: "Número inválido",
                text: "El número de celular debe tener exactamente 10 dígitos.",
                icon: "warning",
                heightAuto: false
            });
            return;
        }

        console.log("🟢 Enviando datos:", { tipoIdentificacion, cedula });

        try {
            const response = await fetch("http://190.147.27.194:5173/api/pacientes/buscar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tipoIdentificacion, cedula }),
            });

            const data = await response.json();
            console.log("🔵 Respuesta del servidor:", data);

            if (response.ok) {
                responseData.innerHTML = `
                    <p><strong>Nombre del Paciente:</strong><span id="nombrePaciente">${data.nombre}</span></p>
                `;
                responseData.style.display = "block";
                errorMessage.textContent = "";

                btnContinuar.style.display = "block";
                btnContinuar.style.opacity = "1";
                btnContinuar.disabled = false;
            } else {
                responseData.innerHTML = "";
                errorMessage.textContent = data.error;
                Swal.fire({
                    title: "ATENCIÓN NO COINCIDE EL TIPO DE IDENTIFICACIÓN CON EL NÚMERO DE IDENTIFICACIÓN",
                    text: data.error,
                    icon: "warning",
                    heightAuto: false
                });

                btnContinuar.disabled = true;
                btnContinuar.style.opacity = "0.5";
            }
        } catch (error) {
            console.error("❌ Error en la solicitud:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo conectar con el servidor",
                icon: "error",
                heightAuto: false
            });

            btnContinuar.disabled = true;
            btnContinuar.style.opacity = "0.5";
        }
    });

    btnContinuar.addEventListener("click", async () => {
        const tipo = document.getElementById("tipoId").value;
        const cedula = document.getElementById("cedula").value;
        const celular = document.getElementById("celular").value;
        const nombre = document.getElementById("nombrePaciente").innerText;
        const documento = cedula;

        try {
            const response = await fetch("/api/citas/validarCita", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ documento, tipo })
            });

            const respuesta = await response.json();
            console.log("🟣 Respuesta validar cita:", respuesta);

            if (respuesta.tieneCita) {
                const nombreRespuesta = respuesta.cita.nombre;
                const fechaObj = new Date(respuesta.cita.horario);
                const fecha = fechaObj.toLocaleDateString();
                const hora = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const sedebase = respuesta.cita.sede;

                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: `Lo siento, el usuario ${nombreRespuesta} ya tiene una cita para el ${fecha} a las ${hora} en la sede ${sedebase}`,
                    heightAuto: false
                });
            } else {
                if (!btnContinuar.disabled) {
                    window.location.href = `segunda.html?nombre=${nombre}&celular=${celular}&tipo=${tipo}&cedula=${cedula}&sede=${sede}`;
                }
            }
        } catch (error) {
            console.error("Error al validar cita:", error);
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Ocurrió un error al validar la cita.",
                heightAuto: false
            });
        }
    });

    btnAgendamiento.addEventListener("click", function () {
        window.location.href = `tercera.html?sede=${sede}`;
    });

    // Validación del input celular: solo números y máximo 10 dígitos
    document.getElementById("celular").addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ""); // Solo números
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10); // Máximo 10 dígitos
        }
    });
});
