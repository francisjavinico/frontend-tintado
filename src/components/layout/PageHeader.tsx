import {
  Box,
  Heading,
  Text,
  Flex,
  HStack,
  Icon,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: IconType;
  badge?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  badge,
  actions,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <Box mb={6}>
      {/* Breadcrumbs */}
      {breadcrumbs && <Box mb={3}>{breadcrumbs}</Box>}

      {/* Main Header */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 6 }}
      >
        <VStack align={{ base: "center", md: "flex-start" }} spacing={2}>
          <HStack spacing={3} align="center">
            {icon && <Icon as={icon} fontSize="24px" color="brand.500" />}

            <HStack spacing={3} align="center">
              <Heading
                size="lg"
                color="gray.800"
                _dark={{ color: "gray.100" }}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
              >
                {title}
              </Heading>
              {badge && (
                <Badge
                  colorScheme="accent"
                  variant="solid"
                  fontSize="xs"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontWeight="medium"
                >
                  {badge}
                </Badge>
              )}
            </HStack>
          </HStack>
          {subtitle && (
            <Text
              color="gray.600"
              _dark={{ color: "gray.400" }}
              fontSize={{ base: "md", md: "lg" }}
              textAlign={{ base: "center", md: "left" }}
              maxW="600px"
            >
              {subtitle}
            </Text>
          )}
        </VStack>

        {actions && (
          <HStack
            spacing={3}
            wrap="wrap"
            justify={{ base: "center", md: "flex-end" }}
            w={{ base: "full", md: "auto" }}
          >
            {actions}
          </HStack>
        )}
      </Flex>
    </Box>
  );
}
