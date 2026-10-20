import React, { useState, useRef, useEffect } from 'react';
import { PamphletData } from './types.ts';
import { DEFAULT_PAMPHLET_DATA } from './data/presets.ts';
import { PamphletPreview } from './components/PamphletPreview.tsx';
import { EditorPanel } from './components/EditorPanel.tsx';
import { ChunavChinhModal } from './components/ChunavChinhModal.tsx';
import { UserManualModal } from './components/UserManualModal.tsx';
import {
  Printer,
  Download,
  Eye,
  Sparkles,
  Vote,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Check,
  BookOpen,
  X,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportElementAsImage } from './utils/exportImage.ts';
import {
  downloadA4SinglePamphletPDF,
  downloadSinglePamphletPDF,
} from './utils/pdfGenerator.ts';

const STORAGE_KEY = 'wardpanch_pamphlet_data_v4';

export default function App() {
  const [data, setData] = useState<PamphletData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PAMPHLET_DATA, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved pamphlet data', e);
    }
    return DEFAULT_PAMPHLET_DATA;
  });

  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [isSymbolModalOpen, setIsSymbolModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);
  const [printFeedback, setPrintFeedback] = useState<string | null>(null);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const exportContainerRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [data]);

  // Set standard A4 portrait print style for seamless WYSIWYG printing
  useEffect(() => {
    let styleTag = document.getElementById('dynamic-print-page-style') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-print-page-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = `@media print { 
      @page { 
        size: A4 portrait; 
        margin: 5mm; 
      } 
    }`;
  }, []);

  // Direct Browser Print: Opens dedicated in-app Print Dialog Box instantly and attempts native print
  const handlePrintA4 = () => {
    // 1. Immediately open the on-screen Print Dialog Box modal so the user never encounters a blank non-response!
    setIsPrintDialogOpen(true);

    // 2. Also trigger native window.print() if supported by the browser context
    try {
      window.focus();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setTimeout(() => {
        try {
          window.print();
        } catch (printErr) {
          console.warn('Native window.print() suppressed by browser iframe sandbox:', printErr);
        }
      }, 100);
    } catch (_) {}
  };

  // Keyboard shortcut Ctrl+P / Cmd+P support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrintA4();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data]);

  // Auto-trigger native system print dialog when opened with ?autoprint=true
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('print') === 'true' || params.get('autoprint') === 'true') {
        const timer = setTimeout(() => {
          window.focus();
          window.print();
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch (_) {}
  }, []);

  const handleReset = () => {
    if (window.confirm('क्या आप सभी फ़ील्ड्स को मूल रूप में रीसेट करना चाहते हैं?')) {
      setData(DEFAULT_PAMPHLET_DATA);
    }
  };

  // Chunav Chinh Selection from Modal
  const handleSelectSymbol = (symbol: { url: string; name: string }) => {
    const symName = symbol.name.trim() || 'चुनाव चिन्ह';

    setData((prev) => ({
      ...prev,
      currentSymbolUrl: symbol.url,
      symbolNameText: symName,
      appealHeadline: `को वार्ड पंच हेतु ${prev.candidateRow} नंबर पर ${symName} के निशान पर मुहर लगाकर भारी मतों से विजयी बनावें ।`,
    }));
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  // Direct A4 Single Pamphlet PDF Download with 100% WYSIWYG match
  const handleQuickDownloadPdf = async () => {
    const node = exportContainerRef.current || previewContainerRef.current;
    if (!node) return;
    setIsDownloading(true);
    try {
      const dataUrl = await exportElementAsImage(node, {
        format: 'png',
        downloadImmediately: false,
        quality: 1,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
      });
      if (dataUrl) {
        await downloadA4SinglePamphletPDF(dataUrl, data.candidateName);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }
    } catch (err) {
      console.error('PDF export error:', err);
      alert('PDF डाउनलोड करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  // High-Resolution PNG Download with 100% WYSIWYG match
  const handleQuickDownloadPng = async () => {
    const node = exportContainerRef.current || previewContainerRef.current;
    if (!node) return;
    setIsDownloading(true);
    try {
      const filename = `wardpanch-a4-${(data.candidateName || 'pemphlet').replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_')}.png`;
      await exportElementAsImage(node, {
        format: 'png',
        filename,
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        downloadImmediately: true,
      });
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Image generation error:', err);
      alert('इमेज डाउनलोड करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col text-neutral-900 font-devanagari">
      {/* 1. TOP HEADER APP BAR with exact requested branding:
          Main title: जलद प्रिंटर्स चिखली
          Subtitle: वार्ड पंच चुनाव पैम्फलेट व मतपत्र निर्माता
      */}
      <header className="bg-neutral-900 text-white shadow-md border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              {/* Exact Requested Branding */}
              <h1 className="font-khand font-black text-xl sm:text-2xl leading-none tracking-wide text-amber-300">
                जलद प्रिंटर्स चिखली
              </h1>
              <p className="text-xs sm:text-sm font-khand font-bold text-neutral-200 tracking-tight leading-tight mt-0.5">
                वार्ड पंच चुनाव पैम्फलेट व मतपत्र निर्माता
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* User Manual Button in Hindi */}
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-neutral-700 font-khand text-sm"
              title="उपयोगकर्ता मार्गदर्शिका"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>यूज़र मैन्युअल (Guide)</span>
            </button>

            {/* Chunav Chinh Trigger */}
            <button
              onClick={() => setIsSymbolModalOpen(true)}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors font-khand text-sm shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ चुनाव चिन्ह</span>
            </button>

            <button
              onClick={() => setIsReferenceModalOpen(true)}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
              title="मूल चित्र देखें"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden xs:inline">मूल नमूने</span>
            </button>

            {/* Direct A4 PDF Download Button in Top Bar */}
            <button
              onClick={handleQuickDownloadPdf}
              disabled={isDownloading}
              className="px-3 py-1.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all font-khand text-sm disabled:opacity-50 cursor-pointer"
              title="सीधा A4 PDF डाउनलोड करें"
            >
              <FileText className="w-4 h-4 text-neutral-950" />
              <span>{isDownloading ? 'तैयार हो रहा है...' : 'A4 PDF डाउनलोड'}</span>
            </button>

            {/* Quick PNG Download Button */}
            <button
              onClick={handleQuickDownloadPng}
              disabled={isDownloading}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700 disabled:opacity-50 font-khand text-sm cursor-pointer"
              title="PNG इमेज डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>PNG</span>
            </button>

            {/* Direct Print Dialogue Button */}
            <a
              href={`${window.location.origin}${window.location.pathname}?autoprint=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all font-khand text-sm cursor-pointer"
              title="सिस्टम प्रिंटर डायलॉग खोलें (सीधा प्रिंट)"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ सीधा प्रिंट</span>
            </a>
          </div>
        </div>
      </header>

      {/* Alert toast */}
      {savedAlert && (
        <div className="fixed top-14 right-4 z-50 bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-bounce font-khand font-bold text-sm">
          <Check className="w-4 h-4" />
          <span>चिन्ह मतपत्र में लग गया!</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto w-full p-2 sm:p-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Settings Panel */}
        <div className="lg:col-span-5 xl:col-span-5 h-[calc(100vh-100px)] min-h-[580px] sticky top-16 editor-sidebar-column">
          <EditorPanel
            data={data}
            onChange={setData}
            onReset={handleReset}
            onOpenSymbolModal={() => setIsSymbolModalOpen(true)}
          />
        </div>

        {/* Right Column: Live Interactive A4 Paper Sheet Preview & WYSIWYG Print */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-2.5 preview-container-column">
          {/* Print Status Feedback Alert */}
          {printFeedback && (
            <div className="bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between gap-2 border border-blue-500 font-khand font-bold text-base">
              <div className="flex items-center gap-2.5">
                <Printer className="w-5 h-5 text-amber-300 animate-bounce" />
                <span>{printFeedback}</span>
              </div>
              <button
                type="button"
                onClick={handleQuickDownloadPdf}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg text-sm font-bold font-khand shadow-xs cursor-pointer"
              >
                📄 तुरंत A4 PDF डाउनलोड करें
              </button>
            </div>
          )}

          {/* 1. PREVIEW CONTROL BAR WITH INSTANT PRINT BUTTON */}
          <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-xs border border-neutral-200 flex items-center justify-between gap-3 flex-wrap preview-toolbar">
            {/* Direct Native System Print Trigger (Opens in new tab where Chrome allows window.print) */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={`${window.location.origin}${window.location.pathname}?autoprint=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-khand font-black text-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                title="सीधा सिस्टम प्रिंटर डायलॉग खोलें"
              >
                <Printer className="w-5 h-5 text-white animate-pulse" />
                <span>🖨️ सीधा सिस्टम प्रिंटर डायलॉग</span>
              </a>

              {/* In-app Print & PDF Options modal */}
              <button
                type="button"
                onClick={() => setIsPrintDialogOpen(true)}
                className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 text-white rounded-xl font-khand font-bold text-base flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="प्रिंट ऑप्शंस देखें"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>प्रिंट विकल्प</span>
              </button>

              {/* Direct A4 PDF Download */}
              <button
                type="button"
                onClick={handleQuickDownloadPdf}
                disabled={isDownloading}
                className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-neutral-950 rounded-xl font-khand font-bold text-base flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                title="A4 साइज PDF डाउनलोड करें"
              >
                <FileText className="w-4 h-4" />
                <span>{isDownloading ? 'तैयार हो रहा है...' : 'A4 PDF डाउनलोड'}</span>
              </button>

              {/* PNG Download */}
              <button
                type="button"
                onClick={handleQuickDownloadPng}
                disabled={isDownloading}
                className="px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 text-white rounded-xl font-khand font-bold text-sm flex items-center gap-1.5 transition-all border border-neutral-700 disabled:opacity-50 cursor-pointer"
                title="हाई-रेजोल्यूशन PNG इमेज डाउनलोड करें"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>PNG डाउनलोड</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-neutral-600">
              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.max(0.6, z - 0.1))}
                className="p-1 rounded hover:bg-neutral-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1 font-bold">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.min(1.4, z + 0.1))}
                className="p-1 rounded hover:bg-neutral-200"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. SUB-BAR: A4 SIZE BADGE & COLOR TOGGLE */}
          <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-neutral-200 flex items-center justify-between text-xs text-neutral-700 preview-toolbar flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-khand font-bold text-sm text-neutral-900">
                1 A4 पेज = 1 पैम्फलेट (210 × 297 mm, खड़ा Portrait, 5mm मार्जिन)
              </span>
            </div>
            {/* Ballot Color Switcher */}
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className="font-khand text-xs text-neutral-500">मतपत्र रंग:</span>
              <button
                type="button"
                onClick={() => setData({ ...data, ballotPaperColor: 'white' })}
                className={`px-2.5 py-0.5 rounded font-khand text-xs transition-colors cursor-pointer ${
                  data.ballotPaperColor === 'white'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                सफेद (सरपंच)
              </button>
              <button
                type="button"
                onClick={() => setData({ ...data, ballotPaperColor: 'pink' })}
                className={`px-2.5 py-0.5 rounded font-khand text-xs transition-colors cursor-pointer ${
                  data.ballotPaperColor === 'pink'
                    ? 'bg-pink-200 text-pink-950 font-bold border border-pink-400'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                गुलाबी (वार्ड पंच)
              </button>
            </div>
          </div>

          {/* 3. AUTHENTIC A4 CANVAS VIEWPORT (1 PAMPHLET ON A4) */}
          <div className="bg-neutral-300/80 rounded-2xl p-2 sm:p-5 overflow-auto flex items-center justify-center min-h-[580px] border border-neutral-300 shadow-inner canvas-viewport-wrapper">
            <div
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
              className="w-full flex justify-center canvas-scaler-wrapper"
            >
              {/* THE AUTHENTIC A4 SHEET CONTAINER (PORTRAIT 210 x 297 mm) */}
              <div
                id="main-a4-paper-sheet"
                className="bg-white w-full max-w-[620px] aspect-[210/297] shadow-2xl border border-neutral-400 box-border flex flex-col justify-between"
                style={{
                  padding: '5mm',
                  boxSizing: 'border-box',
                  height: '877px',
                  minHeight: '877px',
                }}
              >
                <div
                  ref={previewContainerRef}
                  className="w-full h-full flex flex-col justify-between flex-1"
                >
                  <PamphletPreview
                    data={data}
                    isPrintView={true}
                    onOpenSymbolModal={() => setIsSymbolModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. DEDICATED OFF-SCREEN A4 EXPORT CONTAINER (FIXED 794px × 1123px = 210 × 297 mm at standard 96 DPI)
          Guarantees 100% pixel-perfect, consistent PNG & PDF export without responsive squashing or zoom interference */}
      <div
        className="no-print"
        style={{
          position: 'fixed',
          top: 0,
          left: '-9999px',
          width: '794px',
          height: '1123px',
          minHeight: '1123px',
          zIndex: -9999,
          pointerEvents: 'none',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          ref={exportContainerRef}
          style={{
            width: '794px',
            height: '1123px',
            minHeight: '1123px',
            padding: '19px', // 5mm uniform margin
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
          }}
          className="bg-white flex flex-col justify-between h-full w-full"
        >
          <PamphletPreview
            data={data}
            isPrintView={true}
            isExportNode={true}
          />
        </div>
      </div>

      {/* 7. DEDICATED A4 PRINT & PDF DIALOG MODAL */}
      {isPrintDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-neutral-300 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-blue-700 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Printer className="w-5 h-5 text-amber-300" />
                <h3 className="font-khand font-black text-xl leading-none">
                  प्रिंट डायलॉग बॉक्स (A4 Print Manager)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintDialogOpen(false)}
                className="p-1 text-white/80 hover:text-white hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4">
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-emerald-900 text-sm flex items-start gap-2.5">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold font-khand text-base">
                    A4 शीट पर पूरा पैम्फलेट व टेबल सेट हो चुका है!
                  </p>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    नीचे की खाली जगह पूरी तरह भर दी गई है और 5mm का सही मार्जिन लगा हुआ है।
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                {/* 1. Open System Printer in Dedicated Tab */}
                <a
                  href={`${window.location.origin}${window.location.pathname}?autoprint=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-khand font-black text-xl rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer text-center"
                >
                  <Printer className="w-6 h-6 text-amber-300 animate-pulse" />
                  <span>🖨️ सीधा सिस्टम प्रिंटर डायलॉग खोलें (100% गारंटी)</span>
                </a>

                {/* 2. Quick A4 PDF Download */}
                <button
                  type="button"
                  onClick={() => {
                    handleQuickDownloadPdf();
                    setIsPrintDialogOpen(false);
                  }}
                  disabled={isDownloading}
                  className="w-full py-3 px-4 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-khand font-black text-lg rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <FileText className="w-5 h-5" />
                  <span>
                    {isDownloading ? 'तैयार हो रहा है...' : '📄 1-क्लिक A4 PDF डाउनलोड करें (सीधा प्रिंट)'}
                  </span>
                </button>

                {/* 3. In-page Browser Print Dialog (Fallback) */}
                <button
                  type="button"
                  onClick={() => {
                    try {
                      window.focus();
                      window.print();
                    } catch (_) {}
                  }}
                  className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-khand font-bold text-base rounded-xl border border-neutral-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-neutral-600" />
                  <span>यहाँ सिस्टम प्रिंटर डायलॉग चलाएं (Ctrl + P)</span>
                </button>

                {/* 4. PNG Image Download */}
                <button
                  type="button"
                  onClick={() => {
                    handleQuickDownloadPng();
                    setIsPrintDialogOpen(false);
                  }}
                  disabled={isDownloading}
                  className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-khand font-bold text-base rounded-xl border border-neutral-700 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>🖼️ हाई-रेजोल्यूशन PNG इमेज डाउनलोड करें</span>
                </button>
              </div>

              {/* Helpful Print Guidance */}
              <div className="bg-neutral-100 rounded-xl p-3 border border-neutral-200 text-xs text-neutral-700 leading-relaxed font-devanagari">
                <p className="font-bold text-neutral-900 mb-1 flex items-center gap-1 font-khand text-sm">
                  <span>💡 प्रिंटिंग निर्देश (Printing Tips):</span>
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  <li>
                    यदि ब्राउज़र सुरक्षा या आईफ्रेम (Iframe) के कारण सीधा प्रिंट डायलॉग नहीं खुला, तो ऊपर <strong>'1-क्लिक A4 PDF डाउनलोड करें'</strong> दबाएं।
                  </li>
                  <li>
                    PDF फाइल खोलकर <strong>Ctrl + P</strong> दबाएं — यह किसी भी प्रिंटर (Canon, HP, Epson, Brother) पर 100% सही A4 साइज में बिना कटे निकलेगी।
                  </li>
                  <li>प्रिंटर सेटिंग्स में <strong>Paper Size: A4</strong> और <strong>Scale: 100% (Actual Size)</strong> चुनें।</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHUNAV CHINH MODAL (Persistent Uploads & Saved Gallery) */}
      <ChunavChinhModal
        isOpen={isSymbolModalOpen}
        onClose={() => setIsSymbolModalOpen(false)}
        currentSymbolUrl={data.currentSymbolUrl}
        currentSymbolName={data.symbolNameText}
        onSelectSymbol={handleSelectSymbol}
      />


      {/* 5. USER MANUAL MODAL (Step by Step Hindi Guide) */}
      <UserManualModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />

      {/* 6. REFERENCE IMAGES COMPARISON MODAL */}
      {isReferenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base sm:text-lg font-khand">
                  मूल संदर्भ चित्र (Original Reference Images)
                </h3>
              </div>
              <button
                onClick={() => setIsReferenceModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="border border-neutral-300 rounded-xl p-3 bg-neutral-50 flex flex-col">
                <span className="font-bold text-sm text-neutral-900 mb-1 font-khand">
                  इमेज 1: चिखली पर्चा (हेडर व लेआउट)
                </span>
                <div className="h-[400px] bg-neutral-200 rounded-lg overflow-hidden flex items-center justify-center border">
                  <img
                    src="/assets/aistudio/000_341e7eae.jpeg"
                    alt="Original Pamphlet 1"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="border border-neutral-300 rounded-xl p-3 bg-neutral-50 flex flex-col">
                <span className="font-bold text-sm text-neutral-900 mb-1 font-khand">
                  इमेज 2: मतपत्र नमूना (Ballot Paper Table Rows)
                </span>
                <div className="h-[400px] bg-neutral-200 rounded-lg overflow-hidden flex items-center justify-center border">
                  <img
                    src="/assets/aistudio/images_fdf37fe4.jpg"
                    alt="Original Ballot 2"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-neutral-100 border-t border-neutral-200 text-right">
              <button
                onClick={() => setIsReferenceModalOpen(false)}
                className="px-4 py-1.5 bg-neutral-800 text-white rounded-lg text-xs font-bold hover:bg-neutral-900 font-khand text-sm"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
