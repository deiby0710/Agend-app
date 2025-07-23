document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.querySelector("tbody");
    const params = new URLSearchParams(window.location.search);
    const sede = params.get("sede");

    const hoy = new Date();

    //Calcular los últimos 5 días (excluyendo hoy)
    const fechasPendientes = [];
    for (let i = 5; i >= 1; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - i);
        fechasPendientes.push(formatoFecha(fecha));
    }
    fechasPendientes.push(formatoFecha(hoy)); // añadimos hoy al final

    let indiceFecha = 0;

    await cargarSiguienteDia(); // empieza la revisión

    // Función para formatear fechas
    function formatoFecha(fecha) {
        return fecha.toISOString().split("T")[0];
    }

    // Función para cargar citas de la siguiente fecha pendiente
    async function cargarSiguienteDia() {
        if (indiceFecha >= fechasPendientes.length) return;

        const fechaActual = fechasPendientes[indiceFecha];
        const citas = await obtenerCitas(fechaActual, sede);

        if (indiceFecha === fechasPendientes.length - 1) {
            // Día actual: mostrarlo directamente
            await cargarCitas(fechaActual, sede, citas);
            return;
        }

        if (citas.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Citas pendientes',
                text: `Confirma las citas pendientes del día ${fechaActual} antes de continuar.`,
                confirmButtonText: 'Entendido'
            });

            await cargarCitas(fechaActual, sede, citas);
        } else {
            // Si no hay citas, pasar al siguiente día
            indiceFecha++;
            await cargarSiguienteDia();
        }
    }

    // Función para obtener citas
    async function obtenerCitas(fecha, sede) {
        try {
            const response = await fetch("/api/citas/mostrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fecha, sede })
            });

            const result = await response.json();
            return Array.isArray(result.data) ? result.data : [];
        } catch (error) {
            console.error(`❌ Error al obtener citas para ${fecha}:`, error);
            return [];
        }
    }

    // Función para cargar citas en la tabla
    async function cargarCitas(fecha, sede, citas) {
        tbody.innerHTML = "";

        document.getElementById("fechaActual").textContent = `📅 ${fecha} – 🏢 ${sede}`;

        citas.sort((a, b) => new Date(a.horario) - new Date(b.horario));

        citas.forEach(cita => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${cita.idcitas}</td>
                <td>${cita.nombre}</td>
                <td>${cita.tipo}</td>
                <td>${cita.documento}</td>
                <td>${cita.celular}</td>
                <td>${new Date(cita.horario).toTimeString().substring(0, 5)}</td>
                <td><button class="btn-verde" data-id="${cita.idcitas}" data-estado="A"><i class="fa-solid fa-user-check"></i></button></td>
                <td><button class="btn-rojo" data-id="${cita.idcitas}" data-estado="NA"><i class="fa-solid fa-user-xmark"></i></button></td>
                <td><button class="btn-rojo" data-id="${cita.idcitas}" data-estado="C"><i class="fa-solid fa-ban"></i></button></td>
            `;
            tbody.appendChild(fila);
        });

        tbody.onclick = async (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;

            const id = btn.getAttribute("data-id");
            const estado = btn.getAttribute("data-estado");

            try {
                const response = await fetch("/api/citas/cambiarEstado", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, estado })
                });

                const resultado = await response.json();

                if (resultado.message) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Estado actualizado!',
                        text: resultado.message,
                        timer: 1500,
                        showConfirmButton: false
                    });

                    btn.closest("tr").remove();

                    const noHayMasCitas = tbody.querySelectorAll("tr").length === 0;
                    const esUltimoDiaAnterior = indiceFecha === fechasPendientes.length - 2;

                    if (noHayMasCitas) {
                        if (esUltimoDiaAnterior) {
                            await Swal.fire({
                                icon: 'success',
                                title: 'Ya puedes continuar con tu labor del día',
                                text: 'Todas las citas pendientes han sido confirmadas.',
                                confirmButtonText: 'Ver citas de hoy'
                            });
                        }

                        indiceFecha++;
                        await cargarSiguienteDia();
                    }
                }
            } catch (error) {
                console.error("❌ Error al cambiar estado:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cambiar estado',
                    text: 'Verifica la conexión o el servidor.'
                });
            }
        };
    }

    const btnReporte = document.getElementById('btnReporte');
    btnReporte.addEventListener('click',() => {
        console.log('Hola cacorro')
    })

});
