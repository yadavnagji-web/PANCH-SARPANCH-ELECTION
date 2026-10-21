import React, { useState, useRef, useEffect } from 'react';
import { UploadedSymbol } from '../types.ts';
import {
  Upload,
  X,
  Check,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Plus,
  FolderPlus,
  Layers,
  Search,
} from 'lucide-react';

interface ChunavChinhModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSymbolUrl: string | null;
  currentSymbolName: string;
  onSelectSymbol: (symbol: { url: string; name: string }) => void;
}

interface StagedSymbol {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
}

const STORAGE_KEY_SYMBOLS = 'wardpanch_uploaded_symbols_v1';

// Initial preloaded authentic clean election symbols
const INITIAL_SYMBOLS: UploadedSymbol[] = [
  {
    id: 'lotus_default',
    name: 'कमल',
    url: '/assets/aistudio/000_341e7eae.jpeg',
    timestamp: Date.now() - 100000,
  },
];

const COMMON_NAME_MAP: Record<string, string> = {
  lotus: 'कमल',
  bat: 'बल्ला',
  cup: 'कप प्लेट',
  glass: 'कांच का गिलास',
  lock: 'ताला चाबी',
  sun: 'सूरज',
  car: 'कार',
  tractor: 'ट्रैक्टर',
  fan: 'पंखा',
  umbrella: 'छाता',
  bucket: 'बाल्टी',
  clock: 'घड़ी',
  almirah: 'अलमारी',
  kite: 'पतंग',
  scissors: 'कैंची',
  torch: 'टॉर्च',
  hand: 'हाथ',
  cycle: 'साइकिल',
  elephant: 'हाथी',
  book: 'किताब',
  camera: 'कैमरा',
  television: 'टेलीविजन',
  radio: 'रेडियो',
  key: 'चाबी',
  ring: 'अंगूठी',
  bottle: 'बोतल',
  comb: 'कंघा',
  sewing: 'सिलाई मशीन',
};

function formatSymbolFilename(filename: string): string {
  const baseName = filename.replace(/\.[^/.]+$/, '').trim().toLowerCase();
  for (const [key, hindiName] of Object.entries(COMMON_NAME_MAP)) {
    if (baseName.includes(key)) {
      return hindiName;
    }
  }
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]/g, ' ')
    .trim() || 'चुनाव चिन्ह';
}

export const ChunavChinhModal: React.FC<ChunavChinhModalProps> = ({
  isOpen,
  onClose,
  currentSymbolUrl,
  currentSymbolName,
  onSelectSymbol,
}) => {
  const [savedSymbols, setSavedSymbols] = useState<UploadedSymbol[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SYMBOLS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not parse stored symbols', e);
    }
    return INITIAL_SYMBOLS;
  });

  const [stagedSymbols, setStagedSymbols] = useState<StagedSymbol[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SYMBOLS, JSON.stringify(savedSymbols));
    } catch (e) {
      console.warn('Could not save uploaded symbols', e);
    }
  }, [savedSymbols]);

  if (!isOpen) return null;

  // Process selected multiple files
  const handleFilesAdded = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    const newStagedItems: StagedSymbol[] = [];
    let pendingCount = fileArray.length;

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          newStagedItems.push({
            id: `staged_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            file,
            previewUrl: result,
            name: formatSymbolFilename(file.name),
          });
        }
        pendingCount--;
        if (pendingCount === 0) {
          setStagedSymbols((prev) => [...prev, ...newStagedItems]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesAdded(e.target.files);
    }
    // reset input value so re-selecting same files triggers change event
    e.target.value = '';
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleUpdateStagedName = (id: string, name: string) => {
    setStagedSymbols((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item))
    );
  };

  const handleRemoveStagedItem = (id: string) => {
    setStagedSymbols((prev) => prev.filter((item) => item.id !== id));
  };

  // Save all staged symbols to saved gallery
  const handleSaveAllStaged = (applyFirst: boolean = false) => {
    if (stagedSymbols.length === 0) return;

    const newEntries: UploadedSymbol[] = stagedSymbols.map((item) => ({
      id: `symbol_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: item.name.trim() || 'चुनाव चिन्ह',
      url: item.previewUrl,
      timestamp: Date.now(),
    }));

    const updatedList = [...newEntries, ...savedSymbols];
    setSavedSymbols(updatedList);

    if (applyFirst && newEntries.length > 0) {
      onSelectSymbol({ url: newEntries[0].url, name: newEntries[0].name });
      onClose();
    }

    setStagedSymbols([]);
  };

  const handleDeleteSymbol = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('क्या आप इस अपलोड किए गए चिन्ह को हटाना चाहते हैं?')) {
      setSavedSymbols((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleClearAllCustomSymbols = () => {
    if (
      window.confirm(
        'क्या आप अपनी गैलरी से सभी अपलोड किए गए चिन्ह हटाना चाहते हैं?'
      )
    ) {
      setSavedSymbols(INITIAL_SYMBOLS);
    }
  };

  const filteredSymbols = savedSymbols.filter((sym) =>
    sym.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-neutral-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-khand font-black text-2xl leading-none tracking-wide text-amber-300">
                चुनाव चिन्ह बल्क अपलोड (Bulk Upload Gallery)
              </h3>
              <p className="text-xs text-neutral-300 font-devanagari mt-0.5">
                एक साथ कई चुनाव चिन्ह फ़ाइलें (Multiple Images) अपलोड व प्रबंधित करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">
          {/* 1. Multiple Files Drag & Drop Bulk Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-4 rounded-2xl border-2 border-dashed transition-all ${
              isDragging
                ? 'border-blue-600 bg-blue-100/70 scale-[1.01]'
                : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50/80 hover:border-blue-400'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-2">
                <FolderPlus className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-khand font-black text-xl text-blue-950 leading-snug">
                एक साथ कई चुनाव चिन्ह अपलोड करें (Bulk Image Upload)
              </h4>
              <p className="text-xs text-blue-800 font-devanagari max-w-md mt-0.5 leading-relaxed">
                फ़ोन या कंप्यूटर से 5, 10, 20+ चिन्ह फ़ाइलें एक साथ चुनें या यहाँ ड्रैग करके छोड़ें।
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 text-white font-khand font-black text-lg rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-5 h-5 text-amber-300" />
                <span>📁 फ़ाइलें बल्क अपलोड करें (Multiple Files)</span>
              </button>
            </div>
          </div>

          {/* 2. Staged Bulk Queue (When multiple files are chosen) */}
          {stagedSymbols.length > 0 && (
            <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span className="font-khand font-black text-lg text-amber-950">
                    अपलोड के लिए तैयार चिन्ह ({stagedSymbols.length} फ़ाइलें):
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveAllStaged(false)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-khand font-bold text-sm rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>गैलरी में सब सेव करें ({stagedSymbols.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveAllStaged(true)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-khand font-bold text-sm rounded-lg shadow-xs cursor-pointer"
                  >
                    सब सेव करें व पहला लगाएं
                  </button>
                  <button
                    type="button"
                    onClick={() => setStagedSymbols([])}
                    className="px-2.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold text-xs rounded-lg cursor-pointer"
                  >
                    साफ़ करें
                  </button>
                </div>
              </div>

              {/* Grid of staged upload cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[220px] overflow-y-auto p-1">
                {stagedSymbols.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-2.5 rounded-xl border border-amber-300 shadow-2xs relative flex flex-col items-center"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveStagedItem(item.id)}
                      className="absolute top-1 right-1 p-1 text-neutral-400 hover:text-red-600 bg-neutral-100 rounded-full cursor-pointer hover:bg-red-50"
                      title="हटाएं"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-16 h-16 border border-neutral-200 rounded-lg p-1 bg-neutral-50 flex items-center justify-center overflow-hidden mb-1.5">
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleUpdateStagedName(item.id, e.target.value)
                      }
                      placeholder="चिन्ह का नाम..."
                      className="w-full px-2 py-1 text-xs font-bold font-khand border border-neutral-300 rounded text-center focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Saved Symbols Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-khand font-black text-xl text-neutral-900">
                  आपकी सेव की गई गैलरी ({savedSymbols.length} चिन्ह):
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="चिन्ह खोजें (उदा. कमल, बल्ला)..."
                    className="pl-8 pr-3 py-1 text-xs font-khand font-bold border border-neutral-300 rounded-lg w-44 focus:ring-1 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1.5 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {savedSymbols.length > INITIAL_SYMBOLS.length && (
                  <button
                    type="button"
                    onClick={handleClearAllCustomSymbols}
                    className="text-xs font-bold font-khand text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    सभी अपलोड साफ़ करें
                  </button>
                )}
              </div>
            </div>

            {filteredSymbols.length === 0 ? (
              <div className="py-10 text-center text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
                <ImageIcon className="w-10 h-10 mx-auto mb-1.5 text-neutral-300" />
                <p className="font-khand font-bold text-base text-neutral-600">
                  कोई चुनाव चिन्ह नहीं मिला
                </p>
                <p className="text-xs text-neutral-400 font-devanagari">
                  ऊपर बल्क अपलोड बटन द्वारा नई फ़ाइलें जोड़ें
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto p-1">
                {filteredSymbols.map((sym) => {
                  const isSelected =
                    currentSymbolUrl === sym.url ||
                    currentSymbolName === sym.name;

                  return (
                    <div
                      key={sym.id}
                      onClick={() => {
                        onSelectSymbol({ url: sym.url, name: sym.name });
                        onClose();
                      }}
                      className={`relative p-3 rounded-2xl border text-center flex flex-col items-center justify-between cursor-pointer transition-all hover:scale-[1.03] ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/50 shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-xs'
                      }`}
                    >
                      {sym.id !== 'lotus_default' && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSymbol(sym.id, e)}
                          className="absolute top-1.5 right-1.5 p-1 text-neutral-400 hover:text-red-600 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1 overflow-hidden my-1">
                        <img
                          src={sym.url}
                          alt={sym.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="w-full pt-1.5 border-t border-neutral-100">
                        <span className="block font-khand font-bold text-base text-neutral-900 truncate leading-tight">
                          {sym.name}
                        </span>
                        <span
                          className={`block text-[10px] font-bold font-devanagari mt-0.5 ${
                            isSelected ? 'text-blue-600 font-extrabold' : 'text-neutral-500'
                          }`}
                        >
                          {isSelected ? '✓ चयनित' : 'क्लिक करें'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span className="font-devanagari">
            💡 सभी अपलोड किए गए चुनाव चिन्ह स्वतः आपके ब्राउज़र में सुरक्षित रहते हैं
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded-xl font-khand font-bold text-sm cursor-pointer"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
