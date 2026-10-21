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
 * Generates and downloads an A4 Landscape PDF with TWO Pamphlets placed side-by-side,
 * each sized EXACTLY Width: 137 mm, Height: 197 mm.
 * 
 * Exact user layout specifications:
 * - Center cutting line at X = 148.5 mm (exact middle of 297 mm A4 Landscape).
 * - Gap between Center Cut Line and Left Pamphlet = 5 mm (Left Pamphlet Right Edge X = 143.5 mm).
 * - Gap between Center Cut Line and Right Pamphlet = 5 mm (Right Pamphlet Left Edge X = 153.5 mm).
 * - Total gap between the two designs = 10 mm.
 * - Left Pamphlet X = 148.5 - 5 - 137 = 6.5 mm.
 * - Right Pamphlet X = 148.5 + 5 = 153.5 mm.
 * - Top & Bottom margin = 6.5 mm ((210 - 197) / 2).
 */
export async function downloadA4TwoPamphletsCustomPDF(imageDataUrl: string, candidateName: string) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Exact user specified dimensions
  const pamphletWidth = 137; // 137 mm
  const pamphletHeight = 197; // 197 mm

  const topMargin = (pageHeight - pamphletHeight) / 2; // 6.5 mm
  const centerCuttingX = pageWidth / 2; // 148.5 mm (exact middle)

  // 5mm gap on each side of the center cut line = 10mm total gap between designs
  const centerGap = 5; // 5 mm gap on each side from cut line
  const leftPamphletX = centerCuttingX - centerGap - pamphletWidth; // 6.5 mm
  const rightPamphletX = centerCuttingX + centerGap; // 153.5 mm

  // 1. Add Left Pamphlet (137 x 197 mm)
  doc.addImage(imageDataUrl, 'PNG', leftPamphletX, topMargin, pamphletWidth, pamphletHeight, undefined, 'FAST');

  // 2. Add Right Pamphlet (137 x 197 mm)
  doc.addImage(imageDataUrl, 'PNG', rightPamphletX, topMargin, pamphletWidth, pamphletHeight, undefined, 'FAST');

  // 3. Draw Center Cutting Guideline (✂ --- Dotted Line)
  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(centerCuttingX, 4, centerCuttingX, pageHeight - 4);

  // Add Scissor marks
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('✂', centerCuttingX, 8, { align: 'center' });
  doc.text('✂', centerCuttingX, pageHeight / 2, { align: 'center' });
  doc.text('✂', centerCuttingX, pageHeight - 6, { align: 'center' });

  const cleanName = (candidateName || 'wardpanch').replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_');
  doc.save(`A4-2in1-137x197mm-${cleanName}.pdf`);
}

/**
 * Generates and downloads an A4 Portrait PDF with FOUR Pamphlets arranged in a 2x2 grid.
 * Each design has an exact 5mm margin around it (10mm total gap between designs both vertically and horizontally).
 * 
 * Dimensions:
 * A4 Portrait: 210 mm width × 297 mm height
 * Grid: 2 columns × 2 rows (cell size: 105 mm × 148.5 mm)
 * Each Pamphlet: 95 mm width × 138.5 mm height
 * Center Vertical Cut Line: X = 105 mm
 * Center Horizontal Cut Line: Y = 148.5 mm
 * 5mm margin on all 4 sides of each pamphlet
 */
export async function downloadA4FourPamphletsPDF(imageDataUrl: string, candidateName: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  const centerVerticalX = pageWidth / 2; // 105 mm
  const centerHorizontalY = pageHeight / 2; // 148.5 mm

  // 5mm margin around each design
  const margin = 5; // 5 mm
  const pamphletWidth = 95; // 105 - (5 + 5)
  const pamphletHeight = 138.5; // 148.5 - (5 + 5)

  const col1X = margin; // 5 mm
  const col2X = centerVerticalX + margin; // 110 mm

  const row1Y = margin; // 5 mm
  const row2Y = centerHorizontalY + margin; // 153.5 mm

  // Add 4 Pamphlet instances
  // Top-Left
  doc.addImage(imageDataUrl, 'PNG', col1X, row1Y, pamphletWidth, pamphletHeight, undefined, 'FAST');
  // Top-Right
  doc.addImage(imageDataUrl, 'PNG', col2X, row1Y, pamphletWidth, pamphletHeight, undefined, 'FAST');
  // Bottom-Left
  doc.addImage(imageDataUrl, 'PNG', col1X, row2Y, pamphletWidth, pamphletHeight, undefined, 'FAST');
  // Bottom-Right
  doc.addImage(imageDataUrl, 'PNG', col2X, row2Y, pamphletWidth, pamphletHeight, undefined, 'FAST');

  // Draw Center Vertical and Horizontal Cutting Guidelines (✂ --- Dotted Lines)
  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);

  // Vertical Cut Line
  doc.line(centerVerticalX, 3, centerVerticalX, pageHeight - 3);
  // Horizontal Cut Line
  doc.line(3, centerHorizontalY, pageWidth - 3, centerHorizontalY);

  // Scissor Marks
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  // Top & Bottom vertical cut scissor icons
  doc.text('✂', centerVerticalX, 7, { align: 'center' });
  doc.text('✂', centerVerticalX, pageHeight - 5, { align: 'center' });

  // Left & Right horizontal cut scissor icons
  doc.text('✂', 6, centerHorizontalY - 1);
  doc.text('✂', pageWidth - 10, centerHorizontalY - 1);

  const cleanName = (candidateName || 'wardpanch').replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_');
  doc.save(`A4-4in1-95x138mm-${cleanName}.pdf`);
}
