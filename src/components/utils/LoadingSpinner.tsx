import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function LoadingSpinner({
  message = "Cargando...",
  size = "xl",
}: LoadingSpinnerProps) {
  return (
    <Flex justify="center" align="center" minH="400px" direction="column">
      <VStack spacing={4}>
        <Spinner size={size} color="brand.500" thickness="4px" speed="0.8s" />
        <Text
          color="gray.600"
          fontSize="lg"
          fontWeight="medium"
          textAlign="center"
        >
          {message}
        </Text>
      </VStack>
    </Flex>
  );
}
