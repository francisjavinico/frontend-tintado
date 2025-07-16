import { Image, Box, Flex, Text, BoxProps } from "@chakra-ui/react";
import logo from "@/assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "default" | "white" | "colored";
  containerProps?: BoxProps;
}

const sizeConfig = {
  sm: {
    logoSize: { base: "50px", md: "60px" },
    textSize: "xs",
    containerHeight: "100px",
    padding: { px: 3, py: 4 },
  },
  md: {
    logoSize: { base: "70px", md: "80px" },
    textSize: "sm",
    containerHeight: "120px",
    padding: { px: 4, py: 6 },
  },
  lg: {
    logoSize: { base: "120px", md: "140px", lg: "160px" },
    textSize: "md",
    containerHeight: "180px",
    padding: { px: 6, py: 8 },
  },
  xl: {
    logoSize: { base: "160px", md: "180px", lg: "200px" },
    textSize: "lg",
    containerHeight: "220px",
    padding: { px: 8, py: 10 },
  },
};

const variantConfig = {
  default: {
    bg: "transparent",
    textColor: "gray.800",
    logoFilter: "none",
  },
  white: {
    bg: "linear-gradient(135deg, brand.500 0%, accent.500 100%)",
    textColor: "white",
    logoFilter: "none", // Quitar filtro para que el logo se vea siempre
  },
  colored: {
    bg: "white",
    textColor: "brand.500",
    logoFilter: "none",
  },
};

export default function Logo({
  size = "lg",
  showText = true,
  variant = "white",
  containerProps = {},
}: LogoProps) {
  const config = sizeConfig[size];
  const variantStyle = variantConfig[variant];

  return (
    <Box
      flexShrink={0}
      bg={variantStyle.bg}
      position="relative"
      overflow="hidden"
      minH={config.containerHeight}
      {...containerProps}
    >
      {/* Background Pattern for white variant */}
      {variant === "white" && (
        <Box
          position="absolute"
          top="-50%"
          right="-50%"
          w="200%"
          h="200%"
          bg="rgba(255,255,255,0.1)"
          borderRadius="50%"
          transform="rotate(45deg)"
        />
      )}

      <Flex
        direction="column"
        align="center"
        justify="center"
        h="full"
        position="relative"
        zIndex={1}
        {...config.padding}
      >
        <Image
          src={logo}
          alt="Logo de la empresa"
          height={config.logoSize}
          width="auto"
          maxW="160px"
          objectFit="contain"
          transition="transform 0.3s ease"
          _hover={{ transform: "scale(1.05)" }}
          filter={variantStyle.logoFilter}
          mb={showText ? 2 : 0}
          fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMDA3N2NjIi8+Cjx0ZXh0IHg9IjgwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEw8L3RleHQ+Cjwvc3ZnPgo="
        />

        {showText && (
          <Text
            color={variantStyle.textColor}
            fontSize={config.textSize}
            opacity={variant === "white" ? 0.9 : 1}
            textAlign="center"
            fontWeight="medium"
          >
            Gestión Integral
          </Text>
        )}
      </Flex>
    </Box>
  );
}
