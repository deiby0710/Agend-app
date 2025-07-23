// Capturamos los valores de la URL
const params = new URLSearchParams(window.location.search);
const nombre = params.get("nombre");
const celular = params.get("celular");
const documento = params.get("cedula");
const tipo = params.get("tipo");
const sede = params.get("sede")?.trim();

document.addEventListener("DOMContentLoaded", () => {
    const btnEnviar = document.getElementById("btnEnviar");
    const fechaSeleccionadaTexto = document.getElementById("fechaSeleccionadaTexto");
    const horariosContainer = document.getElementById("horariosContainer");
    const nombreSpan = document.getElementById("nombre");
    const btnAgendar = document.getElementById("btnAgendar");

    if (nombreSpan) nombreSpan.textContent = nombre;

    const sedeSpan = document.getElementById("sede");
    if (sedeSpan) sedeSpan.textContent = sede;

    let selectedDate = null;
    let selectedHorario = null;

    btnEnviar.addEventListener("click", async (event) => {
        event.preventDefault();

        const today = new Date();
        const firstDay = today.toISOString().split("T")[0];
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

        const { value: date } = await Swal.fire({
            title: "Seleccione una fecha",
            input: "date",
            inputAttributes: { min: firstDay, max: lastDay },
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            heightAuto: false
        });

        if (date) {
            selectedDate = date;

            try {
                const response = await fetch("http://190.147.27.194:5173/api/citas/horariosDisponibles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fecha: date, sede: sede })
                });

                const data = await response.json();
                if (response.ok) {
                    actualizarListaHorarios(data);
                } else {
                    Swal.fire({ title: "Error", text: "No hay horarios disponibles.", icon: "error", heightAuto: false });
                }
            } catch (error) {
                Swal.fire({ title: "Error", text: "Problema con la solicitud.", icon: "error", heightAuto: false });
            }

            fechaSeleccionadaTexto.textContent = `Día para agendar: ${date}`;
            fechaSeleccionadaTexto.style.display = "block";
            document.getElementById("fecha").textContent = selectedDate;
            horariosContainer.style.display = "block";
            btnAgendar.style.display = "block";
        }
    });

    function actualizarListaHorarios(data) {
        const selectHorarios = document.getElementById("selectHorarios");
        selectHorarios.innerHTML = "<option value=''>Seleccione un horario</option>";

        if (!data || !data.horariosDisponibles || data.horariosDisponibles.length === 0) {
            selectHorarios.innerHTML = "<option value=''>No hay horarios disponibles</option>";
            return;
        }

        data.horariosDisponibles.forEach(horario => {
            const option = document.createElement("option");
            option.value = horario;
            option.textContent = horario;
            selectHorarios.appendChild(option);
        });

        selectHorarios.addEventListener("change", () => {
            selectedHorario = selectHorarios.value;
            document.getElementById("hora").textContent = selectedHorario;
        });
    }

    function obtenerNombreCompuesto(nombreCompleto) {
        const partes = nombreCompleto.trim().split(/\s+/);
        const primerNombre = partes[0];
        const primerApellido = partes.length > 2 ? partes[2] : partes[1] || '';
        return `${primerNombre} ${primerApellido}`;
    }

    const sendSMS = async (toNumber, smsContent) => {
        try {
            const response = await fetch("http://190.147.27.194:5173/api/enviar-sms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    numero: toNumber,
                    mensaje: smsContent
                })
            });

            const result = await response.json();
            if (response.ok) {
                console.log("✅ SMS enviado correctamente:", result);
                return result;
            } else {
                console.error("⚠️ Error al enviar SMS:", result);
            }
        } catch (error) {
            console.error("❌ Error de conexión al enviar SMS:", error);
        }
    };

    btnAgendar.addEventListener("click", async () => {
        selectedHorario = document.getElementById("selectHorarios").value;
        medicamentos = document.getElementById("med-pend").value;

        if (!selectedDate || !selectedHorario) {
            Swal.fire({ title: "Error", text: "Debe seleccionar un horario.", icon: "error", heightAuto: false });
            return;
        }

        const result = await Swal.fire({
            title: "¿Deseas agendar esta cita?",
            html: `La cita será el día <b>${selectedDate}</b> a las <b>${selectedHorario}</b>.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, agendar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#0ac150",
            cancelButtonColor: "#dc3545",
            heightAuto: false
        });

        const horario = `${selectedDate} ${selectedHorario}:00`;
        if (result.isConfirmed) {
            let numeroWhatsapp = celular;
            if (!numeroWhatsapp.startsWith("57")) {
                numeroWhatsapp = `57${numeroWhatsapp}`;
            }

            let mensaje = `*Buen Día, ${nombre} farmacia GENHOSPI SAS le notifica que su medicamento pendiente está listo para recoger.*\n\n*Medicamentos a entregar:*\n${medicamentos}\n\n\n 📆Fecha: ${selectedDate}\n ⏰Hora: ${selectedHorario}\n 📌Sede: ${sede}\n\n*Indicaciones para el Retiro del Medicamento:*\n 🕒 Llegue 10 minutos antes de la hora solicitada.\n 🆔 Lleve su documento de identidad.\n 📄 Lleve la formula original con el sello del medicamento pendiente.`;
            window.open(`https://web.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensaje)}`, "_blank");

            // SMS (por backend ahora)
            let numeroSMS = celular.startsWith("+57") ? celular : `+57${celular}`;
            const nombreApellido = obtenerNombreCompuesto(nombre);
            let sms = `Buen día, ${nombreApellido} farmacia GENHOSPI SAS le notifica que su medicamento pendiente: ${medicamentos}, está listo para recoger Fecha: ${selectedDate} Hora: ${selectedHorario} Sede: ${sede}`;
            await sendSMS(numeroSMS, sms);

            try {
                const response = await fetch("http://190.147.27.194:5173/api/citas/agendarCita", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, tipo, documento, horario, celular, sede })
                });

                const data = await response.json();

                if (response.ok) {
                    document.getElementById("fecha").textContent = selectedDate;
                    document.getElementById("hora").textContent = selectedHorario;

                    Swal.fire({ title: "Cita agendada correctamente", icon: "success", heightAuto: false })
                        .then(() => {
                            window.location.href = `primera.html?sede=${sede}`;
                        });
                } else {
                    Swal.fire({ title: "Error", text: data.error || "Hubo un problema.", icon: "error", heightAuto: false });
                }
            } catch (error) {
                Swal.fire({ title: "Error", text: "Hubo un problema con la solicitud.", icon: "error", heightAuto: false });
            }
        }
    });
});
