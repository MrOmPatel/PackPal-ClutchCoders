import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generatePackingListPDF = (data, title) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text(title, 14, 22);

  // Add trip details
  doc.setFontSize(12);
  doc.text(`Trip: ${data.title}`, 14, 32);
  doc.text(`Date: ${data.date}`, 14, 40);
  doc.text(`Location: ${data.location}`, 14, 48);
  doc.text(`Participants: ${data.participants}`, 14, 56);

  // Add packing list table
  const tableColumn = ["Item", "Assigned To", "Status"];
  const tableRows = data.items.map((item) => [
    item.name,
    item.assignedTo,
    item.status,
  ]);

  doc.autoTable({
    startY: 65,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  });

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }

  return doc;
}; 