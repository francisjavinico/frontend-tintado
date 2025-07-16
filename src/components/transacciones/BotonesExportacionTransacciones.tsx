import { Button, HStack, useToast } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useTransaccionesStore } from "@/stores/useTransaccionesStore";
import { exportToExcel, exportToPDF } from "../utils/exportUtils";
import { format } from "date-fns";

export default function BotonesExportacionTransacciones() {
  const { todas, filtrosTabla } = useTransaccionesStore();
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  // Filtrar transacciones según los filtros actuales
  const transFiltradas = useMemo(() => {
    return todas.filter((t) => {
      const fecha = t.fecha.slice(0, 10);
      return (
        (!filtrosTabla.dateFrom || fecha >= filtrosTabla.dateFrom) &&
        (!filtrosTabla.dateTo || fecha <= filtrosTabla.dateTo)
      );
    });
  }, [todas, filtrosTabla]);

  const totalNeto = useMemo(() => {
    return transFiltradas.reduce(
      (acc, t) => acc + (t.tipo === "ingreso" ? t.monto : -t.monto),
      0
    );
  }, [transFiltradas]);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const columns = ["Fecha", "Tipo", "Descripción", "Monto", "Origen"];
      const rows = transFiltradas.map((t) => [
        format(new Date(t.fecha), "dd/MM/yyyy"),
        t.tipo,
        t.descripcion,
        `${t.monto.toFixed(2)} €`,
        t.origen,
      ]);
      rows.push(["", "", "TOTAL", `${totalNeto.toFixed(2)} €`, ""]);
      await exportToPDF(columns, rows, "Transacciones");
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
      // Solo exportar los campos relevantes
      const data = transFiltradas.map((t) => ({
        Fecha: format(new Date(t.fecha), "dd/MM/yyyy"),
        Tipo: t.tipo,
        Descripción: t.descripcion,
        Monto: t.monto,
        Origen: t.origen,
      }));
      data.push({
        Fecha: "",
        Tipo: "TOTAL" as unknown as import("@/types/types").TipoTransaccion,
        Descripción: "TOTAL",
        Monto: totalNeto,
        Origen: "—" as unknown as import("@/types/types").OrigenTransaccion,
      });
      await exportToExcel(data, "Transacciones");
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
