import { LoginFieldErrors, loginSchema } from "../schemas/auth";
import { useAuthStore } from "../stores/useAuthStore";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import { hasUsersApi } from "../api/auth";
import CreateFirstUserForm from "../components/auth/CreateFirstUserForm";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setfieldError] = useState<LoginFieldErrors>({});
  const [showForgot, setShowForgot] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const colorBg = useColorModeValue("gray.50", "gray.800");
  const colorBox = useColorModeValue("white", "gray.700");

  useEffect(() => {
    hasUsersApi().then(setHasUsers);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = loginSchema.parse({ email, password });
      await login(parsed);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        setfieldError(errors);
      }
    }
  };

  if (showForgot) {
    return <ForgotPasswordForm />;
  }

  if (showCreate) {
    return (
      <CreateFirstUserForm
        onSuccess={() => {
          setShowCreate(false);
          setHasUsers(true);
        }}
      />
    );
  }

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit}
      minH="100vh"
      align="center"
      justify="center"
      bg={colorBg}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Iniciar sesión</Heading>
        </Stack>
        <Box rounded="lg" bg={colorBox} boxShadow="lg" p={8}>
          <Box display="flex" justifyContent="center" mb={6}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{ maxWidth: 140, height: "auto" }}
            />
          </Box>
          <Stack spacing={4}>
            {hasUsers === false && (
              <Button
                colorScheme="blue"
                w="100%"
                mb={4}
                onClick={() => setShowCreate(true)}
              >
                Crear primer usuario (admin)
              </Button>
            )}
            <FormControl id="email">
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setfieldError((prev) => ({ ...prev, email: undefined }));
                }}
              />
              {fieldError.email && (
                <Text color="red.500" fontSize="sm">
                  {fieldError.email[0]}
                </Text>
              )}
            </FormControl>
            <FormControl id="password">
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setfieldError((prev) => ({ ...prev, password: undefined }));
                }}
              />
              {fieldError.password && (
                <Text color="red.500" fontSize="sm">
                  {fieldError.password[0]}
                </Text>
              )}
            </FormControl>

            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align="start"
                justify="space-between"
              >
                <Checkbox>Recuérdame</Checkbox>
                <Text
                  color="blue.400"
                  cursor="pointer"
                  onClick={() => setShowForgot(true)}
                >
                  ¿Olvidaste tu contraseña?
                </Text>
              </Stack>
              <Button
                type="submit"
                bg="blue.400"
                color="white"
                _hover={{ bg: "blue.500" }}
                isLoading={loading}
                loadingText="Entrando…"
              >
                Entrar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
