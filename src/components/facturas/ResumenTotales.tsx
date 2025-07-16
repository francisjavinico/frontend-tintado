import { Box } from "@chakra-ui/react";

interface Props {
  resumen: {
    sumTotal: number;
    sumIva: number;
    sumSub: number;
    count: number;
  };
}

export default function ResumenTotales({ resumen }: Props) {
  return (
    <Box textAlign="right" fontWeight="500" fontSize="md" mt={2}>
      <div>Base imponible: {resumen.sumSub.toFixed(2)} €</div>
      <div>IVA (21%): {resumen.sumIva.toFixed(2)} €</div>
      <div>Total facturado: {resumen.sumTotal.toFixed(2)} €</div>
    </Box>
  );
}
