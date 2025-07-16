import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
  Button,
  Flex,
  useDisclosure,
  useOutsideClick,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { useVehiculoStore } from "@/stores/useVehiculoStore";
import NewVehiculoModal from "./NewVehiculoModal";
import { Vehiculo } from "@/types/types";

interface VehicleAutocompleteProps {
  value?: number;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: number } }
  ) => void;
  error?: string;
}

const VehicleAutocomplete: React.FC<VehicleAutocompleteProps> = ({
  value,
  onChange,
  error,
}) => {
  const {
    vehiculos,
    fetchVehiculos,
    loading,
    page,
    totalPages,
    loadingMore,
    addVehiculo,
  } = useVehiculoStore();
  const [input, setInput] = useState("");
  const [showList, setShowList] = useState(false);
  const [selected, setSelected] = useState<number | undefined>(value);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Colores del tema
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const selectedBgColor = useColorModeValue("brand.50", "brand.900");

  useOutsideClick({
    ref: containerRef,
    handler: () => setShowList(false),
  });

  // Debounced search
  useEffect(() => {
    if (input.trim() === "") {
      // No buscar si el input está vacío, pero limpiar los resultados existentes
      useVehiculoStore.setState({ vehiculos: [] });
      return;
    }
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchVehiculos({ search: input, page: 1 });
    }, 350);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [fetchVehiculos, input]);

  // Mantener selección externa
  useEffect(() => {
    setSelected(value);
  }, [value]);

  // Agrupar vehículos por marca, modelo, año
  const grouped = vehiculos.reduce((acc: Record<string, Vehiculo[]>, v) => {
    const key = `${v.marca} ${v.modelo} ${v.año}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  // Infinite scroll
  const listRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    if (!listRef.current || loadingMore || page >= totalPages) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 40) {
      fetchVehiculos({ search: input, page: page + 1, append: true });
    }
  };

  // Selección de vehículo
  const handleSelect = (vehiculoId: number) => {
    setSelected(vehiculoId);
    setShowList(false);
    onChange({ target: { name: "vehiculoId", value: vehiculoId } });
  };

  // Añadir nuevo vehículo y seleccionarlo
  const handleAddVehiculo = async (vehiculo: Omit<Vehiculo, "id">) => {
    const nuevo = await addVehiculo(vehiculo);
    if (nuevo) {
      setShowList(false);
      setInput("");
      fetchVehiculos({ search: "", page: 1 });
      setSelected(nuevo.id);
      onChange({ target: { name: "vehiculoId", value: nuevo.id } });
    }
    onClose();
  };

  return (
    <Box w="full" position="relative" ref={containerRef}>
      <Input
        ref={inputRef}
        placeholder="Buscar vehículo por marca, modelo o año..."
        value={
          selected
            ? vehiculos.find((v) => v.id === selected)?.marca +
              " " +
              vehiculos.find((v) => v.id === selected)?.modelo +
              " " +
              vehiculos.find((v) => v.id === selected)?.año
            : input
        }
        onChange={(e) => {
          setInput(e.target.value);
          setShowList(true);
          setSelected(undefined);
        }}
        onFocus={() => setShowList(true)}
        isInvalid={!!error}
        name="vehiculoId"
        autoComplete="off"
        borderRadius="lg"
        borderColor={borderColor}
        _focus={{
          borderColor: "brand.500",
          boxShadow: "0 0 0 1px rgba(0, 119, 204, 0.3)",
        }}
        _placeholder={{ color: "gray.400" }}
      />
      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error}
        </Text>
      )}
      {showList && (
        <Box
          ref={listRef}
          maxH="280px"
          overflowY="auto"
          borderWidth={1}
          borderRadius="lg"
          bg={bgColor}
          shadow="xl"
          mt={2}
          zIndex={10}
          position="absolute"
          w="full"
          borderColor={borderColor}
          onScroll={handleScroll}
        >
          {loading && (
            <Flex align="center" justify="center" py={4}>
              <Spinner size="sm" color="brand.500" />
              <Text ml={2} color={mutedTextColor} fontSize="sm">
                Buscando vehículos...
              </Text>
            </Flex>
          )}
          {input.trim() === "" && !loading && (
            <VStack py={4} color={mutedTextColor}>
              <Text fontSize="sm">Escribe para buscar un vehículo</Text>
              <Text fontSize="xs">Ej: Toyota, Ford, BMW...</Text>
            </VStack>
          )}
          {input.trim() !== "" &&
            Object.keys(grouped).length === 0 &&
            !loading && (
              <VStack p={4} spacing={3}>
                <Text color={mutedTextColor} fontSize="sm" textAlign="center">
                  No se encontraron vehículos
                </Text>
                <Button
                  colorScheme="brand"
                  size="sm"
                  onClick={onOpen}
                  w="full"
                  borderRadius="lg"
                  _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                  transition="all 0.2s"
                >
                  + Añadir nuevo vehículo
                </Button>
              </VStack>
            )}
          {Object.entries(grouped).map(([key, group], index) => (
            <Box key={key}>
              {index > 0 && <Divider />}
              <Box
                p={3}
                bg="gray.50"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                <Text fontWeight="semibold" fontSize="sm" color={textColor}>
                  {key}
                </Text>
                <Text fontSize="xs" color={mutedTextColor}>
                  {group.length} vehículo{group.length > 1 ? "s" : ""}{" "}
                  disponible{group.length > 1 ? "s" : ""}
                </Text>
              </Box>
              <List>
                {group.map((v) => (
                  <ListItem
                    key={v.id}
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{ bg: hoverBgColor }}
                    bg={selected === v.id ? selectedBgColor : undefined}
                    onClick={() => handleSelect(v.id)}
                    transition="background 0.2s"
                    borderBottom="1px solid"
                    borderColor="gray.100"
                  >
                    <VStack align="flex-start" spacing={1}>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="medium" color={textColor}>
                          {v.marca} {v.modelo}
                        </Text>
                        <HStack spacing={2}>
                          <Badge
                            colorScheme="blue"
                            variant="subtle"
                            borderRadius="full"
                            px={2}
                            py={0.5}
                            fontSize="xs"
                          >
                            {v.año}
                          </Badge>
                          <Badge
                            colorScheme="gray"
                            variant="subtle"
                            borderRadius="full"
                            px={2}
                            py={0.5}
                            fontSize="xs"
                          >
                            {v.numeroPuertas} puertas
                          </Badge>
                        </HStack>
                      </HStack>
                    </VStack>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
          {loadingMore && (
            <Flex align="center" justify="center" py={3}>
              <Spinner size="sm" color="brand.500" />
              <Text ml={2} color={mutedTextColor} fontSize="sm">
                Cargando más...
              </Text>
            </Flex>
          )}
        </Box>
      )}
      <NewVehiculoModal
        isOpen={isOpen}
        onClose={onClose}
        onVehiculoCreado={handleAddVehiculo}
      />
    </Box>
  );
};

export default VehicleAutocomplete;
