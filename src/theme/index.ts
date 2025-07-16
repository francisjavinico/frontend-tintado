import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: "#e6f7ff",
    100: "#b3e0ff",
    200: "#80c9ff",
    300: "#4db2ff",
    400: "#1a9bff",
    500: "#0077cc", // Color principal de la marca
    600: "#005fa3",
    700: "#004780",
    800: "#002f5c",
    900: "#001733",
  },
  accent: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Color de acento
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  gray: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
};

const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "semibold",
      borderRadius: "lg",
      _focus: {
        boxShadow: "0 0 0 3px rgba(0, 119, 204, 0.3)",
      },
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: "brand.600",
          transform: "translateY(-1px)",
          boxShadow: "lg",
        },
        _active: {
          bg: "brand.700",
          transform: "translateY(0)",
        },
      },
      outline: {
        borderColor: "brand.500",
        color: "brand.500",
        _hover: {
          bg: "brand.50",
          borderColor: "brand.600",
        },
      },
      ghost: {
        color: "brand.500",
        _hover: {
          bg: "brand.50",
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: "white",
        borderRadius: "xl",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid",
        borderColor: "gray.200",
        _hover: {
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          transform: "translateY(-2px)",
        },
        transition: "all 0.2s ease-in-out",
      },
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: "lg",
        borderColor: "gray.300",
        _focus: {
          borderColor: "brand.500",
          boxShadow: "0 0 0 1px rgba(0, 119, 204, 0.3)",
        },
        _hover: {
          borderColor: "brand.400",
        },
      },
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderRadius: "lg",
        borderColor: "gray.300",
        _focus: {
          borderColor: "brand.500",
          boxShadow: "0 0 0 1px rgba(0, 119, 204, 0.3)",
        },
      },
    },
  },
  Table: {
    baseStyle: {
      table: {
        borderRadius: "lg",
        overflow: "hidden",
      },
      thead: {
        bg: "gray.50",
      },
      th: {
        fontWeight: "semibold",
        color: "gray.700",
        borderBottom: "1px solid",
        borderColor: "gray.200",
      },
      td: {
        borderBottom: "1px solid",
        borderColor: "gray.100",
      },
    },
  },
};

const styles = {
  global: {
    body: {
      bg: "gray.50",
      color: "gray.800",
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
});

export default theme;
