import React from 'react';
import { PamphletData } from '../types.ts';
import { SwastikStamp } from './SwastikStamp.tsx';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface PamphletPreviewProps {
  data: PamphletData;
  previewRef?: React.Ref<HTMLDivElement>;
  isPrintView?: boolean;
  isExportNode?: boolean;
  onOpenSymbolModal?: () => void;
}

export const PamphletPreview: React.FC<PamphletPreviewProps> = ({
  data,
  previewRef,
  isPrintView = false,
  isExportNode = false,
  onOpenSymbolModal,
}) => {
  // Theme ink color classes
  const themeClasses = {
    classic_black: {
      text: 'text-black',
      border: 'border-black',
      stampColor: '#000000',
    },
    press_blue: {
      text: 'text-blue-950',
      border: 'border-blue-900',
      stampColor: '#1e3a8a',
    },
    vermilion_red: {
      text: 'text-red-950',
      border: 'border-red-900',
      stampColor: '#991b1b',
    },
    panchayat_green: {
      text: 'text-emerald-950',
      border: 'border-emerald-900',
      stampColor: '#065f46',
    },
  }[data.theme || 'classic_black'];

  // Font family class
  const fontClass = {
    khand: 'font-khand',
    yatra: 'font-yatra',
    noto: 'font-devanagari',
    hind: 'font-sans',
    rozha: 'font-rozha',
  }[data.fontFamily || 'khand'];

  // Ballot Paper Background color
  const ballotBgColor = {
    white: 'bg-white',
    pink: 'bg-pink-50/75',
    cream: 'bg-amber-50/40',
  }[data.ballotPaperColor || 'white'];

  // Rows logic
  const totalRowCount = Math.max(2, Math.min(20, data.totalRows || 5));
  const candidateRowIndex = Math.max(1, Math.min(totalRowCount, data.candidateRow || 1));
  const rows = Array.from({ length: totalRowCount }, (_, i) => i + 1);

  // Render election symbol graphic
  const renderSymbolGraphic = (sizePx: number) => {
    if (data.currentSymbolUrl) {
      return (
        <img
          src={data.currentSymbolUrl}
          alt={data.symbolNameText}
          style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
          className="object-contain"
        />
      );
    }
    return (
      <div
        style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
        className="flex flex-col items-center justify-center text-neutral-400 border border-dashed border-neutral-300 rounded p-1"
      >
        <ImageIcon className="w-5 h-5 mb-0.5 text-neutral-300" />
        <span className="text-[8px] font-bold font-devanagari leading-tight">चिन्ह लगाएं</span>
      </div>
    );
  };

  return (
    <div
      ref={previewRef}
      className={`pamphlet-print-container relative mx-auto select-none bg-white w-full h-full flex flex-col ${themeClasses.text} ${fontClass} ${
        isExportNode ? '' : 'transition-all duration-150'
      }`}
      style={{
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        boxSizing: 'border-box',
        transition: isExportNode ? 'none' : undefined,
      }}
    >
      {/* Outer Border Box matching authentic Indian election A4 pamphlet */}
      <div
        className={`relative border-[3px] sm:border-[4px] ${themeClasses.border} ${
          isExportNode ? 'p-3 m-0 shadow-none' : 'p-2.5 sm:p-4 my-0 shadow-md'
        } bg-white print:shadow-none print:m-0 print:border-[3px] flex-1 flex flex-col justify-between h-full`}
        style={{
          boxSizing: 'border-box',
          height: '100%',
        }}
      >
        {/* Subtle decorative inner corner brackets */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-current opacity-40 pointer-events-none"></div>
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-current opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-current opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-current opacity-40 pointer-events-none"></div>

        {/* TOP FIXED SECTIONS (Panchayat Name, Candidate Profile & Symbol, Appeal Slogan) */}
        <div className="shrink-0 flex flex-col gap-1 sm:gap-1.5">
          {/* 1. TOP GRAM PANCHAYAT NAME (NO outside box, moveable & resizable) */}
          <div
            className={`text-center ${
              data.showGramPanchayatBox
                ? `border-2 ${themeClasses.border} py-1 px-3`
                : 'py-0.5 px-1'
            }`}
          >
            <h1
              className="font-black tracking-tight leading-[1.25] uppercase break-words"
              style={{
                fontSize: `${data.gramPanchayatFontSize || 38}px`,
                transform: `translate(${data.gramPanchayatOffsetX || 0}px, ${data.gramPanchayatOffsetY || 0}px)`,
              }}
            >
              {data.gramPanchayatName || 'ग्राम पंचायत चिखली'}
            </h1>
            {data.showSubHeaderBadge && data.subHeaderBadge && (
              <div
                className="font-bold tracking-wider text-neutral-700 uppercase mt-0.5 leading-[1.3] break-words"
                style={{
                  fontSize: `${data.subHeaderFontSize || 12}px`,
                  transform: `translate(${data.subHeaderOffsetX || 0}px, ${data.subHeaderOffsetY || 0}px)`,
                }}
              >
                {data.subHeaderBadge}
              </div>
            )}
          </div>

          {/* 2. CANDIDATE PROFILE & ELECTION SYMBOL SECTION */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 py-1">
            {/* First Corner: Candidate Photo (Moveable, Resizable & Frame Optional) */}
            <div
              className="shrink-0 flex flex-col items-center"
              style={{
                transform: `translate(${data.photoOffsetX || 0}px, ${data.photoOffsetY || 0}px)`,
              }}
            >
              <div
                className={`relative overflow-hidden bg-neutral-100 flex items-center justify-center shadow-2xs ${
                  data.showPhotoBorder
                    ? data.photoFrameStyle === 'double'
                      ? `border-4 border-double ${themeClasses.border}`
                      : data.photoFrameStyle === 'garland'
                      ? `border-2 border-dashed border-amber-600`
                      : `border-2 ${themeClasses.border}`
                    : 'border-0'
                }`}
                style={{
                  width: `${(data.photoSize || 110) * 0.9}px`,
                  height: `${(data.photoSize || 110) * 1.1}px`,
                }}
              >
                {data.candidatePhotoUrl ? (
                  <img
                    src={data.candidatePhotoUrl}
                    alt={data.candidateName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-1 text-center text-neutral-400">
                    <svg className="w-8 h-8 text-neutral-300 mb-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="text-[8px] font-bold leading-tight font-devanagari">फोटो</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight text-neutral-700 mt-0.5 uppercase">
                प्रत्याशी
              </span>
            </div>

            {/* Middle: Ward No, Qualities & Candidate Name (Moveable & Resizable) */}
            <div className="flex-1 px-2 text-center flex flex-col items-center justify-center min-w-0 gap-1 sm:gap-1.5">
              {/* Ward text */}
              <div
                className="font-bold tracking-wide text-neutral-900 leading-[1.25] break-words"
                style={{
                  fontSize: `${data.wardFontSize || 18}px`,
                  transform: `translate(${data.wardOffsetX || 0}px, ${data.wardOffsetY || 0}px)`,
                }}
              >
                {data.wardNumberText || 'वार्ड संख्या ...... से'}
              </div>

              {/* Political party / affiliation (optional) */}
              {data.partyOrTagline && (
                <div
                  className="font-bold text-neutral-800 leading-[1.25] break-words"
                  style={{
                    fontSize: `${data.partyFontSize || 12}px`,
                    transform: `translate(${data.partyOffsetX || 0}px, ${data.partyOffsetY || 0}px)`,
                  }}
                >
                  {data.partyOrTagline}
                </div>
              )}

              {/* Qualities text (optional) */}
              {data.showQualities && (
                <div
                  className="text-neutral-700 font-semibold leading-[1.3] max-w-[340px] break-words"
                  style={{
                    fontSize: `${data.qualitiesFontSize || 13}px`,
                    transform: `translate(${data.qualitiesOffsetX || 0}px, ${data.qualitiesOffsetY || 0}px)`,
                  }}
                >
                  {data.qualitiesText || 'सरल, सेवाभावी, कर्मठ, ईमानदार प्रत्याशी'}
                </div>
              )}

              {/* Bold Candidate Name (Moveable & Resizable) */}
              <div
                className="my-0.5 max-w-full"
                style={{
                  transform: `translate(${data.candidateNameOffsetX || 0}px, ${data.candidateNameOffsetY || 0}px)`,
                }}
              >
                <h2
                  className="font-black leading-[1.25] tracking-tight uppercase break-words"
                  style={{ fontSize: `${data.candidateNameSize || 30}px` }}
                >
                  {data.candidateName || 'उम्मीदवार का नाम'}
                </h2>
              </div>

              {/* Mobile number under candidate name */}
              {data.showMobileNumber && (
                <div
                  className="font-bold tracking-wider text-neutral-800 flex items-center gap-1 justify-center leading-snug"
                  style={{
                    fontSize: `${data.mobileFontSize || 13}px`,
                    transform: `translate(${data.mobileOffsetX || 0}px, ${data.mobileOffsetY || 0}px)`,
                  }}
                >
                  <span>{data.mobileNumber || 'मो. 98XXXXXXXX'}</span>
                </div>
              )}
            </div>

            {/* Right Corner: Election Symbol Box (Moveable, Resizable & Outline Optional) */}
            <div
              className="shrink-0 flex flex-col items-center justify-center text-center"
              style={{
                transform: `translate(${data.topSymbolOffsetX || 0}px, ${data.topSymbolOffsetY || 0}px)`,
              }}
            >
              <div
                onClick={() => onOpenSymbolModal && onOpenSymbolModal()}
                className={`flex flex-col items-center justify-center p-0.5 rounded-lg cursor-pointer transition-all group ${
                  data.showTopSymbolBox
                    ? 'border-2 border-neutral-400 bg-neutral-50/70'
                    : 'border-0 bg-transparent'
                }`}
                style={{
                  width: `${(data.topSymbolSize || 68) * 1.15}px`,
                  height: `${(data.topSymbolSize || 68) * 1.15}px`,
                }}
                title="चुनाव चिन्ह बदलने के लिए क्लिक करें"
              >
                {renderSymbolGraphic(data.topSymbolSize || 68)}
                {!isPrintView && !isExportNode && (
                  <span className="text-[9px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity font-devanagari no-print">
                    बदलें ✎
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-center leading-normal">
                <span className="block text-[10px] text-neutral-500 font-bold uppercase">
                  चुनाव चिन्ह
                </span>
                <span className="block text-xs sm:text-sm font-black text-neutral-900 leading-tight">
                  {data.symbolNameText || 'चिन्ह'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. APPEAL / SLOGAN LINE */}
          {data.showAppealHeadline && (
            <div className={`mt-1.5 py-0.5 px-1.5 border-y-2 ${themeClasses.border} text-center bg-neutral-50/80`}>
              <p
                className="font-bold leading-snug text-neutral-950"
                style={{
                  fontSize: `${data.appealFontSize || 16}px`,
                  transform: `translate(${data.appealOffsetX || 0}px, ${data.appealOffsetY || 0}px)`,
                }}
              >
                {data.appealHeadline || (
                  <>
                    को {data.candidatePostTitle || 'वार्ड पंच'} हेतु <span className="underline font-black">{candidateRowIndex} नंबर</span> पर{' '}
                    <span className="underline font-black">{data.symbolNameText}</span> के निशान पर मुहर लगाकर भारी मतों से विजयी बनावें ।
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* 4. THE MATPATRA / BALLOT PAPER TABLE (AUTO-EXPANDS TO OCCUPY ALL REMAINING A4 SPACE) */}
        <div className="flex-1 flex flex-col my-1 sm:my-1.5 min-h-0">
          <div className={`border-[2px] ${themeClasses.border} rounded-xs overflow-hidden ${ballotBgColor} flex-1 flex flex-col justify-between h-full`}>
            {/* Ballot Paper Header Banner */}
            <div className="bg-neutral-100 border-b border-current px-2.5 py-0.5 shrink-0 flex items-center justify-between text-xs font-bold leading-normal">
              <div>
                <span
                  className="font-black text-sm"
                  style={{ fontSize: `${data.matpatraHeadingFontSize || 14}px` }}
                >
                  {data.matpatraHeading || `${data.candidatePostTitle === 'वार्ड पंच' ? 'पंच' : (data.candidatePostTitle || 'पंच')} निर्वाचन के लिए मतपत्र का नमूना`}
                </span>
                <span className="text-[10px] text-neutral-600 font-devanagari ml-1.5 font-normal">
                  (मतपत्र: {data.ballotPaperColor === 'pink' ? 'गुलाबी' : 'सफेद'})
                </span>
              </div>
              <div className="text-right text-xs text-neutral-700 whitespace-nowrap">
                <span>वार्ड सं. {data.wardNumberText?.replace(/[^0-9]/g, '') || candidateRowIndex}</span>
              </div>
            </div>

            {/* Table Column Titles */}
            <div className="grid grid-cols-12 bg-neutral-200/90 border-b border-current text-[11px] font-bold text-center py-0.5 shrink-0 uppercase">
              <div className="col-span-2 border-r border-current">क. सं.</div>
              <div className="col-span-5 border-r border-current">अभ्यर्थी का नाम</div>
              <div className="col-span-5">चुनाव चिन्ह एवं मतदान मुहर</div>
            </div>

            {/* Dynamically Generated Rows (each row flex-1 so all vertical space is completely filled) */}
            <div className="flex-1 flex flex-col min-h-0">
              {rows.map((rowNum, idx) => {
                const isCandidateRow = rowNum === candidateRowIndex;
                const isLastRow = idx === rows.length - 1;

                return (
                  <div
                    key={rowNum}
                    className={`grid grid-cols-12 items-center transition-all overflow-hidden ${
                      !isLastRow ? (isCandidateRow ? 'border-b-2 border-current' : 'border-b border-current') : ''
                    } ${
                      isCandidateRow
                        ? 'flex-[1.8] min-h-[85px] bg-amber-50/50 font-bold'
                        : 'flex-1 min-h-[40px] bg-white text-neutral-400'
                    }`}
                  >
                    {/* Column 1: Serial Number */}
                    <div
                      className={`col-span-2 text-center border-r border-current flex items-center justify-center self-stretch h-full ${
                        isCandidateRow
                          ? 'text-3xl sm:text-4xl font-black text-neutral-950 bg-neutral-100/90'
                          : 'text-sm font-bold text-neutral-800'
                      }`}
                    >
                      {rowNum}
                    </div>

                    {/* Column 2: Candidate Name + Insert Chinh button */}
                    <div
                      className={`col-span-5 px-2.5 py-1 border-r border-current self-stretch h-full flex items-center ${
                        isCandidateRow ? 'justify-between' : 'justify-center'
                      }`}
                    >
                      {isCandidateRow ? (
                        <div className="text-left w-full overflow-hidden">
                          <span
                            className="block font-black text-neutral-950 leading-snug break-words"
                            style={{ fontSize: `${Math.min(26, (data.candidateNameSize || 30) * 0.72)}px` }}
                          >
                            {data.candidateName || 'उम्मीदवार का नाम'}
                          </span>
                          <div className="flex items-center justify-between gap-1 mt-0.5">
                            <span className="text-[10px] text-neutral-700 font-bold font-devanagari">
                              ({data.candidatePostTitle || 'वार्ड पंच'} प्रत्याशी)
                            </span>
                            {!isPrintView && !isExportNode && (
                              <button
                                type="button"
                                onClick={() => onOpenSymbolModal && onOpenSymbolModal()}
                                className="no-print text-[9px] bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors cursor-pointer"
                                title="चुनाव चिन्ह बदलें"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>+ चिन्ह</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full border-b border-dashed border-neutral-300 my-auto h-0" />
                      )}
                    </div>

                    {/* Merged Column 3 & 4: Election Symbol + Voting Stamp (No vertical dividing line) */}
                    <div
                      onClick={() => isCandidateRow && onOpenSymbolModal && onOpenSymbolModal()}
                      className={`col-span-5 self-stretch h-full flex items-center justify-around px-2 p-0.5 ${
                        isCandidateRow ? 'cursor-pointer hover:bg-amber-100/40' : ''
                      }`}
                      title={isCandidateRow ? 'चिन्ह बदलने के लिए क्लिक करें' : ''}
                    >
                      {isCandidateRow ? (
                        <>
                          <div
                            className="flex flex-col items-center justify-center"
                            style={{
                              transform: `translate(${data.tableSymbolOffsetX || 0}px, ${data.tableSymbolOffsetY || 0}px)`,
                            }}
                          >
                            {renderSymbolGraphic(data.tableSymbolSize || 64)}
                            <span className="text-[10px] font-bold text-neutral-900 mt-0.5 leading-tight">
                              {data.symbolNameText}
                            </span>
                          </div>

                          {data.showStampMark && (
                            <div
                              style={{
                                transform: `translate(${data.stampOffsetX || 0}px, ${data.stampOffsetY || 0}px)`,
                              }}
                            >
                              <SwastikStamp
                                size={data.stampSize || 52}
                                color={themeClasses.stampColor}
                                rotation={-6}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-around opacity-30">
                          <div className="w-6 h-6 rounded-full border border-dashed border-neutral-300" />
                          <div className="w-5 h-5 rounded-full border border-neutral-300" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Optional NOTA Row */}
              {data.showNotaRow && (
                <div className="grid grid-cols-12 items-center min-h-[28px] bg-neutral-50 border-t-2 border-current text-[11px] font-bold text-neutral-700 shrink-0">
                  <div className="col-span-2 text-center border-r border-current py-0.5 font-black">NOTA</div>
                  <div className="col-span-5 px-2 border-r border-current py-0.5">नोटा (इनमें से कोई नहीं)</div>
                  <div className="col-span-5 text-center flex items-center justify-around font-black text-neutral-600 py-0.5">
                    <span>✕</span>
                    <span className="opacity-30">◯</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. FOOTER DETAILS: Nivedak (Optional), Custom Footer Note (Optional), Mudrak (Jalad Printers) */}
        <div className="shrink-0 mt-1 pt-1 border-t border-neutral-300 space-y-0.5 text-xs font-bold text-neutral-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1">
            {/* Optional Nivedak */}
            {data.showNivedak && (
              <div
                style={{
                  fontSize: `${data.nivedakFontSize || 12}px`,
                  transform: `translate(${data.nivedakOffsetX || 0}px, ${data.nivedakOffsetY || 0}px)`,
                }}
              >
                {data.nivedakText || 'निवेदक: समस्त ग्रामवासी एवं मित्र मंडल'}
              </div>
            )}

            {/* Mudrak Credit: Jalad Printers Chikhali,8696312384 */}
            {data.showMudrak && (
              <div
                className="font-mono text-neutral-700 ml-auto"
                style={{
                  fontSize: `${data.printerFontSize || 10}px`,
                  transform: `translate(${data.printerOffsetX || 0}px, ${data.printerOffsetY || 0}px)`,
                }}
              >
                मुद्रक: {data.printerText || 'Jalad Printers Chikhali,8696312384'}
              </div>
            )}
          </div>

          {/* Optional Custom Footer Note */}
          {data.showCustomFooterNote && data.customFooterNote && (
            <div
              className="text-neutral-600 text-center font-normal italic pt-0.5"
              style={{ fontSize: `${data.customFooterFontSize || 11}px` }}
            >
              {data.customFooterNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
