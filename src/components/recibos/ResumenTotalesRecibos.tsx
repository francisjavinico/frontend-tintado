import { Box } from "@chakra-ui/react";

interface Props {
  resumen: {
    sumTotal: number;
    count: number;
  };
}

export default function ResumenTotalesRecibos({ resumen }: Props) {
  return (
    <Box textAlign="right" fontWeight="500" fontSize="md" mt={2}>
      Total recibido: {resumen.sumTotal.toFixed(2)} €
    </Box>
  );
}
