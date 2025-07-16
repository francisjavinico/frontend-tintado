import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToExcel<T>(data: T[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToPDF(
  columns: string[],
  rows: (string | number)[][],
  title: string
) {
  const doc = new jsPDF();
  doc.text(title, 14, 20);
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 30,
  });
  doc.save(`${title}.pdf`);
}
