export type FontFamilyStyle = 'khand' | 'yatra' | 'noto' | 'rozha' | 'hind';

export type InkTheme = 'classic_black' | 'press_blue' | 'vermilion_red' | 'panchayat_green';

export interface UploadedSymbol {
  id: string;
  name: string;
  url: string;
  timestamp: number;
}

export interface PamphletData {
  // Top Header (Gram Panchayat)
  gramPanchayatName: string;
  showGramPanchayatBox: boolean;
  gramPanchayatFontSize: number;
  gramPanchayatOffsetX: number;
  gramPanchayatOffsetY: number;
  subHeaderBadge: string;
  showSubHeaderBadge: boolean;
  subHeaderFontSize: number;
  subHeaderOffsetX: number;
  subHeaderOffsetY: number;

  // Ward Text
  wardNumberText: string;
  wardFontSize: number;
  wardOffsetX: number;
  wardOffsetY: number;

  // Party / Affiliation
  partyOrTagline: string;
  partyFontSize: number;
  partyOffsetX: number;
  partyOffsetY: number;

  // Qualities Text
  qualitiesText: string;
  showQualities: boolean;
  qualitiesFontSize: number;
  qualitiesOffsetX: number;
  qualitiesOffsetY: number;

  // Candidate Name & Post / Designation
  candidateName: string;
  candidatePostTitle: string; // e.g. "वार्ड पंच", "सरपंच", "जिला परिषद सदस्य", etc.
  candidateNameSize: number;
  candidateNameOffsetX: number;
  candidateNameOffsetY: number;

  // Mobile Number
  mobileNumber: string;
  showMobileNumber: boolean;
  mobileFontSize: number;
  mobileOffsetX: number;
  mobileOffsetY: number;

  // Candidate Photo
  candidatePhotoUrl: string | null;
  showPhotoBorder: boolean;
  photoFrameStyle: 'none' | 'thin' | 'double' | 'garland';
  photoSize: number;
  photoOffsetX: number;
  photoOffsetY: number;

  // Election Symbol
  currentSymbolUrl: string | null;
  symbolNameText: string;
  showTopSymbolBox: boolean;
  topSymbolSize: number;
  topSymbolOffsetX: number;
  topSymbolOffsetY: number;
  tableSymbolSize: number;
  tableSymbolOffsetX: number;
  tableSymbolOffsetY: number;

  // Slogan / Appeal Text
  appealHeadline: string;
  showAppealHeadline: boolean;
  appealFontSize: number;
  appealOffsetX: number;
  appealOffsetY: number;

  // Matpatra / Ballot Table Settings (Pure Ballot Paper, simple row lines)
  totalRows: number;
  candidateRow: number;
  candidateRowHeight: number;
  showStampMark: boolean;
  stampSize: number;
  stampOffsetX: number;
  stampOffsetY: number;
  showNotaRow: boolean;
  matpatraHeading: string;
  matpatraHeadingFontSize: number;
  ballotPaperColor: 'white' | 'pink' | 'cream';

  // Nivedak (Optional)
  showNivedak: boolean;
  nivedakText: string;
  nivedakFontSize: number;
  nivedakOffsetX: number;
  nivedakOffsetY: number;

  // Custom Optional Footer Note
  showCustomFooterNote: boolean;
  customFooterNote: string;
  customFooterFontSize: number;

  // Mudrak / Printer
  showMudrak: boolean;
  printerText: string; // "Jalad Printers Chikhali,8696312384"
  printerFontSize: number;
  printerOffsetX: number;
  printerOffsetY: number;

  // Typography & Styling
  fontFamily: FontFamilyStyle;
  theme: InkTheme;
}
