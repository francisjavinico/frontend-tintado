import { Box } from "@chakra-ui/react";

interface Props {
  total: number;
}

export default function ResumenTotalesTransacciones({ total }: Props) {
  return (
    <Box textAlign="right" fontWeight="500" fontSize="md" mt={2}>
      Total de transacciones: {total.toFixed(2)} €
    </Box>
  );
}
