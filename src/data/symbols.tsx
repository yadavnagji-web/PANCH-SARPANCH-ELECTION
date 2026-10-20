import React from 'react';

export interface SymbolDef {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  category: 'sarpanch40' | 'wardpanch' | 'party' | 'all';
  render: (color?: string) => React.ReactNode;
}

export const ELECTION_SYMBOLS: SymbolDef[] = [
  // --- राजस्थान पंचायत व सरपंच के 40 आधिकारिक चुनाव चिन्ह ---
  {
    id: 'sofa',
    nameHindi: 'सोफा (Sofa)',
    nameEnglish: 'Sofa',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Sofa Backrest */}
        <path d="M18 36 C18 28 82 28 82 36 V62 H18 Z" />
        {/* Armrests */}
        <rect x="12" y="44" width="14" height="24" rx="4" fill="none" strokeWidth="3" />
        <rect x="74" y="44" width="14" height="24" rx="4" fill="none" strokeWidth="3" />
        {/* Cushion line */}
        <line x1="26" y1="56" x2="74" y2="56" strokeWidth="2.5" />
        {/* Legs */}
        <line x1="16" y1="68" x2="16" y2="78" strokeWidth="4" />
        <line x1="84" y1="68" x2="84" y2="78" strokeWidth="4" />
        <line x1="32" y1="68" x2="32" y2="76" strokeWidth="3.5" />
        <line x1="68" y1="68" x2="68" y2="76" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    id: 'pressure_cooker',
    nameHindi: 'प्रैशर कुकर (Cooker)',
    nameEnglish: 'Pressure Cooker',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Cooker Body */}
        <path d="M22 46 C22 46 22 78 30 82 C38 86 62 86 70 82 C78 78 78 46 78 46 Z" />
        {/* Lid */}
        <path d="M20 46 Q50 38 80 46" strokeWidth="3.5" />
        {/* Weight / Whistle */}
        <rect x="46" y="24" width="8" height="14" rx="2" fill={c} />
        <line x1="50" y1="38" x2="50" y2="42" strokeWidth="3" />
        {/* Handle */}
        <path d="M78 46 H94" strokeWidth="5" />
        <rect x="86" y="42" width="8" height="8" rx="2" fill={c} />
      </svg>
    ),
  },
  {
    id: 'watermelon',
    nameHindi: 'तरबूज (Watermelon)',
    nameEnglish: 'Watermelon',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Watermelon slice */}
        <path d="M14 42 Q50 92 86 42 Z" strokeWidth="3.5" />
        <path d="M20 44 Q50 84 80 44" strokeWidth="2" strokeDasharray="3 3" />
        {/* Seeds */}
        <circle cx="36" cy="52" r="2.5" fill={c} />
        <circle cx="50" cy="62" r="2.5" fill={c} />
        <circle cx="64" cy="52" r="2.5" fill={c} />
        <circle cx="50" cy="48" r="2" fill={c} />
        <circle cx="42" cy="66" r="2" fill={c} />
        <circle cx="58" cy="66" r="2" fill={c} />
      </svg>
    ),
  },
  {
    id: 'kettle',
    nameHindi: 'केतली (Kettle)',
    nameEnglish: 'Kettle',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Kettle body */}
        <ellipse cx="48" cy="62" rx="28" ry="20" strokeWidth="3.5" />
        {/* Lid */}
        <ellipse cx="48" cy="42" rx="14" ry="4" />
        <circle cx="48" cy="36" r="3" fill={c} />
        {/* Spout */}
        <path d="M22 60 L12 40 L16 38 L28 54" strokeWidth="3" />
        {/* Handle */}
        <path d="M48 38 C48 16 82 16 82 46 C82 58 76 64 76 64" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    id: 'clothes_iron',
    nameHindi: 'प्रेस / इस्त्री (Iron)',
    nameEnglish: 'Clothes Iron',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Base plate */}
        <path d="M16 72 H82 L70 48 H24 C18 56 16 66 16 72 Z" strokeWidth="3.5" />
        <line x1="14" y1="74" x2="84" y2="74" strokeWidth="4" />
        {/* Handle */}
        <path d="M30 48 V34 H66 V48" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    id: 'mike',
    nameHindi: 'माईक (Microphone)',
    nameEnglish: 'Microphone',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Mic capsule */}
        <rect x="38" y="16" width="24" height="40" rx="12" strokeWidth="3.5" />
        <line x1="38" y1="28" x2="62" y2="28" strokeWidth="2" />
        <line x1="38" y1="36" x2="62" y2="36" strokeWidth="2" />
        <line x1="38" y1="44" x2="62" y2="44" strokeWidth="2" />
        {/* Stand cradle */}
        <path d="M28 36 C28 60 72 60 72 36" strokeWidth="3.5" />
        {/* Stem and base */}
        <line x1="50" y1="60" x2="50" y2="82" strokeWidth="4" />
        <line x1="30" y1="82" x2="70" y2="82" strokeWidth="5" />
      </svg>
    ),
  },
  {
    id: 'ladies_purse',
    nameHindi: 'लेडी पर्स (Purse)',
    nameEnglish: 'Ladies Purse',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Handle */}
        <path d="M36 40 C36 20 64 20 64 40" strokeWidth="3.5" />
        {/* Bag body */}
        <path d="M22 42 H78 L84 80 H16 Z" rx="4" strokeWidth="3.5" />
        {/* Flap & lock */}
        <path d="M22 42 L50 60 L78 42" strokeWidth="2.5" />
        <circle cx="50" cy="62" r="3" fill={c} />
      </svg>
    ),
  },
  {
    id: 'stool',
    nameHindi: 'स्टूल (Stool)',
    nameEnglish: 'Stool',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Top seat */}
        <ellipse cx="50" cy="30" rx="36" ry="10" strokeWidth="3.5" />
        {/* Legs */}
        <line x1="22" y1="36" x2="16" y2="84" strokeWidth="4" />
        <line x1="42" y1="38" x2="38" y2="82" strokeWidth="3.5" />
        <line x1="58" y1="38" x2="62" y2="82" strokeWidth="3.5" />
        <line x1="78" y1="36" x2="84" y2="84" strokeWidth="4" />
        {/* Leg cross bar */}
        <line x1="19" y1="62" x2="81" y2="62" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'bangles',
    nameHindi: 'चूड़ियां (Bangles)',
    nameEnglish: 'Bangles',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <circle cx="44" cy="46" r="28" />
        <circle cx="44" cy="46" r="22" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="56" cy="54" r="28" />
        <circle cx="56" cy="54" r="22" strokeWidth="2" strokeDasharray="4 3" />
      </svg>
    ),
  },
  {
    id: 'spanner',
    nameHindi: 'स्पैनर / रिंच (Spanner)',
    nameEnglish: 'Spanner',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Slanted spanner */}
        <path d="M28 20 C22 24 20 34 26 40 L66 80 C72 86 82 84 86 78 C90 72 88 62 82 56 L42 16 C36 10 26 12 28 20 Z" />
        {/* Open jaw notch */}
        <path d="M22 22 L34 28 L30 40 L20 34 Z" fill="#fff" stroke={c} strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'slate',
    nameHindi: 'स्लेट (Slate)',
    nameEnglish: 'Slate',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <rect x="18" y="20" width="64" height="60" rx="3" strokeWidth="4" />
        <rect x="26" y="28" width="48" height="44" strokeWidth="2" />
        <line x1="32" y1="40" x2="68" y2="40" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="32" y1="52" x2="68" y2="52" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="50" cy="14" r="3" fill={c} />
      </svg>
    ),
  },
  {
    id: 'matchbox',
    nameHindi: 'माचिस की डिब्बी (Matchbox)',
    nameEnglish: 'Matchbox',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* 3D Matchbox */}
        <polygon points="20,40 55,26 85,38 50,52" />
        <polygon points="20,40 50,52 50,80 20,68" />
        <polygon points="50,52 85,38 85,66 50,80" />
        {/* Matchstick beside */}
        <line x1="88" y1="42" x2="94" y2="82" strokeWidth="3" />
        <circle cx="88" cy="42" r="3.5" fill={c} />
      </svg>
    ),
  },
  {
    id: 'kadhai',
    nameHindi: 'कड़ाही (Kadhai)',
    nameEnglish: 'Kadhai',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M16 48 C18 78 82 78 84 48 Z" strokeWidth="3.5" />
        <ellipse cx="50" cy="48" rx="34" ry="10" strokeWidth="2.5" />
        {/* Ring handles */}
        <circle cx="14" cy="48" r="6" strokeWidth="3" />
        <circle cx="86" cy="48" r="6" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'table',
    nameHindi: 'मेज / टेबल (Table)',
    nameEnglish: 'Table',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <polygon points="12,38 74,32 92,44 26,50" strokeWidth="3.5" />
        {/* Legs */}
        <line x1="16" y1="42" x2="16" y2="84" strokeWidth="4" />
        <line x1="28" y1="50" x2="28" y2="88" strokeWidth="4" />
        <line x1="74" y1="36" x2="74" y2="76" strokeWidth="4" />
        <line x1="88" y1="44" x2="88" y2="82" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: 'toothbrush',
    nameHindi: 'दाँत ब्रुश (Toothbrush)',
    nameEnglish: 'Toothbrush',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M14 68 C24 64 74 36 84 32 C88 30 90 34 86 38 C76 42 26 76 16 78 Z" />
        {/* Bristles */}
        <rect x="70" y="24" width="16" height="8" rx="2" fill={c} />
      </svg>
    ),
  },
  {
    id: 'tongs',
    nameHindi: 'चिमटा (Tongs)',
    nameEnglish: 'Tongs',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M20 76 L76 28 C82 22 88 28 82 34 L32 84" />
        <circle cx="82" cy="28" r="4" fill={c} />
      </svg>
    ),
  },
  {
    id: 'truck',
    nameHindi: 'ट्रक (Truck)',
    nameEnglish: 'Truck',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Cabin & Cargo */}
        <rect x="14" y="32" width="46" height="38" />
        <path d="M60 44 H76 L86 56 V70 H60 Z" />
        {/* Wheels */}
        <circle cx="28" cy="74" r="10" strokeWidth="3.5" />
        <circle cx="44" cy="74" r="10" strokeWidth="3.5" />
        <circle cx="76" cy="74" r="10" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    id: 'tyre',
    nameHindi: 'टायर (Tyre)',
    nameEnglish: 'Tyre',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <circle cx="50" cy="50" r="36" />
        <circle cx="50" cy="50" r="22" strokeWidth="3" />
        <circle cx="50" cy="50" r="8" fill={c} />
        {/* Treads */}
        <line x1="50" y1="14" x2="50" y2="28" strokeWidth="2.5" />
        <line x1="50" y1="72" x2="50" y2="86" strokeWidth="2.5" />
        <line x1="14" y1="50" x2="28" y2="50" strokeWidth="2.5" />
        <line x1="72" y1="50" x2="86" y2="50" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: 'walking_stick',
    nameHindi: 'छड़ी (Walking Stick)',
    nameEnglish: 'Walking Stick',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        {/* Curved hook */}
        <path d="M42 28 C42 16 66 16 66 28 V86" />
        {/* Bottom rubber ferrule */}
        <rect x="63" y="86" width="6" height="6" fill={c} />
      </svg>
    ),
  },
  {
    id: 'ring',
    nameHindi: 'अंगूठी (Ring)',
    nameEnglish: 'Ring',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <circle cx="50" cy="58" r="24" strokeWidth="3.5" />
        {/* Diamond on top */}
        <polygon points="50,18 64,28 50,38 36,28" strokeWidth="3" fill="#fff" />
      </svg>
    ),
  },
  {
    id: 'camera',
    nameHindi: 'कैमरा (Camera)',
    nameEnglish: 'Camera',
    category: 'sarpanch40',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <rect x="18" y="32" width="64" height="48" rx="6" />
        <path d="M35 32 L40 22 H60 L65 32" fill="none" />
        <circle cx="50" cy="56" r="16" strokeWidth="3.5" />
        <circle cx="50" cy="56" r="8" fill="none" strokeWidth="2" />
        <circle cx="70" cy="40" r="3" fill={c} />
      </svg>
    ),
  },

  // --- वार्ड पंच व लोकप्रिय चुनाव चिन्ह ---
  {
    id: 'almirah',
    nameHindi: 'अलमारी (Cupboard)',
    nameEnglish: 'Cupboard',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <rect x="25" y="15" width="50" height="70" rx="2" />
        <line x1="50" y1="15" x2="50" y2="85" />
        <circle cx="45" cy="50" r="2.5" fill={c} />
        <circle cx="55" cy="50" r="2.5" fill={c} />
        <line x1="28" y1="85" x2="28" y2="92" strokeWidth="4" />
        <line x1="72" y1="85" x2="72" y2="92" strokeWidth="4" />
        <line x1="22" y1="15" x2="78" y2="15" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: 'bat',
    nameHindi: 'क्रिकेट बल्ला (Bat)',
    nameEnglish: 'Bat',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M72 15 L80 23 L62 41 L54 33 Z" fill="none" />
        <path d="M68 19 L76 27" strokeWidth="2" />
        <path d="M54 33 L24 63 C18 69 22 80 32 86 C40 90 48 84 54 78 L62 41" fill="none" />
        <path d="M30 65 L48 47" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M28 78 L38 82" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'rising_sun',
    nameHindi: 'उगता सूरज (Rising Sun)',
    nameEnglish: 'Rising Sun',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <line x1="12" y1="68" x2="88" y2="68" strokeWidth="4" />
        <path d="M30 68 A20 20 0 0 1 70 68" fill="none" strokeWidth="3.5" />
        <line x1="50" y1="42" x2="50" y2="20" strokeWidth="3" />
        <line x1="37" y1="45" x2="25" y2="29" strokeWidth="3" />
        <line x1="63" y1="45" x2="75" y2="29" strokeWidth="3" />
        <line x1="28" y1="56" x2="14" y2="46" strokeWidth="3" />
        <line x1="72" y1="56" x2="86" y2="46" strokeWidth="3" />
        <path d="M20 76 Q35 72 50 76 T80 76" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: 'lock_key',
    nameHindi: 'ताला और चाबी (Lock & Key)',
    nameEnglish: 'Lock & Key',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M28 45 V32 A16 16 0 0 1 60 32 V45" />
        <rect x="20" y="45" width="48" height="42" rx="6" />
        <circle cx="44" cy="62" r="4" fill={c} />
        <path d="M44 65 L44 76" strokeWidth="3" />
        <circle cx="78" cy="35" r="7" />
        <line x1="78" y1="42" x2="78" y2="78" strokeWidth="3.5" />
        <line x1="78" y1="65" x2="86" y2="65" strokeWidth="3" />
        <line x1="78" y1="74" x2="86" y2="74" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'gas_cylinder',
    nameHindi: 'गैस सिलेंडर (Gas Cylinder)',
    nameEnglish: 'Gas Cylinder',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <rect x="38" y="16" width="24" height="12" rx="4" />
        <ellipse cx="50" cy="22" rx="5" ry="3" />
        <path d="M32 34 C32 28 68 28 68 34 V76 C68 82 32 82 32 76 Z" />
        <rect x="36" y="80" width="28" height="6" rx="2" />
      </svg>
    ),
  },
  {
    id: 'glass',
    nameHindi: 'कांच का गिलास (Glass)',
    nameEnglish: 'Glass',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <ellipse cx="50" cy="24" rx="24" ry="7" />
        <path d="M26 24 L34 82 C34 85 66 85 66 82 L74 24" />
      </svg>
    ),
  },
  {
    id: 'bucket',
    nameHindi: 'बाल्टी (Bucket)',
    nameEnglish: 'Bucket',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <ellipse cx="50" cy="30" rx="30" ry="8" strokeWidth="3" />
        <path d="M21 32 L30 82 Q50 88 70 82 L79 32" />
        <path d="M20 32 C20 10 80 10 80 32" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: 'cot',
    nameHindi: 'चारपाई / खाट (Cot)',
    nameEnglish: 'Cot',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <polygon points="16,42 66,32 86,46 36,58" />
        <line x1="28" y1="40" x2="48" y2="55" strokeWidth="1.5" />
        <line x1="42" y1="37" x2="62" y2="52" strokeWidth="1.5" />
        <line x1="16" y1="42" x2="16" y2="72" strokeWidth="4" />
        <line x1="36" y1="58" x2="36" y2="82" strokeWidth="4" />
        <line x1="86" y1="46" x2="86" y2="72" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: 'tractor',
    nameHindi: 'ट्रैक्टर (Tractor)',
    nameEnglish: 'Tractor',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M38 46 H74 V66 H38 Z" />
        <path d="M38 46 L38 32 H26 L22 66 H38" />
        <circle cx="34" cy="68" r="16" strokeWidth="3.5" />
        <circle cx="70" cy="72" r="10" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'plough',
    nameHindi: 'हल (Plough)',
    nameEnglish: 'Plough',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M22 36 L68 66 L86 64" strokeWidth="3.5" />
        <path d="M68 66 L60 84 L46 76 L68 66 Z" fill="none" strokeWidth="3" />
        <line x1="42" y1="50" x2="50" y2="30" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    id: 'umbrella',
    nameHindi: 'छाता (Umbrella)',
    nameEnglish: 'Umbrella',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M16 55 C18 30 40 20 50 20 C60 20 82 30 84 55 Q76 50 67 55 Q58 50 50 55 Q42 50 33 55 Q24 50 16 55 Z" strokeWidth="3" />
        <line x1="50" y1="20" x2="50" y2="76" strokeWidth="3" />
        <path d="M50 76 C50 84 62 84 62 76" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'kite',
    nameHindi: 'पतंग (Kite)',
    nameEnglish: 'Kite',
    category: 'wardpanch',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <polygon points="50,15 84,50 50,82 16,50" />
        <line x1="50" y1="15" x2="50" y2="82" strokeWidth="2.5" />
        <path d="M16 50 Q50 32 84 50" strokeWidth="2.5" />
        <polygon points="50,82 42,92 58,92" fill={c} />
      </svg>
    ),
  },
  {
    id: 'lotus',
    nameHindi: 'कमल (Lotus)',
    nameEnglish: 'Lotus',
    category: 'party',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M50 15 C45 35 45 60 50 72 C55 60 55 35 50 15 Z" fill="none" />
        <path d="M50 72 C40 55 32 30 40 22 C48 30 49 50 50 72" fill="none" />
        <path d="M50 72 C60 55 68 30 60 22 C52 30 51 50 50 72" fill="none" />
        <path d="M50 72 C32 60 18 35 25 30 C34 40 40 60 50 72" fill="none" />
        <path d="M50 72 C68 60 82 35 75 30 C66 40 60 60 50 72" fill="none" />
        <path d="M50 72 L50 88" strokeWidth="3" />
        <line x1="42" y1="88" x2="58" y2="88" strokeWidth="2.5" />
        <circle cx="44" cy="94" r="1.5" fill={c} />
        <circle cx="50" cy="94" r="1.5" fill={c} />
        <circle cx="56" cy="94" r="1.5" fill={c} />
      </svg>
    ),
  },
  {
    id: 'hand',
    nameHindi: 'हाथ (Hand)',
    nameEnglish: 'Hand',
    category: 'party',
    render: (c = 'currentColor') => (
      <svg viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-h-full">
        <path d="M38 78 L38 88 H62 L62 76 C68 70 76 56 76 44 C76 39 71 39 68 44 C67 36 62 36 59 42 C58 32 53 32 50 38 C49 26 43 26 41 34 C41 48 34 50 26 54 C22 56 24 64 30 65 C34 66 38 70 38 78 Z" />
      </svg>
    ),
  },
];
