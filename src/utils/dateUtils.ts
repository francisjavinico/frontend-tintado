export function parseFecha(fecha: string): string | undefined {
  if (!fecha) return undefined;

  const partes = fecha.split("/");
  if (partes.length !== 3) return undefined;

  const [dia, mes, anio] = partes;
  const iso = new Date(`${anio}-${mes}-${dia}T00:00:00`).toISOString();

  return iso;
}
