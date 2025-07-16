import { clientSchema } from "@/schemas/clientSchema";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const emptyClient = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  documentoIdentidad: "",
  direccion: "",
  consentimientoLOPD: false,
  aceptaPromociones: false, // <-- Nuevo campo
};
export default function CheckinTabletPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState(emptyClient);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchParams] = useSearchParams();
  const telefonoQuery = searchParams.get("telefono");
  const [touched, setTouched] = useState(false);
  const [showLopdError, setShowLopdError] = useState(false);

  useEffect(() => {
    if (telefonoQuery) {
      setFormData((prev) => ({ ...prev, telefono: telefonoQuery }));
    }
  }, [telefonoQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      newErrors[name] = "";
      return Object.fromEntries(
        Object.entries(newErrors).filter((entry) => entry[1] !== undefined)
      ) as Record<string, string>;
    });
  };

  const handleSubmit = async () => {
    setTouched(true);
    setShowLopdError(false);
    if (!formData.consentimientoLOPD) {
      setShowLopdError(true);
      return;
    }
    const parsed = clientSchema.safeParse(formData);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/citas/${id}/checkin`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        if (res.status === 409) {
          const data = await res.json();
          setErrors((prev) => {
            const newErrors = { ...prev };
            if (data.error?.toLowerCase().includes("documento")) {
              newErrors.documentoIdentidad = data.error;
            } else if (data.error?.toLowerCase().includes("email")) {
              newErrors.email = data.error;
            }
            return Object.fromEntries(
              Object.entries(newErrors).filter(
                (entry) => entry[1] !== undefined
              )
            ) as Record<string, string>;
          });
        } else {
          throw new Error("Error");
        }
        return;
      }
      toast({
        title: "Check-in exitoso",
        description: "Gracias por confirmar tus datos.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/gracias");
    } catch {
      toast({
        title: "Error al registrar los datos",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Formulario de Check-in
        </Text>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={touched && !!errors.nombre}>
            <FormLabel fontSize="lg">Nombre</FormLabel>
            <Input
              name="nombre"
              fontSize="lg"
              value={formData.nombre}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.nombre}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={touched && !!errors.apellido}>
            <FormLabel fontSize="lg">Apellido</FormLabel>
            <Input
              name="apellido"
              fontSize="lg"
              value={formData.apellido}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.apellido}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={touched && !!errors.email}>
            <FormLabel fontSize="lg">Email</FormLabel>
            <Input
              name="email"
              fontSize="lg"
              value={formData.email}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isDisabled isInvalid={touched && !!errors.telefono}>
            <FormLabel fontSize="lg">Teléfono</FormLabel>
            <Input
              name="telefono"
              fontSize="lg"
              value={formData.telefono}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.telefono}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={touched && !!errors.documentoIdentidad}>
            <FormLabel fontSize="lg">DNI o NIE</FormLabel>
            <Input
              name="documentoIdentidad"
              fontSize="lg"
              value={formData.documentoIdentidad}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.documentoIdentidad}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={touched && !!errors.direccion}>
            <FormLabel fontSize="lg">Dirección</FormLabel>
            <Input
              name="direccion"
              fontSize="lg"
              value={formData.direccion}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.direccion}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={
              touched && (!!errors.consentimientoLOPD || showLopdError)
            }
            mb={2}
          >
            <Checkbox
              isChecked={formData.consentimientoLOPD}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  consentimientoLOPD: e.target.checked,
                }))
              }
              size="md"
              mb={1}
            >
              Acepto la{" "}
              <Link
                href="/politica-privacidad.pdf"
                target="_blank"
                color="blue.500"
                textDecoration="underline"
              >
                política de privacidad
              </Link>{" "}
              y el tratamiento de mis datos personales
            </Checkbox>
            <Text fontSize="xs" color="gray.500" mb={1}>
              Es necesario aceptar la política de privacidad para poder realizar
              el check-in.
            </Text>
            <FormErrorMessage>
              {errors.consentimientoLOPD ||
                (showLopdError &&
                  "Debes aceptar la política de protección de datos")}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={2}>
            <Checkbox
              name="aceptaPromociones"
              isChecked={formData.aceptaPromociones}
              onChange={handleChange}
              size="md"
              mb={1}
            >
              Acepto recibir comunicaciones comerciales y promociones de la
              empresa
            </Checkbox>
            <Text fontSize="xs" color="gray.500" mb={1}>
              (Opcional)
            </Text>
          </FormControl>

          <Button
            colorScheme="teal"
            size="lg"
            fontSize="xl"
            mt={4}
            onClick={handleSubmit}
            isDisabled={!formData.consentimientoLOPD}
          >
            Confirmar Datos
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
