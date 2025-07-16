import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useTransaccionesStore } from "@/stores/useTransaccionesStore";

export default function FiltroTablaTransacciones() {
  const { filtrosTabla, setFiltrosTabla, fetchUltimasTransacciones } =
    useTransaccionesStore();

  const handleChange = (field: string, value: string) => {
    setFiltrosTabla({ ...filtrosTabla, [field]: value });
  };

  const limpiar = () => {
    setFiltrosTabla({});
    fetchUltimasTransacciones();
  };

  const fetchConLog = () => {
    fetchUltimasTransacciones();
  };

  return (
    <Flex direction="row" flexWrap="wrap" align="flex-end" gap={4} mb={4}>
      <FormControl width="200px">
        <FormLabel fontSize="sm">Desde</FormLabel>
        <Input
          type="date"
          value={filtrosTabla.dateFrom || ""}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
        />
      </FormControl>

      <FormControl width="200px">
        <FormLabel fontSize="sm">Hasta</FormLabel>
        <Input
          type="date"
          value={filtrosTabla.dateTo || ""}
          onChange={(e) => handleChange("dateTo", e.target.value)}
        />
      </FormControl>

      <Button colorScheme="blue" onClick={fetchConLog}>
        Buscar
      </Button>

      <Button onClick={limpiar} colorScheme="gray">
        Limpiar
      </Button>
    </Flex>
  );
}
