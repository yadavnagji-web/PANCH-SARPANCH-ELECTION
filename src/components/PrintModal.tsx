import React, { useState, useEffect } from 'react';
import { PamphletData } from '../types.ts';
import { PamphletPreview } from './PamphletPreview.tsx';
import { Printer, X, Download, Scissors, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportElementAsImage } from '../utils/exportImage.ts';
import {
  downloadSinglePamphletPDF,
  downloadA4TwoPamphletsPDF,
  downloadA4FourPamphletsPDF,
} from '../utils/pdfGenerator.ts';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PamphletData;
  sourcePreviewRef: React.RefObject<HTMLDivElement | null>;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  data,
  sourcePreviewRef,
}) => {
  // Default to 2 per A4 as specifically requested:
  // "a4 size par automatic landscap kar ke 5 x 7 inch me 1 a4 par 2 design set kar do aur dono ke bich me ek cut mark laga do."
  const [copiesPerPage, setCopiesPerPage] = useState<1 | 2 | 4>(2);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Sync orientation class and dynamic @page rule for authentic A4 print
  useEffect(() => {
    let styleTag = document.getElementById('dynamic-print-page-style') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-print-page-style';
      document.head.appendChild(styleTag);
    }

    if (isOpen) {
      const orientation = copiesPerPage === 1 ? 'portrait' : 'landscape';
      styleTag.textContent = `@media print { 
        @page { 
          size: A4 ${orientation}; 
          margin: 5mm; 
        } 
      }`;

      if (copiesPerPage === 1) {
        document.body.classList.add('print-portrait-mode');
        document.body.classList.remove('print-landscape-mode');
      } else {
        document.body.classList.add('print-landscape-mode');
        document.body.classList.remove('print-portrait-mode');
      }
    } else {
      styleTag.textContent = '';
      document.body.classList.remove('print-portrait-mode');
      document.body.classList.remove('print-landscape-mode');
    }

    return () => {
      if (styleTag) styleTag.textContent = '';
    };
  }, [isOpen, copiesPerPage]);

  if (!isOpen) return null;

  // Direct Browser Print (Landscape for 2/4, Portrait for 1)
  const handlePrint = () => {
    window.print();
  };

  // Helper to obtain pristine image Data URL
  const getPristineImageDataUrl = async (): Promise<string | null> => {
    if (!sourcePreviewRef.current) return null;
    const dataUrl = await exportElementAsImage(sourcePreviewRef.current, {
      format: 'png',
      downloadImmediately: false,
      quality: 1,
      pixelRatio: 2.5,
      backgroundColor: '#ffffff',
    });
    return dataUrl;
  };

  // 1. PDF Download Handlers
  const handleDownloadPDF = async (type: 'two_in_one' | 'single' | 'four_in_one') => {
    setIsExporting(true);
    setDownloadSuccess(null);
    try {
      const dataUrl = await getPristineImageDataUrl();
      if (!dataUrl) throw new Error('Preview element not found');

      if (type === 'two_in_one') {
        await downloadA4TwoPamphletsPDF(dataUrl, data.candidateName);
        setDownloadSuccess('A4 PDF (2 पैम्फलेट) सफलतापूर्वक डाउनलोड हो गया!');
      } else if (type === 'single') {
        await downloadSinglePamphletPDF(dataUrl, data.candidateName);
        setDownloadSuccess('सिंगल 5x7 इंच PDF सफलतापूर्वक डाउनलोड हो गया!');
      } else if (type === 'four_in_one') {
        await downloadA4FourPamphletsPDF(dataUrl, data.candidateName);
        setDownloadSuccess('A4 4-इन-1 स्लिप्स PDF सफलतापूर्वक डाउनलोड हो गया!');
      }

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('PDF डाउनलोड करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsExporting(false);
    }
  };

  // 2. High-Resolution Image Download (PNG / JPEG)
  const handleDownloadImage = async (format: 'png' | 'jpeg') => {
    if (!sourcePreviewRef.current) return;
    setIsExporting(true);
    setDownloadSuccess(null);
    try {
      const filename = `wardpanch-5x7-${(data.candidateName || 'pemphlet').replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_')}.${format}`;
      await exportElementAsImage(sourcePreviewRef.current, {
        format,
        filename,
        quality: 0.95,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        downloadImmediately: true,
      });

      setDownloadSuccess(`5x7 इंच ${format.toUpperCase()} इमेज सफलतापूर्वक डाउनलोड हो गई!`);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Error generating image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* ========================================================
          A. DEDICATED NATIVE PRINT CONTAINER FOR WINDOW.PRINT()
          Isolated in CSS @media print; completely hidden on screen
          ======================================================== */}
      <div id="a4-print-sheet-root">
        {copiesPerPage === 1 && (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full max-w-[190mm]">
              <PamphletPreview data={data} isPrintView={true} />
            </div>
          </div>
        )}

        {copiesPerPage === 2 && (
          <div className="w-full h-full flex flex-row items-stretch justify-between p-1 box-border">
            {/* Left 5x7 Pamphlet */}
            <div className="w-[48%] flex items-center justify-center p-1">
              <div className="w-full">
                <PamphletPreview data={data} isPrintView={true} />
              </div>
            </div>

            {/* Exact Center Cut Mark: only --- line and scissors */}
            <div className="w-[4%] flex flex-col items-center justify-between py-4 select-none relative">
              <span className="text-base text-neutral-700">✂</span>
              <div className="w-0 border-r-2 border-dashed border-neutral-500 h-full my-2"></div>
              <span className="text-base text-neutral-700">✂</span>
              <div className="w-0 border-r-2 border-dashed border-neutral-500 h-full my-2"></div>
              <span className="text-base text-neutral-700">✂</span>
            </div>

            {/* Right 5x7 Pamphlet */}
            <div className="w-[48%] flex items-center justify-center p-1">
              <div className="w-full">
                <PamphletPreview data={data} isPrintView={true} />
              </div>
            </div>
          </div>
        )}

        {copiesPerPage === 4 && (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-1 box-border relative">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-center p-1">
                <div className="w-full">
                  <PamphletPreview data={data} isPrintView={true} />
                </div>
              </div>
            ))}
            {/* Horizontal Line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-2 select-none pointer-events-none">
              <span className="text-sm">✂</span>
              <div className="w-full border-t-2 border-dashed border-neutral-500 mx-2"></div>
              <span className="text-sm">✂</span>
            </div>
            {/* Vertical Line */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between py-2 select-none pointer-events-none">
              <span className="text-sm">✂</span>
              <div className="h-full border-r-2 border-dashed border-neutral-500 my-2"></div>
              <span className="text-sm">✂</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          B. INTERACTIVE ON-SCREEN MODAL DIALOG
          ======================================================== */}
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto no-print">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden text-neutral-800">
          {/* Modal Header */}
          <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-khand font-black text-xl leading-none text-amber-300">
                  A4 प्रिंट व PDF डाउनलोड सेंटर (5x7 इंच पैम्फलेट)
                </h3>
                <p className="text-[11px] text-neutral-300 font-devanagari mt-0.5">
                  1 A4 शीट पर 2 पैम्फलेट (5x7 इंच, आड़ा Landscape पेज, बीच में कट मार्क ✂)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1">
            {/* Success toast notification */}
            {downloadSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold font-khand text-sm shadow-xs animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{downloadSuccess}</span>
              </div>
            )}

            {/* 1. TOP PRIMARY ACTION: DIRECT PDF DOWNLOAD (Exact user requirement) */}
            <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-neutral-900 text-white p-4 rounded-2xl shadow-md border border-blue-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded uppercase font-khand">
                    सबसे सटीक व अनुशंसित
                  </span>
                  <h4 className="font-khand font-black text-lg text-white">
                    सीधा PDF डाउनलोड (बिना कटे, 100% सही A4 साइज)
                  </h4>
                </div>
                <p className="text-xs text-neutral-300 font-devanagari mt-1 max-w-xl">
                  PDF डाउनलोड करने से फाइल कभी नहीं कटेगी, Paint में नहीं खुलेगी और सीधे WhatsApp या प्रिंटर दुकान पर भेजी जा सकती है।
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadPDF('two_in_one')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 rounded-xl font-khand font-black text-base flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <FileText className="w-5 h-5" />
                  <span>
                    {isExporting ? 'PDF बन रही है...' : 'A4 PDF डाउनलोड (2 पैम्फलेट)'}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadPDF('single')}
                  className="px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl font-khand font-bold text-sm flex items-center justify-center gap-1.5 border border-neutral-700 transition-colors"
                  title="सिंगल 5x7 इंच PDF"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>सिंगल PDF</span>
                </button>
              </div>
            </div>

            {/* 2. MANUAL PRINT LAYOUT SELECTOR */}
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between mb-2.5">
                <label className="font-khand font-bold text-base text-neutral-900 flex items-center gap-1.5">
                  <span>A4 शीट पर पैम्फलेट लेआउट चुनें:</span>
                </label>
                <span className="text-xs text-emerald-800 font-khand font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  5mm मार्जिन (कोई कटिंग नहीं)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Option 2: 2 Pamphlets 5x7 on Horizontal A4 (RECOMMENDED) */}
                <button
                  type="button"
                  onClick={() => setCopiesPerPage(2)}
                  className={`p-3 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                    copiesPerPage === 2
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/30'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="w-11 h-8 border-2 border-blue-600 rounded grid grid-cols-2 p-0.5 gap-0.5 shrink-0 bg-blue-100/60 font-bold text-[9px] font-mono text-blue-900">
                    <div className="bg-white rounded-2xs flex items-center justify-center border border-blue-300">1</div>
                    <div className="bg-white rounded-2xs flex items-center justify-center border border-blue-300">2</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-khand font-black text-base text-blue-950 leading-tight">
                        2 पैम्फलेट (5x7 इंच)
                      </span>
                      <span className="text-[10px] bg-amber-400 text-neutral-900 font-bold px-1 rounded">
                        मुख्य
                      </span>
                    </div>
                    <span className="text-[11px] text-blue-800 font-devanagari block mt-0.5 font-medium">
                      आड़ा (Landscape) A4, 5mm मार्जिन, बीच में ✂ कट मार्क
                    </span>
                  </div>
                </button>

                {/* Option 1: 1 Pamphlet on Portrait A4 */}
                <button
                  type="button"
                  onClick={() => setCopiesPerPage(1)}
                  className={`p-3 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                    copiesPerPage === 1
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/30'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="w-8 h-11 border-2 border-neutral-400 rounded flex items-center justify-center shrink-0 bg-neutral-100 font-bold text-xs font-mono">
                    1
                  </div>
                  <div>
                    <span className="font-khand font-bold text-base text-neutral-900 leading-tight block">
                      1 पैम्फलेट (खड़ा A4)
                    </span>
                    <span className="text-[11px] text-neutral-500 font-devanagari block mt-0.5">
                      पूरे A4 पेज पर बड़ा पैम्फलेट (5mm मार्जिन)
                    </span>
                  </div>
                </button>

                {/* Option 4: 4 Pamphlets on Horizontal A4 */}
                <button
                  type="button"
                  onClick={() => setCopiesPerPage(4)}
                  className={`p-3 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                    copiesPerPage === 4
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/30'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="w-11 h-8 border-2 border-neutral-400 rounded grid grid-cols-2 p-0.5 gap-0.5 shrink-0 bg-neutral-100 font-bold text-[8px] font-mono">
                    <div className="bg-neutral-300 rounded-2xs flex items-center justify-center">1</div>
                    <div className="bg-neutral-300 rounded-2xs flex items-center justify-center">2</div>
                    <div className="bg-neutral-300 rounded-2xs flex items-center justify-center">3</div>
                    <div className="bg-neutral-300 rounded-2xs flex items-center justify-center">4</div>
                  </div>
                  <div>
                    <span className="font-khand font-bold text-base text-neutral-900 leading-tight block">
                      4 पैम्फलेट (मतदाता पर्चियां)
                    </span>
                    <span className="text-[11px] text-neutral-500 font-devanagari block mt-0.5">
                      आड़ा A4, 4 पर्चियां, क्रॉस ✂ कटिंग लाइन्स
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. SECONDARY ACTIONS: BROWSER PRINT & IMAGE DOWNLOADS */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-neutral-100 rounded-xl">
              {/* Browser Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-khand font-bold text-base flex items-center gap-2 shadow-xs transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>
                  ब्राउज़र से सीधा प्रिंट निकालें ({copiesPerPage === 1 ? 'खड़ा Portrait' : 'आड़ा Landscape'})
                </span>
              </button>

              {/* Image Download Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadImage('png')}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-khand font-bold text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="5x7 इंच PNG इमेज (पूरा पैम्फलेट बिना कटे)"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>5x7 PNG डाउनलोड</span>
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadImage('jpeg')}
                  className="px-3 py-2 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-lg font-khand font-bold text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-neutral-600" />
                  <span>JPEG डाउनलोड</span>
                </button>
              </div>
            </div>

            {/* 4. ACTUAL A4 SHEET PREVIEW (NO CSS SCALE OVERLAP) */}
            <div className="border border-neutral-300 rounded-xl p-3 bg-neutral-200/70 overflow-x-auto flex flex-col items-center">
              <div className="w-full text-xs font-bold text-neutral-700 mb-2 flex items-center justify-between font-khand text-sm px-1">
                <span className="flex items-center gap-1 text-neutral-800 font-bold">
                  <Scissors className="w-4 h-4 text-blue-700" />
                  <span>वास्तविक A4 शीट प्रिव्यू (5mm मार्जिन, कोई ओवरलैपिंग नहीं):</span>
                </span>
                <span className="bg-white border border-neutral-300 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-blue-900 shadow-2xs">
                  {copiesPerPage === 1 ? 'A4 Portrait (210 × 297 mm)' : 'A4 Landscape (297 × 210 mm - आड़ा पेज)'}
                </span>
              </div>

              {/* The Actual Simulated A4 Sheet Container */}
              <div
                className={`bg-white shadow-xl border border-neutral-400 transition-all ${
                  copiesPerPage === 1
                    ? 'w-[440px] min-h-[622px]' // Portrait A4 ratio
                    : 'w-[760px] min-h-[536px]' // Landscape A4 ratio
                }`}
                style={{
                  padding: '5mm',
                  boxSizing: 'border-box',
                }}
              >
                {/* LAYOUT 1: SINGLE PORTRAIT */}
                {copiesPerPage === 1 && (
                  <div className="w-full h-full flex justify-center items-center">
                    <div className="w-full max-w-[390px]">
                      <PamphletPreview data={data} isPrintView={true} />
                    </div>
                  </div>
                )}

                {/* LAYOUT 2: 2 PAMPHLETS (5x7 INCH) ON HORIZONTAL A4 WITH ONLY ✂ --- LINE */}
                {copiesPerPage === 2 && (
                  <div className="w-full h-full flex flex-row items-stretch justify-between box-border">
                    {/* Left Pamphlet (5x7 inch) */}
                    <div className="w-[47.5%] flex items-center justify-center p-1">
                      <div className="w-full">
                        <PamphletPreview data={data} isPrintView={true} />
                      </div>
                    </div>

                    {/* ONLY cutting line and scissors in the middle */}
                    <div className="w-[5%] flex flex-col items-center justify-between py-4 select-none relative">
                      <span className="text-base text-neutral-600 font-bold">✂</span>
                      <div className="w-0 border-r-2 border-dashed border-neutral-400 h-full my-2"></div>
                      <span className="text-base text-neutral-600 font-bold">✂</span>
                      <div className="w-0 border-r-2 border-dashed border-neutral-400 h-full my-2"></div>
                      <span className="text-base text-neutral-600 font-bold">✂</span>
                    </div>

                    {/* Right Pamphlet (5x7 inch) */}
                    <div className="w-[47.5%] flex items-center justify-center p-1">
                      <div className="w-full">
                        <PamphletPreview data={data} isPrintView={true} />
                      </div>
                    </div>
                  </div>
                )}

                {/* LAYOUT 4: 4 PAMPHLETS ON HORIZONTAL A4 */}
                {copiesPerPage === 4 && (
                  <div className="w-full h-full grid grid-cols-2 gap-3 p-1 relative">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-center p-0.5">
                        <div className="w-full">
                          <PamphletPreview data={data} isPrintView={true} />
                        </div>
                      </div>
                    ))}

                    {/* Horizontal Cutting Line */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-between px-1 select-none">
                      <span className="text-sm text-neutral-600 font-bold">✂</span>
                      <div className="w-full border-t-2 border-dashed border-neutral-400 mx-1"></div>
                      <span className="text-sm text-neutral-600 font-bold">✂</span>
                    </div>

                    {/* Vertical Cutting Line */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center justify-between py-1 select-none">
                      <span className="text-sm text-neutral-600 font-bold">✂</span>
                      <div className="h-full border-r-2 border-dashed border-neutral-400 my-1"></div>
                      <span className="text-sm text-neutral-600 font-bold">✂</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-4 py-3 bg-neutral-100 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-700">
            <div className="flex items-center gap-1.5 font-devanagari">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>
                प्रिंट सलाह: A4 पर 2 पैम्फलेट के लिए <strong>"A4 PDF डाउनलोड"</strong> बटन दबाएं।
              </span>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-khand font-bold text-sm transition-colors"
            >
              बंद करें
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
