import { useFacturasStore } from "@/stores/useFacturasStore";
import {
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  HStack,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function FiltroFacturas() {
  const { setFiltros } = useFacturasStore();
  const [formState, setFormState] = useState({
    dateFrom: "",
    dateTo: "",
    cliente: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const buscar = () => {
    setFiltros({ ...formState });
  };

  const limpiar = () => {
    setFormState({ dateFrom: "", dateTo: "", cliente: "" });
    setFiltros({});
  };

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      gap={4}
      align={{ base: "stretch", lg: "center" }}
      justify="space-between"
      wrap="wrap"
    >
      {/* Filtros de búsqueda */}
      <HStack spacing={4} flex={1} wrap="wrap" align="center">
        {/* Búsqueda general - Input minimalista */}
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por cliente..."
            value={formState.cliente}
            onChange={(e) => handleChange("cliente", e.target.value)}
            variant="flushed"
            borderBottom="1px solid"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            _hover={{ borderColor: "gray.400" }}
          />
        </InputGroup>

        {/* Filtros de fecha */}
        <HStack spacing={2} align="center">
          <Input
            w="140px"
            type="date"
            value={formState.dateFrom}
            onChange={(e) => handleChange("dateFrom", e.target.value)}
            variant="flushed"
            borderBottom="1px solid"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            _hover={{ borderColor: "gray.400" }}
            fontSize="sm"
          />
          <Input
            w="140px"
            type="date"
            value={formState.dateTo}
            onChange={(e) => handleChange("dateTo", e.target.value)}
            variant="flushed"
            borderBottom="1px solid"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            _hover={{ borderColor: "gray.400" }}
            fontSize="sm"
          />
        </HStack>
      </HStack>

      {/* Resumen minimalista y botones */}
      <Flex flexShrink={0} align="center" justify="flex-end" gap={2}>
        <Button
          onClick={buscar}
          colorScheme="blue"
          size="sm"
          variant="solid"
          px={4}
        >
          Buscar
        </Button>
        <Button
          onClick={limpiar}
          variant="outline"
          colorScheme="gray"
          size="sm"
        >
          Limpiar
        </Button>
      </Flex>
    </Flex>
  );
}
