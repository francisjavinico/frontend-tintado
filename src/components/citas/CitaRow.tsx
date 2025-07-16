import {
  IconButton,
  Td,
  Tooltip,
  Tr,
  Badge,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { CheckIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { FiSmartphone, FiClock } from "react-icons/fi";
import { CitaConRelaciones } from "@/types/types";

interface CitaRowProps {
  cita: CitaConRelaciones;
  onEditar: (cita: CitaConRelaciones) => void;
  onCompletar: (cita: CitaConRelaciones) => void;
  onEliminar: (id: number) => void;
  onQrClick?: (cita: CitaConRelaciones) => void;
  onReprogramar?: (cita: CitaConRelaciones) => void;
}

export default function CitaRow({
  cita,
  onEditar,
  onCompletar,
  onEliminar,
  onQrClick,
  onReprogramar,
}: CitaRowProps) {
  const fechaObj = new Date(cita.fecha);
  const fecha = fechaObj.toLocaleDateString("es-ES");
  const hora = fechaObj.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleEditar = () => {
    onEditar(cita);
  };

  const getEstadoColor = (
    estado: string
  ): "orange" | "green" | "red" | "gray" => {
    switch (estado) {
      case "pendiente":
        return "orange";
      case "completada":
        return "green";
      case "cancelada":
        return "red";
      default:
        return "gray";
    }
  };

  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Tr
      _hover={{ bg: "gray.50" }}
      _dark={{ _hover: { bg: "gray.700" } }}
      transition="background 0.2s ease"
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      <Td py={4} px={4}>
        <Text
          fontWeight="medium"
          color="gray.800"
          _dark={{ color: "gray.200" }}
        >
          {fecha}
        </Text>
      </Td>
      <Td py={4} px={4}>
        <Text
          fontWeight="medium"
          color="gray.800"
          _dark={{ color: "gray.200" }}
        >
          {hora}
        </Text>
      </Td>
      <Td py={4} px={4}>
        <Text
          fontWeight="medium"
          color="gray.800"
          _dark={{ color: "gray.200" }}
        >
          {cita.cliente
            ? `${cita.cliente.nombre} ${cita.cliente.apellido}`
            : "—"}
        </Text>
      </Td>
      <Td py={4} px={4}>
        <Text color="gray.600" _dark={{ color: "gray.400" }}>
          {cita.cliente?.telefono || "—"}
        </Text>
      </Td>
      <Td py={4} px={4}>
        <Text
          fontWeight="medium"
          color="gray.800"
          _dark={{ color: "gray.200" }}
        >
          {cita.vehiculo
            ? `${cita.vehiculo.marca} ${cita.vehiculo.modelo} (${cita.vehiculo.año})`
            : "Pendiente"}
        </Text>
      </Td>
      <Td py={4} px={4}>
        <Badge
          colorScheme={getEstadoColor(cita.estado)}
          variant="subtle"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="full"
          textTransform="capitalize"
        >
          {cita.estado}
        </Badge>
      </Td>
      <Td py={4} px={4} textAlign="center">
        <Tooltip label="Editar" maxW="150px" placement="top">
          <IconButton
            aria-label="Editar"
            icon={<EditIcon />}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            onClick={handleEditar}
            _hover={{ bg: "blue.50", transform: "scale(1.1)" }}
            _dark={{ _hover: { bg: "blue.900" } }}
            transition="all 0.2s ease"
          />
        </Tooltip>
        <Tooltip label="Completar" maxW="150px" placement="top">
          <IconButton
            aria-label="Completar"
            icon={<CheckIcon />}
            size="sm"
            colorScheme="green"
            variant="ghost"
            isDisabled={cita.estado !== "pendiente" || !cita.cliente}
            onClick={() => onCompletar(cita)}
            _hover={{ bg: "green.50", transform: "scale(1.1)" }}
            _dark={{ _hover: { bg: "green.900" } }}
            transition="all 0.2s ease"
          />
        </Tooltip>
        <Tooltip label="Eliminar" maxW="150px" placement="top">
          <IconButton
            aria-label="Eliminar"
            icon={<DeleteIcon />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={() => onEliminar(cita.id)}
            _hover={{ bg: "red.50", transform: "scale(1.1)" }}
            _dark={{ _hover: { bg: "red.900" } }}
            transition="all 0.2s ease"
          />
        </Tooltip>
        {onQrClick && !cita.cliente && (
          <Tooltip label="QR" maxW="150px" placement="top">
            <IconButton
              aria-label="QR"
              icon={<FiSmartphone />}
              size="sm"
              colorScheme="purple"
              variant="ghost"
              onClick={() => onQrClick(cita)}
              _hover={{ bg: "purple.50", transform: "scale(1.1)" }}
              _dark={{ _hover: { bg: "purple.900" } }}
              transition="all 0.2s ease"
            />
          </Tooltip>
        )}
        <Tooltip label="Reprogramar" maxW="150px" placement="top">
          <IconButton
            aria-label="Reprogramar"
            icon={<FiClock />}
            size="sm"
            colorScheme="orange"
            variant="ghost"
            onClick={() => onReprogramar && onReprogramar(cita)}
            _hover={{ bg: "orange.50", transform: "scale(1.1)" }}
            _dark={{ _hover: { bg: "orange.900" } }}
            transition="all 0.2s ease"
          />
        </Tooltip>
      </Td>
    </Tr>
  );
}
