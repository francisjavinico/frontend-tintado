import React, { useState, useEffect } from "react";
import { forgotPasswordApi } from "../../api/auth";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPasswordApi(email);
      setSuccess(true);
    } catch {
      setError("Error al enviar el correo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW={400}
      mx="auto"
      mt={20}
      p={6}
      boxShadow="lg"
      borderRadius="md"
      bg="white"
    >
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Recuperar contraseña
      </Heading>
      {success ? (
        <Text color="green.500" textAlign="center">
          Si el correo existe, recibirás un enlace para restablecer tu
          contraseña.
          <br />
          Redirigiendo al login...
        </Text>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            {error && <Text color="red.500">{error}</Text>}
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              w="100%"
            >
              Enviar enlace
            </Button>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default ForgotPasswordForm;
