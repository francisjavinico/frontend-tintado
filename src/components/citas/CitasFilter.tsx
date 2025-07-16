import {
  Button,
  Flex,
  Select,
  Text,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import FormDateInput from "../form/FormDateInput";
import { FiFilter, FiX } from "react-icons/fi";

interface CitaFiltersProps {
  estado: string;
  onEstadoChange: (valor: string) => void;
  fechaDesde: string;
  onFechaDesdeChange: (valor: string) => void;
  fechaHasta: string;
  onFechaHastaChange: (valor: string) => void;
  onLimpiar: () => void;
  mb?: number | string;
}

export default function CitaFilters({
  estado,
  onEstadoChange,
  fechaDesde,
  onFechaDesdeChange,
  fechaHasta,
  onFechaHastaChange,
  onLimpiar,
  mb = 0,
}: CitaFiltersProps) {
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      justify="space-between"
      align={{ base: "stretch", lg: "center" }}
      gap={4}
      mb={mb}
    >
      {/* Filtros principales */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={4}
        flex={1}
        alignItems="center"
      >
        {/* Filtro de Estado */}
        <Flex align="center" gap={2}>
          <FiFilter size={14} color="#6B7280" />
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="gray.600"
            minW="fit-content"
          >
            Estado
          </Text>
          <Select
            size="sm"
            value={estado}
            onChange={(e) => onEstadoChange(e.target.value)}
            borderColor={borderColor}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
            flex={1}
          >
            <option value="todas">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </Select>
        </Flex>

        {/* Filtro Fecha Desde */}
        <Flex align="center" gap={2}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="gray.600"
            minW="fit-content"
          >
            Desde
          </Text>
          <FormDateInput
            size="sm"
            label=""
            name="fechaDesde"
            type="date"
            value={fechaDesde}
            onChange={(e) => {
              const value =
                typeof e === "object" && "target" in e
                  ? String(e.target.value || "")
                  : "";
              onFechaDesdeChange(value);
            }}
            borderColor={borderColor}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
            flex={1}
          />
        </Flex>

        {/* Filtro Fecha Hasta */}
        <Flex align="center" gap={2}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="gray.600"
            minW="fit-content"
          >
            Hasta
          </Text>
          <FormDateInput
            size="sm"
            label=""
            name="fechaHasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => {
              const value =
                typeof e === "object" && "target" in e
                  ? String(e.target.value || "")
                  : "";
              onFechaHastaChange(value);
            }}
            borderColor={borderColor}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
            flex={1}
          />
        </Flex>

        {/* Botón Limpiar */}
        <Button
          leftIcon={<FiX />}
          onClick={onLimpiar}
          variant="outline"
          colorScheme="gray"
          size="sm"
          _hover={{ bg: "gray.50" }}
          _dark={{ _hover: { bg: "gray.700" } }}
          justifySelf={{ base: "stretch", md: "start" }}
        >
          Limpiar filtros
        </Button>
      </SimpleGrid>
    </Flex>
  );
}
