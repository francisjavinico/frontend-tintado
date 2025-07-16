import { useTransaccionesStore } from "@/stores/useTransaccionesStore";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";

export default function FiltroGraficoTransacciones() {
  const { filtrosGrafico, setFiltrosGrafico } = useTransaccionesStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as "mensual" | "semanal" | "diario";
    setFiltrosGrafico({ tipo });
  };

  return (
    <FormControl maxW="250px">
      <FormLabel fontSize="sm">Resumen por</FormLabel>
      <Select value={filtrosGrafico.tipo} onChange={handleChange}>
        <option value="diario">Hoy</option>
        <option value="semanal">Esta semana</option>
        <option value="mensual">Este mes</option>
      </Select>
    </FormControl>
  );
}
