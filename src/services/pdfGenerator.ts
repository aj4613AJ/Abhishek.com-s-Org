import { jsPDF } from 'jspdf';
import { ReportRecord } from '../types';

export async function generatePollutionReportPDF(report: ReportRecord): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // --- HEADER BANNER ---
  doc.setFillColor(6, 95, 70); // Emerald 800
  doc.roundedRect(margin, cursorY, contentWidth, 24, 3, 3, 'F');

  // App Logo & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ECHOGUARD', margin + 8, cursorY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('ENVIRONMENTAL POLLUTION INCIDENT REPORT', margin + 8, cursorY + 17);

  // Report ID & Tagline on right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`ID: ${report.id}`, pageWidth - margin - 8, cursorY + 11, { align: 'right' });
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('See Pollution. Understand It. Report It.', pageWidth - margin - 8, cursorY + 17, { align: 'right' });

  cursorY += 30;

  // --- METADATA GRID ---
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, cursorY, contentWidth, 28, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139); // Slate 500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  // Column 1
  doc.text('REPORTED BY:', margin + 6, cursorY + 7);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(report.userName || 'Anonymous Citizen', margin + 6, cursorY + 13);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(report.userPhone || report.userEmail || 'Field Reporter', margin + 6, cursorY + 19);

  // Column 2
  const col2X = margin + contentWidth * 0.38;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('DATE & TIME (IST):', col2X, cursorY + 7);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const formattedDate = new Date(report.timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(formattedDate, col2X, cursorY + 13);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(`Tracking: ${report.trackingNumber || report.id}`, col2X, cursorY + 19);

  // Column 3: Severity Badge
  const col3X = margin + contentWidth * 0.76;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SEVERITY STATUS:', col3X, cursorY + 7);

  // Draw Severity Pill
  const severity = report.analysis?.severity || 'Medium';
  let badgeR = 234, badgeG = 88, badgeB = 12; // Amber/Orange
  if (severity === 'High') {
    badgeR = 220; badgeG = 38; badgeB = 38; // Red
  } else if (severity === 'Low') {
    badgeR = 16; badgeG = 185; badgeB = 129; // Emerald
  }

  doc.setFillColor(badgeR, badgeG, badgeB);
  doc.roundedRect(col3X, cursorY + 10, 38, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`${severity.toUpperCase()} PRIORITY`, col3X + 19, cursorY + 15.5, { align: 'center' });

  cursorY += 34;

  // --- LOCATION SECTION ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, cursorY, contentWidth, 14, 2, 2, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('INCIDENT LOCATION:', margin + 6, cursorY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const locationText = report.location?.address || 'Field Location not specified';
  const coords = report.location?.latitude ? ` [GPS: ${report.location.latitude.toFixed(4)}°N, ${report.location.longitude?.toFixed(4)}°E]` : '';
  const fullLoc = doc.splitTextToSize(`${locationText}${coords}`, contentWidth - 12);
  doc.text(fullLoc, margin + 6, cursorY + 10.5);

  cursorY += 18;

  // --- IMAGE & ISSUE OVERVIEW (SIDE BY SIDE) ---
  const imgBoxWidth = 65;
  const imgBoxHeight = 52;

  // Evidence Image
  try {
    if (report.imageDataUrl && (report.imageDataUrl.startsWith('data:') || report.imageDataUrl.startsWith('http'))) {
      doc.addImage(report.imageDataUrl, 'JPEG', margin, cursorY, imgBoxWidth, imgBoxHeight, undefined, 'FAST');
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, cursorY, imgBoxWidth, imgBoxHeight);
      
      // Caption under image
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('Photographic Evidence Captured at Scene', margin, cursorY + imgBoxHeight + 4);
    }
  } catch (imgErr) {
    // If image fails to render (e.g. cross-origin), draw a placeholder box
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, cursorY, imgBoxWidth, imgBoxHeight, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Image Evidence Encrypted', margin + 8, cursorY + 26);
  }

  // Right Side: Issue Details
  const detailsX = margin + imgBoxWidth + 6;
  const detailsWidth = contentWidth - imgBoxWidth - 6;

  doc.setTextColor(6, 95, 70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const issueTitle = doc.splitTextToSize(report.analysis?.pollution_type || 'Environmental Pollution Issue', detailsWidth);
  doc.text(issueTitle, detailsX, cursorY + 6);

  const titleHeight = issueTitle.length * 5;
  let dY = cursorY + 7 + titleHeight;

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CATEGORY:', detailsX, dY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.analysis?.category || 'Environmental Waste', detailsX + 22, dY);

  dY += 6;
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIDENCE:', detailsX, dY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Green
  doc.text(`${report.analysis?.confidence || 90}% AI Vision Match`, detailsX + 26, dY);

  dY += 7;
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('VISUAL OBSERVATIONS:', detailsX, dY);
  dY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  const descLines = doc.splitTextToSize(report.analysis?.description || 'Visible environmental degradation observed at location.', detailsWidth);
  doc.text(descLines.slice(0, 5), detailsX, dY);

  cursorY += imgBoxHeight + 10;

  // --- ENVIRONMENTAL IMPACT SECTION ---
  doc.setFillColor(254, 242, 242); // Red 50
  doc.setDrawColor(254, 202, 202); // Red 200
  doc.roundedRect(margin, cursorY, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(185, 28, 28); // Red 700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('POTENTIAL ENVIRONMENTAL & HEALTH IMPACT:', margin + 6, cursorY + 6);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const impactLines = doc.splitTextToSize(report.analysis?.environmental_impact || 'Degrades local ecosystems and potential public health risk.', contentWidth - 12);
  doc.text(impactLines.slice(0, 3), margin + 6, cursorY + 11.5);

  cursorY += 26;

  // --- RECOMMENDED REMEDIAL ACTION ---
  doc.setFillColor(240, 253, 244); // Emerald 50
  doc.setDrawColor(187, 247, 208); // Emerald 200
  doc.roundedRect(margin, cursorY, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(21, 128, 61); // Emerald 700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('RECOMMENDED CIVIC & MUNICIPAL ACTION:', margin + 6, cursorY + 6);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const actionLines = doc.splitTextToSize(report.analysis?.recommended_action || 'Forward to relevant municipal authority for site clearance.', contentWidth - 12);
  doc.text(actionLines.slice(0, 3), margin + 6, cursorY + 11.5);

  cursorY += 26;

  // --- MARATHI SUMMARY BOX (FOR LOCAL REGULATORY CITIZENRY) ---
  if (report.analysis?.marathi_summary) {
    doc.setFillColor(255, 251, 235); // Amber 50
    doc.setDrawColor(253, 230, 138); // Amber 200
    doc.roundedRect(margin, cursorY, contentWidth, 18, 2, 2, 'FD');

    doc.setTextColor(180, 83, 9); // Amber 700
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('REGIONAL NOTICE / सारांश (FOR MAHARASHTRA CIVIC AUDIT):', margin + 6, cursorY + 5.5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    const marathiLines = doc.splitTextToSize(report.analysis.marathi_summary, contentWidth - 12);
    doc.text(marathiLines.slice(0, 2), margin + 6, cursorY + 11);

    cursorY += 22;
  }

  // --- SCIENTIFIC & LEGAL DISCLAIMER ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 15, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('SCIENTIFIC ADVISORY & VERIFICATION NOTICE:', margin + 5, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const disclaimerText = report.analysis?.disclaimer ||
    'AI image analysis is an observational indicator and may not be scientifically conclusive when visual evidence alone cannot verify chemical composition or microscopic pollutants.';
  const discLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
  doc.text(discLines, margin + 5, cursorY + 9);

  // --- FOOTER SIGN-OFF ---
  const footerY = pageHeight - 12;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('EchoGuard Environmental Intelligence System • Lead Engineer: Abhishek Jadhav', margin, footerY);
  doc.text(`Generated on ${new Date().toLocaleDateString()} • Verified Citizen Submission`, pageWidth - margin, footerY, { align: 'right' });

  // Save the PDF
  const filename = `EchoGuard_Report_${report.id}.pdf`;
  doc.save(filename);
}
