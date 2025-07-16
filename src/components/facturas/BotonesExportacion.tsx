import { Button, HStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useFacturasStore } from "@/stores/useFacturasStore";
import { exportToExcel, exportToPDF } from "../utils/exportUtils";

export default function BotonesExportacion() {
  const { facturas } = useFacturasStore();
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  const handleExportPDF = async () => {
    try {
      setExporting(true);

      const columns = ["Fecha", "Cliente", "Subtotal", "IVA", "Total"];
      const rows = facturas.map((f) => [
        new Date(f.fecha).toLocaleDateString(),
        f.cliente?.nombre ?? "—",
        f.subtotal.toFixed(2),
        f.iva.toFixed(2),
        f.total.toFixed(2),
      ]);

      await exportToPDF(columns, rows, "Facturas");
      toast({
        title: "PDF generado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error al exportar a PDF",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      await exportToExcel(facturas, "Facturas");
      toast({
        title: "Excel generado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error al exportar a Excel",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <HStack spacing={3}>
      <Button
        size="sm"
        colorScheme="blue"
        variant="ghost"
        onClick={handleExportPDF}
        isLoading={exporting}
        loadingText="Generando PDF..."
        px={4}
        fontSize="sm"
        fontWeight="500"
      >
        Exportar PDF
      </Button>
      <Button
        size="sm"
        colorScheme="green"
        variant="ghost"
        onClick={handleExportExcel}
        isLoading={exporting}
        loadingText="Generando Excel..."
        px={4}
        fontSize="sm"
        fontWeight="500"
      >
        Exportar Excel
      </Button>
    </HStack>
  );
}
