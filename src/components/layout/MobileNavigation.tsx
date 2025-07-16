import { Box, Flex, Text, Icon, HStack } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";
import { ReactNode } from "react";
import {
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiTruck,
  FiUser,
  FiUsers,
} from "react-icons/fi";

interface MobileNavItemProps {
  icon: IconType;
  to: string;
  children: ReactNode;
}

const mobileNavItems = [
  { name: "Dashboard", icon: FiGrid, route: "/dashboard" },
  { name: "Citas", icon: FiCalendar, route: "/citas" },
  { name: "Vehículos", icon: FiTruck, route: "/vehiculos" },
  { name: "Clientes", icon: FiUser, route: "/clients" },
  { name: "Facturas", icon: FiFileText, route: "/facturas" },
  { name: "Transacciones", icon: FiDollarSign, route: "/transacciones" },
  { name: "Recibos", icon: FiCreditCard, route: "/recibos" },
  { name: "Usuarios", icon: FiUsers, route: "/users" },
];

const MobileNavItem: React.FC<MobileNavItemProps> = ({
  icon,
  to,
  children,
}) => (
  <NavLink to={to} style={{ textDecoration: "none", width: "100%" }}>
    {({ isActive }) => (
      <Flex
        direction="column"
        align="center"
        justify="center"
        p={3}
        borderRadius="lg"
        bg={isActive ? "brand.500" : "transparent"}
        color={isActive ? "white" : "gray.700"}
        _hover={{
          bg: isActive ? "brand.600" : "gray.100",
        }}
        transition="all 0.2s ease"
        position="relative"
        minH="60px"
        flex={1}
      >
        <Icon
          fontSize="20px"
          as={icon}
          color={isActive ? "white" : "brand.500"}
          mb={1}
        />
        <Text
          fontSize="xs"
          fontWeight={isActive ? "semibold" : "medium"}
          textAlign="center"
          noOfLines={1}
        >
          {children}
        </Text>
      </Flex>
    )}
  </NavLink>
);

interface MobileNavigationProps {
  isVisible?: boolean;
}

export default function MobileNavigation({
  isVisible = false,
}: MobileNavigationProps) {
  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.200"
      boxShadow="lg"
      zIndex={1000}
      display={{ base: "block", md: "none" }}
    >
      <HStack spacing={0} justify="space-around" p={2}>
        {mobileNavItems.map((item) => (
          <MobileNavItem key={item.name} icon={item.icon} to={item.route}>
            {item.name}
          </MobileNavItem>
        ))}
      </HStack>
    </Box>
  );
}
