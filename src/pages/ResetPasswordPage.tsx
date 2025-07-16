import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../api/auth";
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

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Token inválido o faltante.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await resetPasswordApi(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError(
        "No se pudo actualizar la contraseña. El enlace puede estar expirado o ya fue usado."
      );
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
        Restablecer contraseña
      </Heading>
      {success ? (
        <Text color="green.500" textAlign="center">
          Contraseña actualizada correctamente. Redirigiendo al login...
        </Text>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nueva contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Confirmar contraseña</FormLabel>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              Guardar nueva contraseña
            </Button>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default ResetPasswordPage;
