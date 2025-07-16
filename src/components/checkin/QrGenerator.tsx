import { Box, Text, VStack } from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";

interface QrGeneratorProps {
  value: string;
  label?: string;
  size?: number;
}

export default function QrGenerator({
  value,
  label,
  size = 180,
}: QrGeneratorProps) {
  return (
    <VStack spacing={2}>
      {label && <Text fontWeight="semibold">{label}</Text>}
      <Box bg="white" p={4} borderRadius="md" boxShadow="md">
        <QRCodeCanvas value={value} size={size} />
      </Box>
    </VStack>
  );
}
