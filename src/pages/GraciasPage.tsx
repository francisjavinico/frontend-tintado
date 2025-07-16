import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function GraciasPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 15000); // 15 segundos

    return () => clearTimeout(timeout); // Limpia el timeout si se desmonta antes
  }, [navigate]);

  return (
    <Box
      bg="gray.50"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="2xl"
        maxW="sm"
        w="100%"
        p={8}
        textAlign="center"
      >
        <VStack spacing={6}>
          <Text fontSize="3xl" fontWeight="bold" color="teal.600">
            ¡Gracias por registrarte!
          </Text>
          <Text fontSize="lg" color="gray.600">
            Tus datos han sido recibidos correctamente.
            <br />
            Te atenderemos en breve.
          </Text>

          <Button colorScheme="teal" size="lg" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
