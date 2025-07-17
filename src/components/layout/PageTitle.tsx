import { Text, Icon, HStack } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { useLocation } from "react-router-dom";
import {
  FiGrid,
  FiCalendar,
  FiTruck,
  FiUser,
  FiFileText,
  FiDollarSign,
  FiCreditCard,
  FiUsers,
  FiPlus,
} from "react-icons/fi";

interface PageTitleProps {
  customTitle?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const getPageInfo = (pathname: string) => {
  const pageMap: Record<string, { title: string; icon: IconType }> = {
    "/dashboard": { title: "Ahumaglass", icon: FiGrid },
    "/users": { title: "Usuarios", icon: FiUsers },
    "/citas": { title: "Citas", icon: FiCalendar },
    "/vehiculos": { title: "Vehículos", icon: FiTruck },
    "/clients": { title: "Clientes", icon: FiUser },
    "/garantias": { title: "Garantías", icon: FiFileText },
    "/facturas": { title: "Facturas", icon: FiFileText },
    "/transacciones": { title: "Transacciones", icon: FiDollarSign },
    "/recibos": { title: "Recibos", icon: FiCreditCard },
    "/citas/nueva": { title: "Nueva Cita", icon: FiPlus },
  };

  return (
    pageMap[pathname] || { title: "Panel de Administración", icon: FiGrid }
  );
};

export default function PageTitle({
  customTitle,
  showIcon = true,
  size = "lg",
}: PageTitleProps) {
  const location = useLocation();
  const { title, icon } = getPageInfo(location.pathname);
  const displayTitle = customTitle || title;

  const sizeConfig = {
    sm: {
      fontSize: { base: "lg", md: "xl" },
      iconSize: "18px",
      spacing: 2,
    },
    md: {
      fontSize: { base: "xl", md: "2xl" },
      iconSize: "20px",
      spacing: 3,
    },
    lg: {
      fontSize: { base: "2xl", md: "3xl" },
      iconSize: "24px",
      spacing: 3,
    },
  };

  const config = sizeConfig[size];

  return (
    <HStack spacing={config.spacing} align="center">
      {showIcon && (
        <Icon as={icon} fontSize={config.iconSize} color="brand.500" />
      )}
      <Text
        as="h1"
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        color="gray.800"
        _dark={{ color: "white" }}
        mb={2}
      >
        {title}
      </Text>
    </HStack>
  );
}
