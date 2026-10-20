import React, { useState, useRef, useEffect } from 'react';
import { UploadedSymbol } from '../types.ts';
import { Upload, X, Check, Trash2, Image as ImageIcon, Sparkles, Plus } from 'lucide-react';

interface ChunavChinhModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSymbolUrl: string | null;
  currentSymbolName: string;
  onSelectSymbol: (symbol: { url: string; name: string }) => void;
}

const STORAGE_KEY_SYMBOLS = 'wardpanch_uploaded_symbols_v1';

// Initial preloaded authentic clean election symbols (Lotus from Image 1, Bat, etc.)
const INITIAL_SYMBOLS: UploadedSymbol[] = [
  {
    id: 'lotus_default',
    name: 'कमल',
    url: '/assets/aistudio/000_341e7eae.jpeg',
    timestamp: Date.now() - 100000,
  },
];

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

  const [newSymbolName, setNewSymbolName] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewDataUrl(event.target?.result as string);
        if (!newSymbolName) {
          const autoName = file.name.replace(/\.[^/.]+$/, '').trim();
          setNewSymbolName(autoName);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAndApply = () => {
    if (!previewDataUrl) return;

    const name = newSymbolName.trim() || 'चुनाव चिन्ह';
    const newEntry: UploadedSymbol = {
      id: `symbol_${Date.now()}`,
      name,
      url: previewDataUrl,
      timestamp: Date.now(),
    };

    const updatedList = [newEntry, ...savedSymbols.filter((s) => s.id !== newEntry.id)];
    setSavedSymbols(updatedList);
    onSelectSymbol({ url: newEntry.url, name: newEntry.name });
    setPreviewDataUrl(null);
    setNewSymbolName('');
    onClose();
  };

  const handleDeleteSymbol = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('क्या आप इस अपलोड किए गए चिन्ह को हटाना चाहते हैं?')) {
      setSavedSymbols((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-neutral-800">
        {/* Header */}
        <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-khand font-black text-xl leading-none tracking-wide">
                चुनाव चिन्ह (Chunav Chinh Gallery)
              </h3>
              <p className="text-[11px] text-neutral-300 font-devanagari">
                अपना चुनाव चिन्ह अपलोड करें — यह आपके गैलरी में हमेशा सुरक्षित (Save) रहेगा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* 1. Upload New Symbol Box */}
          <div className="p-3.5 bg-blue-50/60 border-2 border-dashed border-blue-300 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-khand font-bold text-base text-blue-950 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>नया चुनाव चिन्ह अपलोड करें:</span>
              </span>
              <span className="text-[11px] text-blue-700 font-devanagari">
                PNG, JPG, SVG, WebP
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {previewDataUrl ? (
              <div className="bg-white p-3 rounded-lg border border-blue-200 flex flex-col sm:flex-row items-center gap-3">
                <div className="w-20 h-20 border rounded-lg bg-neutral-50 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  <img
                    src={previewDataUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-0.5">
                      चुनाव चिन्ह का नाम:
                    </label>
                    <input
                      type="text"
                      value={newSymbolName}
                      onChange={(e) => setNewSymbolName(e.target.value)}
                      placeholder="उदा. बल्ला, अलमारी, सूरज, ताला चाबी..."
                      className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-sm font-bold font-khand focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveAndApply}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-khand font-bold text-sm flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>सेव करें और मतपत्र में लगाएं</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewDataUrl(null);
                        setNewSymbolName('');
                      }}
                      className="px-2.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold"
                    >
                      रद्द करें
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-white hover:bg-blue-50/50 border border-blue-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-khand font-bold text-base text-blue-900">
                  फ़ोन या कंप्यूटर से चुनाव चिन्ह फ़ाइल चुनें
                </span>
                <span className="text-[11px] text-neutral-500 font-devanagari">
                  क्लिक करके इमेज फ़ाइल चुनें (यह यहाँ हमेशा के लिए सेव रहेगी)
                </span>
              </button>
            )}
          </div>

          {/* 2. Saved Symbols Gallery */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-khand font-bold text-base text-neutral-900">
                आपके सेव किए गए चुनाव चिन्ह ({savedSymbols.length}):
              </span>
              <span className="text-xs text-neutral-500 font-devanagari">
                किसी भी चिन्ह पर क्लिक करें
              </span>
            </div>

            {savedSymbols.length === 0 ? (
              <div className="py-8 text-center text-neutral-400 bg-neutral-50 rounded-xl border border-dashed">
                <ImageIcon className="w-10 h-10 mx-auto mb-1 text-neutral-300" />
                <p className="font-khand font-bold text-sm text-neutral-600">कोई चुनाव चिन्ह सेव नहीं है</p>
                <p className="text-xs text-neutral-400">ऊपर 'नया चुनाव चिन्ह अपलोड करें' बटन से जोड़ें</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {savedSymbols.map((sym) => {
                  const isSelected = currentSymbolUrl === sym.url || currentSymbolName === sym.name;

                  return (
                    <div
                      key={sym.id}
                      onClick={() => {
                        onSelectSymbol({ url: sym.url, name: sym.name });
                        onClose();
                      }}
                      className={`relative p-2.5 rounded-xl border text-center flex flex-col items-center justify-between cursor-pointer transition-all hover:scale-[1.02] ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/40 shadow-xs'
                          : 'border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-xs'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSymbol(sym.id, e)}
                        className="absolute top-1 right-1 p-1 text-neutral-400 hover:text-red-600 rounded-full hover:bg-neutral-100"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1 overflow-hidden">
                        <img
                          src={sym.url}
                          alt={sym.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="w-full mt-1.5 pt-1 border-t border-neutral-100">
                        <span className="block font-khand font-bold text-base text-neutral-900 truncate leading-tight">
                          {sym.name}
                        </span>
                        <span className="block text-[10px] text-blue-600 font-semibold font-devanagari">
                          {isSelected ? '✓ चयनित है' : 'क्लिक करके लगाएं'}
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
        <div className="px-4 py-2.5 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span>अपलोड किया गया चिन्ह स्वतः आपके ब्राउज़र में सुरक्षित रहता है</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-neutral-800 text-white rounded-lg font-khand font-bold text-sm hover:bg-neutral-900"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
