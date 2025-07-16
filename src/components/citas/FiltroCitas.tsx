import { CitaConRelaciones } from "@/types/types";

export function filtrarCitas(
  citas: CitaConRelaciones[],
  estado: string,
  desde: string,
  hasta: string
) {
  const resultado = citas.filter((cita) => {
    const fechaCita = new Date(cita.fecha);

    const fechaDesdeDate = desde ? new Date(desde) : null;
    const fechaHastaDate = hasta ? new Date(hasta) : null;
    if (fechaHastaDate) {
      fechaHastaDate.setHours(23, 59, 59, 999);
    }

    const cumpleEstado = estado === "todas" || cita.estado === estado;
    const cumpleDesde =
      !fechaDesdeDate || fechaCita.getTime() >= fechaDesdeDate.getTime();
    const cumpleHasta =
      !fechaHastaDate || fechaCita.getTime() <= fechaHastaDate.getTime();

    const cumpleFiltros = cumpleEstado && cumpleDesde && cumpleHasta;

    return cumpleFiltros;
  });

  return resultado;
}
