import { PamphletData } from '../types.ts';

export const DEFAULT_PAMPHLET_DATA: PamphletData = {
  // Top Header (Gram Panchayat)
  gramPanchayatName: 'ग्राम पंचायत चिखली',
  showGramPanchayatBox: false,
  gramPanchayatFontSize: 38,
  gramPanchayatOffsetX: 0,
  gramPanchayatOffsetY: 0,
  subHeaderBadge: 'वार्ड पंच चुनाव - 2026',
  showSubHeaderBadge: false,
  subHeaderFontSize: 12,
  subHeaderOffsetX: 0,
  subHeaderOffsetY: 0,

  // Ward Text
  wardNumberText: 'वार्ड सं. 12 गुन्दलारा से',
  wardFontSize: 18,
  wardOffsetX: 0,
  wardOffsetY: 0,

  // Party / Affiliation
  partyOrTagline: '',
  partyFontSize: 12,
  partyOffsetX: 0,
  partyOffsetY: 0,

  // Qualities Text
  qualitiesText: 'सरल, सेवाभावी, कर्मठ, ईमानदार प्रत्याशी',
  showQualities: true,
  qualitiesFontSize: 13,
  qualitiesOffsetX: 0,
  qualitiesOffsetY: 0,

  // Candidate Name
  candidateName: 'संगीता / लालशंकर डाबी',
  candidateNameSize: 28,
  candidateNameOffsetX: 0,
  candidateNameOffsetY: 0,

  // Mobile Number
  mobileNumber: 'मो. 7690811153, 9772193791',
  showMobileNumber: true,
  mobileFontSize: 13,
  mobileOffsetX: 0,
  mobileOffsetY: 0,

  // Candidate Photo
  candidatePhotoUrl: '/assets/aistudio/000_341e7eae.jpeg',
  showPhotoBorder: false,
  photoFrameStyle: 'none',
  photoSize: 110,
  photoOffsetX: 0,
  photoOffsetY: 0,

  // Election Symbol
  currentSymbolUrl: null,
  symbolNameText: 'कमल',
  showTopSymbolBox: false,
  topSymbolSize: 68,
  topSymbolOffsetX: 0,
  topSymbolOffsetY: 0,
  tableSymbolSize: 64,
  tableSymbolOffsetX: 0,
  tableSymbolOffsetY: 0,

  // Slogan / Appeal
  appealHeadline: 'को वार्ड पंच हेतु 3 नंबर पर कमल के निशान पर मुहर लगाकर भारी मतों से विजयी बनावें ।',
  showAppealHeadline: true,
  appealFontSize: 16,
  appealOffsetX: 0,
  appealOffsetY: 0,

  // Matpatra / Ballot Table Settings
  totalRows: 5,
  candidateRow: 3,
  candidateRowHeight: 100,
  showStampMark: true,
  stampSize: 52,
  stampOffsetX: 0,
  stampOffsetY: 0,
  showNotaRow: false,
  matpatraHeading: 'पंच निर्वाचन के लिए मतपत्र का नमूना',
  matpatraHeadingFontSize: 14,
  ballotPaperColor: 'white',

  // Nivedak (Optional)
  showNivedak: false,
  nivedakText: 'निवेदक: समस्त ग्रामवासी एवं मित्र मंडल',
  nivedakFontSize: 12,
  nivedakOffsetX: 0,
  nivedakOffsetY: 0,

  // Custom Optional Footer Note
  showCustomFooterNote: false,
  customFooterNote: '',
  customFooterFontSize: 11,

  // Mudrak / Printer (Exact requested: Jalad Printers Chikhali,8696312384)
  showMudrak: true,
  printerText: 'Jalad Printers Chikhali,8696312384',
  printerFontSize: 10,
  printerOffsetX: 0,
  printerOffsetY: 0,

  // Typography & Styling
  fontFamily: 'khand',
  theme: 'classic_black',
};

export const FONT_OPTIONS: { id: PamphletData['fontFamily']; name: string; preview: string }[] = [
  { id: 'khand', name: 'Google Khand (बोल्ड - अनुशंसित)', preview: 'font-khand font-bold' },
  { id: 'yatra', name: 'Yatra One (प्रेस ब्लॉक)', preview: 'font-yatra font-bold' },
  { id: 'noto', name: 'Noto Sans Devanagari', preview: 'font-devanagari font-bold' },
  { id: 'hind', name: 'Hind (संक्षिप्त)', preview: 'font-sans font-bold' },
  { id: 'rozha', name: 'Rozha One (सेरिफ)', preview: 'font-rozha' },
];
