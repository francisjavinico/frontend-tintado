import logo from "@/assets/logo.png";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  Image,
  VStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import {
  FiCalendar,
  FiChevronDown,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiMenu,
  FiTruck,
  FiUser,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useRef } from "react";
import PageTitle from "./PageTitle";
import Logo from "./Logo";

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  to: string;
  children: ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const ADMIN_LINKS: LinkItemProps[] = [
  { name: "Dashboard", icon: FiGrid, route: "/dashboard" },
  { name: "Citas", icon: FiCalendar, route: "/citas" },
  { name: "Vehículos", icon: FiTruck, route: "/vehiculos" },
  { name: "Clientes", icon: FiUser, route: "/clients" },
  { name: "Facturas", icon: FiFileText, route: "/facturas" },
  { name: "Transacciones", icon: FiDollarSign, route: "/transacciones" },
  { name: "Recibos", icon: FiCreditCard, route: "/recibos" },
  { name: "Usuarios", icon: FiUsers, route: "/users" },
];

const EMPLEADO_LINKS: LinkItemProps[] = [
  { name: "Dashboard", icon: FiGrid, route: "/dashboard" },
  { name: "Citas", icon: FiCalendar, route: "/citas" },
  { name: "Vehículos", icon: FiTruck, route: "/vehiculos" },
  { name: "Clientes", icon: FiUser, route: "/clients" },
];

// NavItem debe ir antes de SidebarContent para evitar errores de referencia
const NavItem: React.FC<NavItemProps> = ({ icon, to, children, ...rest }) => (
  <NavLink to={to} style={{ textDecoration: "none", width: "100%" }}>
    {({ isActive }) => (
      <Flex
        align="center"
        p={3}
        borderRadius="xl"
        role="listitem"
        cursor="pointer"
        bg={isActive ? "brand.500" : "transparent"}
        color={isActive ? "white" : "gray.700"}
        _hover={{
          bg: isActive ? "brand.600" : "gray.100",
          transform: "translateX(4px)",
        }}
        _active={{
          transform: "scale(0.98)",
        }}
        aria-label={typeof children === "string" ? children : undefined}
        tabIndex={0}
        transition="all 0.2s ease"
        position="relative"
        minH="48px"
        {...rest}
      >
        <Icon
          mr={3}
          fontSize="18"
          as={icon}
          aria-hidden
          color={isActive ? "white" : "brand.500"}
          flexShrink={0}
        />
        <Text
          fontWeight={isActive ? "semibold" : "medium"}
          flex={1}
          fontSize="sm"
          noOfLines={1}
        >
          {children}
        </Text>
        {isActive && (
          <Box
            position="absolute"
            left={0}
            top="50%"
            transform="translateY(-50%)"
            w={1}
            h="60%"
            bg="white"
            borderRadius="full"
          />
        )}
      </Flex>
    )}
  </NavLink>
);

function SidebarContent({ onClose, ...rest }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const links = user?.role === "empleado" ? EMPLEADO_LINKS : ADMIN_LINKS;
  return (
    <Flex
      as="nav"
      direction="column"
      aria-label="Navegación principal"
      transition="all 0.3s ease"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={{ base: "full", md: 64 }}
      pos="fixed"
      h="full"
      boxShadow="lg"
      overflow="hidden"
      {...rest}
    >
      {/* Logo Section - Using optimized Logo component */}
      <Logo size="lg" variant="white" showText={true} />

      {/* Navigation Container - Scrollable */}
      <Flex direction="column" flex={1} overflow="hidden" position="relative">
        {/* Navigation Items */}
        <VStack
          spacing={1}
          p={4}
          overflowY="auto"
          flex={1}
          sx={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.300",
              borderRadius: "2px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "gray.400",
            },
          }}
        >
          {links.map((link) => (
            <NavItem key={link.name} icon={link.icon} to={link.route}>
              {link.name}
            </NavItem>
          ))}
        </VStack>
      </Flex>

      {/* Close Button for Mobile */}
      <CloseButton
        display={{ base: "flex", md: "none" }}
        onClick={onClose}
        position="absolute"
        top={4}
        right={4}
        aria-label="Cerrar menú lateral"
        color="white"
        zIndex={2}
        _hover={{ bg: "rgba(255,255,255,0.1)" }}
      />
    </Flex>
  );
}

const MobileNav: React.FC<MobileProps> = ({ onOpen, ...rest }) => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Flex
      position="relative"
      ml={{ base: 0, md: 64 }}
      px={{ base: 4, md: 6 }}
      height="20"
      alignItems="center"
      bg="white"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      justifyContent={{ base: "space-between", md: "flex-end" }}
      boxShadow="sm"
      {...rest}
    >
      <IconButton
        ref={menuButtonRef}
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="Abrir menú lateral"
        icon={<FiMenu />}
        colorScheme="brand"
        borderColor="brand.300"
        _hover={{ bg: "brand.50" }}
        size="sm"
      />

      <Box
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <PageTitle size="md" showIcon={false} />
      </Box>

      <HStack spacing={{ base: "2", md: "4" }}>
        <Image
          src={logo}
          alt="Logo de la empresa"
          height="32px"
          width="32px"
          objectFit="contain"
          display={{ base: "none", md: "block" }}
          fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMDA3N2NjIi8+Cjx0ZXh0IHg9IjE2IiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEw8L3RleHQ+Cjwvc3ZnPgo="
        />
        <Menu>
          <MenuButton
            py={2}
            px={2}
            transition="all 0.3s"
            _focus={{ boxShadow: "none" }}
            aria-label="Abrir menú de usuario"
            borderRadius="lg"
            _hover={{ bg: "gray.100" }}
          >
            <HStack spacing={1}>
              <Icon as={FiUser} color="brand.500" fontSize="16" />
              <Box display={{ base: "none", md: "flex" }}>
                <FiChevronDown fontSize="14" />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList
            bg="white"
            borderColor="gray.200"
            boxShadow="lg"
            borderRadius="lg"
            minW="150px"
          >
            <MenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
              aria-label="Cerrar sesión"
              icon={<FiLogOut />}
              _hover={{ bg: "red.50" }}
              color="red.600"
              fontSize="sm"
            >
              Cerrar Sesión
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

interface SidebarWithHeaderProps {
  children?: ReactNode;
}

const SidebarWithHeader: React.FC<SidebarWithHeaderProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Box minH="100vh" bg="gray.50">
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={menuButtonRef}
        returnFocusOnClose={true}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box
        ml={{ base: 0, md: 64 }}
        p={{ base: 4, md: 6 }}
        minH="calc(100vh - 80px)"
      >
        {children}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
