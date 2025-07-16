import React, { useState } from "react";
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
import { createFirstUserApi } from "../../api/auth";

interface Props {
  onSuccess: () => void;
}

const CreateFirstUserForm: React.FC<Props> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios.");
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
      await createFirstUserApi({ name, email, password });
      setSuccess(true);
      setTimeout(() => onSuccess(), 2000);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: any }).response?.data?.message === "string"
      ) {
        setError(
          (err as { response: { data: { message: string } } }).response.data
            .message
        );
      } else {
        setError("Error al crear el usuario.");
      }
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
        Crear primer usuario (admin)
      </Heading>
      {success ? (
        <Text color="green.500" textAlign="center">
          Usuario creado correctamente. Redirigiendo al login...
        </Text>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Contraseña</FormLabel>
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
              Crear usuario
            </Button>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default CreateFirstUserForm;
