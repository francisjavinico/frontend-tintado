import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface EstadisticasDetalladasProps {
  resumen: {
    facturadoMes: number;
    gastosMes: number;
    citasPendientes: number;
    clientesNuevos: number;
    tendencias: {
      facturado: { porcentaje: number; direccion: "up" | "down" };
      gastos: { porcentaje: number; direccion: "up" | "down" };
      clientes: { porcentaje: number; direccion: "up" | "down" };
    };
  };
}

export default function EstadisticasDetalladas({
  resumen,
}: EstadisticasDetalladasProps) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getTrendIcon = (direccion: "up" | "down") => {
    return direccion === "up" ? <FiTrendingUp /> : <FiTrendingDown />;
  };

  const getTrendColor = (direccion: "up" | "down") => {
    return direccion === "up" ? "green.500" : "red.500";
  };

  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="2xl"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      border="1px solid"
      borderColor={borderColor}
    >
      <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
        Resumen Financiero Detallado
      </Text>

      <VStack spacing={4} align="stretch">
        {/* Facturación */}
        <Box>
          <Stat>
            <StatLabel color="gray.600" fontSize="sm">
              Facturación del Mes
            </StatLabel>
            <StatNumber fontSize="2xl" color="blue.600">
              {formatCurrency(resumen.facturadoMes)}
            </StatNumber>
            <StatHelpText>
              <HStack spacing={1}>
                {getTrendIcon(resumen.tendencias.facturado.direccion)}
                <Text
                  color={getTrendColor(resumen.tendencias.facturado.direccion)}
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {formatPercentage(resumen.tendencias.facturado.porcentaje)} vs
                  mes anterior
                </Text>
              </HStack>
            </StatHelpText>
          </Stat>
        </Box>

        <Divider />

        {/* Gastos */}
        <Box>
          <Stat>
            <StatLabel color="gray.600" fontSize="sm">
              Gastos del Mes
            </StatLabel>
            <StatNumber fontSize="2xl" color="orange.600">
              {formatCurrency(resumen.gastosMes)}
            </StatNumber>
            <StatHelpText>
              <HStack spacing={1}>
                {getTrendIcon(resumen.tendencias.gastos.direccion)}
                <Text
                  color={getTrendColor(resumen.tendencias.gastos.direccion)}
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {formatPercentage(resumen.tendencias.gastos.porcentaje)} vs
                  mes anterior
                </Text>
              </HStack>
            </StatHelpText>
          </Stat>
        </Box>

        <Divider />

        {/* Beneficio Neto */}
        <Box>
          <Stat>
            <StatLabel color="gray.600" fontSize="sm">
              Beneficio Neto
            </StatLabel>
            <StatNumber
              fontSize="2xl"
              color={
                resumen.facturadoMes - resumen.gastosMes >= 0
                  ? "green.600"
                  : "red.600"
              }
            >
              {formatCurrency(resumen.facturadoMes - resumen.gastosMes)}
            </StatNumber>
            <StatHelpText color="gray.500" fontSize="sm">
              Facturación - Gastos
            </StatHelpText>
          </Stat>
        </Box>

        <Divider />

        {/* Métricas Adicionales */}
        <HStack spacing={6} justify="space-between">
          <Box flex={1}>
            <Stat>
              <StatLabel color="gray.600" fontSize="sm">
                Citas Pendientes
              </StatLabel>
              <StatNumber fontSize="xl" color="green.600">
                {resumen.citasPendientes}
              </StatNumber>
            </Stat>
          </Box>

          <Box flex={1}>
            <Stat>
              <StatLabel color="gray.600" fontSize="sm">
                Clientes Nuevos
              </StatLabel>
              <StatNumber fontSize="xl" color="purple.600">
                {resumen.clientesNuevos}
              </StatNumber>
              <StatHelpText>
                <HStack spacing={1}>
                  {getTrendIcon(resumen.tendencias.clientes.direccion)}
                  <Text
                    color={getTrendColor(resumen.tendencias.clientes.direccion)}
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {formatPercentage(resumen.tendencias.clientes.porcentaje)}
                  </Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}
