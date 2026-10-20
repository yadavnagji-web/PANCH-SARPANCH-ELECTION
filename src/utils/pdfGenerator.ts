import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a Single A4 Portrait PDF of the Election Pamphlet.
 * Page size: A4 Portrait (210 x 297 mm) with 5mm uniform margin.
 */
export async function downloadA4SinglePamphletPDF(imageDataUrl: string, candidateName: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // A4 size: 210 x 297 mm
  // The locked preview snapshot includes the 5mm internal padding from #main-a4-paper-sheet.
  // Placing at (0, 0, 210, 297) guarantees 100% pixel-perfect WYSIWYG fidelity on paper and PDF!
  doc.addImage(imageDataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

  const cleanName = (candidateName || 'wardpanch').replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_');
  doc.save(`A4-Pemphlet-${cleanName}.pdf`);
}

/**
 * Generates and downloads a Single 5 x 7 inch PDF of the Election Pamphlet.
 */
export async function downloadSinglePamphletPDF(imageDataUrl: string, candidateName: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [127, 177.8],
  });

  const pageWidth = 127;
  const pageHeight = 177.8;
  const margin = 4;
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = pageHeight - margin * 2;

  doc.addImage(imageDataUrl, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');

  const cleanName = (candidateName || 'wardpanch').replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_');
  doc.save(`5x7-Pemphlet-${cleanName}.pdf`);
}

/**
 * Generates and downloads an A4 Landscape PDF with EXACTLY TWO 5x7 inch pamphlets
 * set side by side with a vertical cutting line (✂ ---) in the middle.
 * 
 * Dimensions:
 * A4 Landscape: 297 mm width × 210 mm height
 * Two 5x7 pamphlets: 127 mm width × 177.8 mm height each
 * Left pamphlet: x = 10 mm, y = 16.1 mm
 * Right pamphlet: x = 160 mm, y = 16.1 mm
 * Center cut mark: x = 148.5 mm (exact middle of 297 mm)
 */
export async function downloadA4TwoPamphletsPDF(imageDataUrl: string, candidateName: string) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // 5x7 inch dimensions in mm
  const pamphletWidth = 127; // 5 inches
  const pamphletHeight = 177.8; // 7 inches

  const topMargin = (pageHeight - pamphletHeight) / 2; // ~16.1 mm
  const leftPamphletX = 10; // 10mm margin from left edge
  const rightPamphletX = pageWidth - pamphletWidth - 10; // 160 mm (10mm from right edge)
  const centerCuttingX = pageWidth / 2; // 148.5 mm

  // 1. Add Left Pamphlet (5x7 inch)
  doc.addImage(imageDataUrl, 'PNG', leftPamphletX, topMargin, pamphletWidth, pamphletHeight, undefined, 'FAST');

  // 2. Add Right Pamphlet (5x7 inch)
  doc.addImage(imageDataUrl, 'PNG', rightPamphletX, topMargin, pamphletWidth, pamphletHeight, undefined, 'FAST');

  // 3. Draw Center Cutting Guideline (✂ --- Dotted Line)
  doc.setDrawColor(140, 140, 140);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(centerCuttingX, 6, centerCuttingX, pageHeight - 6);

  // Add Scissor marks (only dashed line and scissors as requested)
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('✂', centerCuttingX, 9, { align: 'center' });
  doc.text('✂', centerCuttingX, pageHeight / 2, { align: 'center' });
  doc.text('✂', centerCuttingX, pageHeight - 8, { align: 'center' });

  const cleanName = (candidateName || 'wardpanch').replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_');
  doc.save(`A4-2-in-1-5x7-Pemphlet-${cleanName}.pdf`);
}

/**
 * Generates and downloads an A4 Landscape PDF with FOUR pamphlets (Voter Slips)
 * in a 2x2 grid with horizontal and vertical cut lines.
 */
export async function downloadA4FourPamphletsPDF(imageDataUrl: string, candidateName: string) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Each slip in 2x2 grid
  const slipWidth = 132;
  const slipHeight = 92;

  const col1X = 10;
  const col2X = 155;
  const row1Y = 8;
  const row2Y = 110;

  // Draw 4 instances
  doc.addImage(imageDataUrl, 'PNG', col1X, row1Y, slipWidth, slipHeight, undefined, 'FAST');
  doc.addImage(imageDataUrl, 'PNG', col2X, row1Y, slipWidth, slipHeight, undefined, 'FAST');
  doc.addImage(imageDataUrl, 'PNG', col1X, row2Y, slipWidth, slipHeight, undefined, 'FAST');
  doc.addImage(imageDataUrl, 'PNG', col2X, row2Y, slipWidth, slipHeight, undefined, 'FAST');

  // Center vertical cutting line
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  doc.setDrawColor(140, 140, 140);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);

  // Vertical line
  doc.line(centerX, 5, centerX, pageHeight - 5);
  // Horizontal line
  doc.line(5, centerY, pageWidth - 5, centerY);

  // Scissors marks
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('✂', centerX, 8, { align: 'center' });
  doc.text('✂', centerX, pageHeight - 6, { align: 'center' });
  doc.text('✂', 8, centerY - 1);
  doc.text('✂', pageWidth - 12, centerY - 1);

  const cleanName = (candidateName || 'wardpanch').replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_');
  doc.save(`A4-4-in-1-Slips-${cleanName}.pdf`);
}
