import React from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

interface Props {
  label: string;
  value: string;
  icon?: React.ReactElement;
  trend?: "up" | "down";
  trendValue?: string;
  colorScheme?: "blue" | "green" | "orange" | "purple";
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function CardEstadistica({
  label,
  value,
  icon,
  trend,
  trendValue,
  colorScheme = "blue",
}: Props) {
  const colorSchemes = {
    blue: {
      bg: "linear-gradient(135deg, brand.500 0%, accent.500 100%)",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#0077cc",
      trendColor: "success.500",
    },
    green: {
      bg: "linear-gradient(135deg, success.500 0%, success.400 100%)",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#22c55e",
      trendColor: "success.500",
    },
    orange: {
      bg: "linear-gradient(135deg, warning.500 0%, warning.400 100%)",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#f59e0b",
      trendColor: "error.500",
    },
    purple: {
      bg: "linear-gradient(135deg, purple.500 0%, purple.400 100%)",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#7c3aed",
      trendColor: "success.500",
    },
  };

  const scheme = colorSchemes[colorScheme];

  // Determinar el color de la tendencia basado en la dirección
  const getTrendColor = () => {
    if (!trend) return scheme.trendColor;
    return trend === "up" ? "success.500" : "error.500";
  };

  // Formatear el valor de tendencia
  const formatTrendValue = (value: string) => {
    if (!value) return "";

    // Si ya viene formateado, devolverlo tal como está
    if (value.includes("%")) return value;

    // Si es un número, formatearlo
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const sign = numValue >= 0 ? "+" : "";
      return `${sign}${numValue.toFixed(1)}% vs mes anterior`;
    }

    return value;
  };

  return (
    <Box
      p={6}
      rounded="2xl"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      position="relative"
      overflow="hidden"
      _hover={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transform: "translateY(-2px)",
      }}
      transition="all 0.3s ease"
    >
      <Flex
        justify="space-between"
        align="flex-start"
        position="relative"
        zIndex={2}
      >
        <VStack align="flex-start" spacing={3} flex={1}>
          <Stat>
            <StatLabel
              fontSize="sm"
              fontWeight="medium"
              color="gray.600"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {label}
            </StatLabel>
            <StatNumber
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              color="gray.800"
              lineHeight="1"
            >
              {value}
            </StatNumber>

            {trend && trendValue && (
              <Flex
                align="center"
                gap={2}
                mt={2}
                opacity={0}
                animation={`${fadeInUp} 0.5s ease-out 0.2s forwards`}
              >
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color={getTrendColor()}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <span
                    style={{
                      transform:
                        trend === "up" ? "rotate(0deg)" : "rotate(180deg)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    ↑
                  </span>
                  {formatTrendValue(trendValue)}
                </Text>
              </Flex>
            )}
          </Stat>
        </VStack>

        <Box
          p={4}
          borderRadius="xl"
          bg={scheme.iconBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          minW="56px"
          h="56px"
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
        >
          {icon &&
            React.cloneElement(icon, { size: 28, color: scheme.iconColor })}
        </Box>
      </Flex>

      {/* Subtle background accent */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="120px"
        h="120px"
        bg={scheme.bg}
        borderRadius="50%"
        transform="translate(40px, -40px)"
        opacity={0.05}
        zIndex={1}
      />
    </Box>
  );
}
