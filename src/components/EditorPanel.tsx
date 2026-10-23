import React, { useRef, useState } from 'react';
import { PamphletData, FontFamilyStyle } from '../types.ts';
import { FONT_OPTIONS } from '../data/presets.ts';
import {
  Upload,
  RefreshCw,
  Sparkles,
  Phone,
  Trash2,
  Type,
  Vote,
  User,
  Image as ImageIcon,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sliders,
} from 'lucide-react';

interface EditorPanelProps {
  data: PamphletData;
  onChange: (newData: PamphletData) => void;
  onReset: () => void;
  onOpenSymbolModal: () => void;
}

type TextElementKey =
  | 'gramPanchayat'
  | 'ward'
  | 'candidateName'
  | 'qualities'
  | 'mobile'
  | 'appeal'
  | 'photo'
  | 'topSymbol'
  | 'tableSymbol'
  | 'stamp'
  | 'nivedak';

export const EditorPanel: React.FC<EditorPanelProps> = ({
  data,
  onChange,
  onReset,
  onOpenSymbolModal,
}) => {
  const [activeNudgeElement, setActiveNudgeElement] = useState<TextElementKey>('candidateName');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof PamphletData>(key: K, value: PamphletData[K]) => {
    const updated = { ...data, [key]: value };

    // Auto update appeal slogan if row, symbol, or candidate post title changed
    if (key === 'candidateRow' || key === 'symbolNameText' || key === 'candidatePostTitle') {
      const row = key === 'candidateRow' ? (value as number) : updated.candidateRow;
      const sym = key === 'symbolNameText' ? (value as string) : updated.symbolNameText;
      const post = key === 'candidatePostTitle' ? (value as string) : (updated.candidatePostTitle || 'वार्ड पंच');
      updated.appealHeadline = `को ${post} हेतु ${row} नंबर पर ${sym} के निशान पर मुहर लगाकर भारी मतों से विजयी बनावें ।`;
      if (key === 'candidatePostTitle') {
        updated.matpatraHeading = `${post === 'वार्ड पंच' ? 'पंच' : post} निर्वाचन के लिए मतपत्र का नमूना`;
      }
    }

    onChange(updated);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('candidatePhotoUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Nudge direction helper (Right, Left, Up, Down)
  const nudge = (dx: number, dy: number) => {
    const map: Record<TextElementKey, [keyof PamphletData, keyof PamphletData]> = {
      gramPanchayat: ['gramPanchayatOffsetX', 'gramPanchayatOffsetY'],
      ward: ['wardOffsetX', 'wardOffsetY'],
      candidateName: ['candidateNameOffsetX', 'candidateNameOffsetY'],
      qualities: ['qualitiesOffsetX', 'qualitiesOffsetY'],
      mobile: ['mobileOffsetX', 'mobileOffsetY'],
      appeal: ['appealOffsetX', 'appealOffsetY'],
      photo: ['photoOffsetX', 'photoOffsetY'],
      topSymbol: ['topSymbolOffsetX', 'topSymbolOffsetY'],
      tableSymbol: ['tableSymbolOffsetX', 'tableSymbolOffsetY'],
      stamp: ['stampOffsetX', 'stampOffsetY'],
      nivedak: ['nivedakOffsetX', 'nivedakOffsetY'],
    };

    const [keyX, keyY] = map[activeNudgeElement];
    const currX = (data[keyX] as number) || 0;
    const currY = (data[keyY] as number) || 0;

    onChange({
      ...data,
      [keyX]: currX + dx,
      [keyY]: currY + dy,
    });
  };

  const changeSize = (delta: number) => {
    const sizeMap: Record<TextElementKey, keyof PamphletData> = {
      gramPanchayat: 'gramPanchayatFontSize',
      ward: 'wardFontSize',
      candidateName: 'candidateNameSize',
      qualities: 'qualitiesFontSize',
      mobile: 'mobileFontSize',
      appeal: 'appealFontSize',
      photo: 'photoSize',
      topSymbol: 'topSymbolSize',
      tableSymbol: 'tableSymbolSize',
      stamp: 'stampSize',
      nivedak: 'nivedakFontSize',
    };

    const key = sizeMap[activeNudgeElement];
    const current = (data[key] as number) || 20;
    onChange({
      ...data,
      [key]: Math.max(8, current + delta),
    });
  };

  const resetElementPosition = () => {
    const map: Record<TextElementKey, [keyof PamphletData, keyof PamphletData]> = {
      gramPanchayat: ['gramPanchayatOffsetX', 'gramPanchayatOffsetY'],
      ward: ['wardOffsetX', 'wardOffsetY'],
      candidateName: ['candidateNameOffsetX', 'candidateNameOffsetY'],
      qualities: ['qualitiesOffsetX', 'qualitiesOffsetY'],
      mobile: ['mobileOffsetX', 'mobileOffsetY'],
      appeal: ['appealOffsetX', 'appealOffsetY'],
      photo: ['photoOffsetX', 'photoOffsetY'],
      topSymbol: ['topSymbolOffsetX', 'topSymbolOffsetY'],
      tableSymbol: ['tableSymbolOffsetX', 'tableSymbolOffsetY'],
      stamp: ['stampOffsetX', 'stampOffsetY'],
      nivedak: ['nivedakOffsetX', 'nivedakOffsetY'],
    };
    const [keyX, keyY] = map[activeNudgeElement];
    onChange({
      ...data,
      [keyX]: 0,
      [keyY]: 0,
    });
  };

  const elementsList: { key: TextElementKey; label: string }[] = [
    { key: 'candidateName', label: 'प्रत्याशी का नाम' },
    { key: 'gramPanchayat', label: 'ग्राम पंचायत नाम' },
    { key: 'ward', label: 'वार्ड संख्या' },
    { key: 'qualities', label: 'विशेषताएं / टैगलाइन' },
    { key: 'mobile', label: 'मोबाइल नंबर' },
    { key: 'appeal', label: 'अपील / मुख्य नारा' },
    { key: 'photo', label: 'प्रत्याशी फोटो' },
    { key: 'topSymbol', label: 'ऊपर चुनाव चिन्ह' },
    { key: 'tableSymbol', label: 'टेबल चुनाव चिन्ह' },
    { key: 'stamp', label: 'मतदान मुहर' },
    { key: 'nivedak', label: 'निवेदक लाइन' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-neutral-200 overflow-hidden flex flex-col h-full text-neutral-800">
      {/* Top Header */}
      <div className="bg-neutral-900 text-white p-3 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-amber-400" />
          <h2 className="font-khand font-black text-lg sm:text-xl leading-none tracking-wide">
            पैम्फलेट सेटिंग्स व नियंत्रण
          </h2>
        </div>
        <button
          onClick={onReset}
          type="button"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-neutral-800 font-devanagari"
        >
          <RefreshCw className="w-3 h-3" />
          रीसेट
        </button>
      </div>

      {/* Main Controls List */}
      <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
        {/* ========================================================= */}
        {/* UNIVERSAL TEXT POSITION & SIZE ADJUSTER (Right, Left, Up, Down, Bada, Chota) */}
        {/* ========================================================= */}
        <div className="bg-amber-50/80 p-3 rounded-xl border-2 border-amber-300 space-y-2.5">
          <div className="flex items-center justify-between border-b border-amber-300 pb-1.5">
            <span className="font-khand font-black text-base text-amber-950 flex items-center gap-1.5">
              <Move className="w-4 h-4 text-amber-700" />
              <span>टेक्स्ट छोटा/बड़ा व ऊपर/नीचे/दाएं/बाएं सिस्टम:</span>
            </span>
            <button
              type="button"
              onClick={resetElementPosition}
              className="text-[11px] text-amber-900 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              सेंटर करें
            </button>
          </div>

          {/* Select which element to adjust */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              एडजस्ट करने के लिए टेक्स्ट/ऑब्जेक्ट चुनें:
            </label>
            <select
              value={activeNudgeElement}
              onChange={(e) => setActiveNudgeElement(e.target.value as TextElementKey)}
              className="w-full px-2.5 py-1.5 border-2 border-amber-400 rounded-lg font-khand font-bold text-sm bg-white text-neutral-900 focus:ring-2 focus:ring-amber-500"
            >
              {elementsList.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Controller D-Pad & Size Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Direction Arrows (Right, Left, Up, Down) */}
            <div className="bg-white p-2 rounded-lg border border-amber-200 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-neutral-500 uppercase mb-1">
                दिशा में खिसकाएं (Move)
              </span>
              <div className="grid grid-cols-3 gap-1">
                <div></div>
                <button
                  type="button"
                  onClick={() => nudge(0, -3)}
                  className="w-8 h-8 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center shadow-xs"
                  title="ऊपर (Up)"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div></div>

                <button
                  type="button"
                  onClick={() => nudge(-4, 0)}
                  className="w-8 h-8 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center shadow-xs"
                  title="बाएं (Left)"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-400">
                  +
                </div>
                <button
                  type="button"
                  onClick={() => nudge(4, 0)}
                  className="w-8 h-8 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center shadow-xs"
                  title="दाएं (Right)"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div></div>
                <button
                  type="button"
                  onClick={() => nudge(0, 3)}
                  className="w-8 h-8 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center shadow-xs"
                  title="नीचे (Down)"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div></div>
              </div>
            </div>

            {/* Size +/- Buttons */}
            <div className="bg-white p-2 rounded-lg border border-amber-200 flex flex-col items-center justify-center gap-1.5">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">
                आकार छोटा / बड़ा (Size)
              </span>
              <div className="flex gap-2 w-full justify-center">
                <button
                  type="button"
                  onClick={() => changeSize(-2)}
                  className="flex-1 py-2 rounded bg-neutral-200 hover:bg-neutral-300 font-black text-base text-neutral-900 transition-colors"
                  title="छोटा करें"
                >
                  - छोटा
                </button>
                <button
                  type="button"
                  onClick={() => changeSize(2)}
                  className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 font-black text-base text-white transition-colors"
                  title="बड़ा करें"
                >
                  + बड़ा
                </button>
              </div>
              <span className="text-[10px] text-neutral-500 font-devanagari">
                क्लिक करके मनचाहा साइज करें
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. GRAM PANCHAYAT NAME & SIZING (NO OUTSIDE BOX)         */}
        {/* ========================================================= */}
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-2.5">
          <div className="flex items-center justify-between border-b pb-1">
            <span className="font-khand font-black text-base text-blue-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
              <span>ग्राम पंचायत का नाम (हेडर):</span>
            </span>
            <label className="flex items-center gap-1 text-[11px] text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showGramPanchayatBox}
                onChange={(e) => updateField('showGramPanchayatBox', e.target.checked)}
                className="rounded text-blue-600 w-3.5 h-3.5"
              />
              <span>आउटसाइड बॉक्स</span>
            </label>
          </div>

          <div>
            <input
              type="text"
              value={data.gramPanchayatName}
              onChange={(e) => updateField('gramPanchayatName', e.target.value)}
              placeholder="उदा. ग्राम पंचायत चिखली"
              className="w-full px-2.5 py-1.5 border-2 border-neutral-300 rounded-lg font-khand font-bold text-base focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-neutral-700 text-xs mb-0.5">
              <span>हेडर नाम का आकार (Font Size):</span>
              <span className="text-blue-700 font-mono font-bold">{data.gramPanchayatFontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="60"
              value={data.gramPanchayatFontSize}
              onChange={(e) => updateField('gramPanchayatFontSize', parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. WARD & CANDIDATE DETAILS                              */}
        {/* ========================================================= */}
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-2.5">
          <div className="flex items-center justify-between border-b pb-1">
            <span className="font-khand font-black text-base text-blue-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
              <span>वार्ड व प्रत्याशी जानकारी:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-0.5">
                वार्ड संख्या व क्षेत्र:
              </label>
              <input
                type="text"
                value={data.wardNumberText}
                onChange={(e) => updateField('wardNumberText', e.target.value)}
                placeholder="उदा. वार्ड सं. 12 गुन्दलारा से"
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg font-khand font-bold text-base focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-0.5">
                प्रत्याशी का नाम (बोल्ड):
              </label>
              <input
                type="text"
                value={data.candidateName}
                onChange={(e) => updateField('candidateName', e.target.value)}
                placeholder="उदा. संगीता / लालशंकर डाबी"
                className="w-full px-2.5 py-1.5 border-2 border-neutral-400 rounded-lg font-khand font-black text-lg focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Candidate Name Size Slider */}
          <div>
            <div className="flex justify-between font-bold text-neutral-700 text-xs mb-0.5">
              <span>प्रत्याशी नाम का आकार:</span>
              <span className="text-blue-700 font-mono font-bold">{data.candidateNameSize}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="46"
              value={data.candidateNameSize}
              onChange={(e) => updateField('candidateNameSize', parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Candidate Post / Designation Selection */}
          <div className="pt-2 border-t border-neutral-200 space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              चुनाव पदनाम (Post): जैसे सरपंच, वार्ड पंच...
            </label>
            <div className="flex flex-wrap gap-1">
              {['वार्ड पंच', 'सरपंच', 'जिला परिषद सदस्य', 'प्रधान', 'बीडीसी सदस्य', 'उप-सरपंच'].map((postOption) => (
                <button
                  key={postOption}
                  type="button"
                  onClick={() => updateField('candidatePostTitle', postOption)}
                  className={`px-2 py-1 rounded text-xs font-bold font-khand transition-colors ${
                    (data.candidatePostTitle || 'वार्ड पंच') === postOption
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {postOption}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={data.candidatePostTitle || 'वार्ड पंच'}
              onChange={(e) => updateField('candidatePostTitle', e.target.value)}
              placeholder="उदा. सरपंच, वार्ड पंच, जिला परिषद..."
              className="w-full px-2.5 py-1.5 border-2 border-blue-400 rounded-lg font-khand font-bold text-base focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <span className="text-[10px] text-neutral-500 font-devanagari block">
              सरपंच चुनने पर पोस्टर पर '(सरपंच प्रत्याशी)' और अपील में 'को सरपंच हेतु...' दिखेगा
            </span>
          </div>

          {/* Appeal Slogan Headline */}
          <div className="pt-2 border-t border-neutral-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1 font-khand text-sm">
                <Vote className="w-3.5 h-3.5 text-amber-600" />
                <span>मुख्य चुनाव अपील / नारा (Slogan):</span>
              </label>
              <label className="text-[11px] text-neutral-600 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={data.showAppealHeadline}
                  onChange={(e) => updateField('showAppealHeadline', e.target.checked)}
                  className="mr-1 text-blue-600 rounded"
                />
                <span>अपील पट्टी दिखाएं</span>
              </label>
            </div>
            <textarea
              rows={2}
              value={data.appealHeadline}
              onChange={(e) => updateField('appealHeadline', e.target.value)}
              placeholder="उदा. को सरपंच हेतु 3 नंबर पर अलमारी के निशान पर मुहर लगाकर भारी मतों से विजयी बनावें ।"
              className="w-full px-2.5 py-1.5 border-2 border-amber-300 rounded-lg text-xs font-bold font-devanagari bg-amber-50/50 focus:ring-2 focus:ring-amber-500 text-neutral-900"
            />
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-neutral-600">अपील का आकार:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="11"
                  max="24"
                  value={data.appealFontSize || 16}
                  onChange={(e) => updateField('appealFontSize', parseInt(e.target.value))}
                  className="w-28 accent-amber-600"
                />
                <span className="font-mono font-bold text-amber-900">{data.appealFontSize || 16}px</span>
              </div>
            </div>
          </div>

          {/* Mobile number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-neutral-200">
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-neutral-500" />
                  <span>मोबाइल नंबर:</span>
                </label>
                <label className="text-[11px] text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.showMobileNumber}
                    onChange={(e) => updateField('showMobileNumber', e.target.checked)}
                    className="mr-1"
                  />
                  <span>दिखाएं</span>
                </label>
              </div>
              <input
                type="text"
                value={data.mobileNumber}
                onChange={(e) => updateField('mobileNumber', e.target.value)}
                placeholder="मो. 7690811153, 9772193791"
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg font-khand font-bold text-base bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-xs font-bold text-neutral-700">
                  प्रत्याशी विवरण:
                </label>
                <label className="text-[11px] text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.showQualities}
                    onChange={(e) => updateField('showQualities', e.target.checked)}
                    className="mr-1"
                  />
                  <span>दिखाएं</span>
                </label>
              </div>
              <input
                type="text"
                value={data.qualitiesText}
                onChange={(e) => updateField('qualitiesText', e.target.value)}
                placeholder="सरल, सेवाभावी, कर्मठ प्रत्याशी"
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. CANDIDATE PHOTO (OPTIONAL FRAME/OUTLINE & MOVEABLE)   */}
        {/* ========================================================= */}
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-2.5">
          <div className="flex items-center justify-between border-b pb-1">
            <span className="font-khand font-black text-base text-blue-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
              <span>प्रत्याशी फोटो (कोने में):</span>
            </span>

            {/* Frame Optional Checkbox */}
            <label className="flex items-center gap-1.5 text-xs font-bold text-blue-900 cursor-pointer bg-white px-2 py-0.5 rounded border border-neutral-200">
              <input
                type="checkbox"
                checked={data.showPhotoBorder}
                onChange={(e) => updateField('showPhotoBorder', e.target.checked)}
                className="rounded text-blue-600 w-4 h-4"
              />
              <span>आउटलाइन / फ्रेम लगाएं</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-16 rounded bg-white border border-neutral-300 flex items-center justify-center overflow-hidden shrink-0">
              {data.candidatePhotoUrl ? (
                <img
                  src={data.candidatePhotoUrl}
                  alt="Candidate"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <User className="w-6 h-6 text-neutral-300" />
              )}
            </div>

            <div className="flex-1 space-y-1.5">
              <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  फोटो चुनें
                </button>
                {data.candidatePhotoUrl && (
                  <button
                    type="button"
                    onClick={() => updateField('candidatePhotoUrl', null)}
                    className="px-2 py-1.5 bg-neutral-200 hover:bg-red-100 text-neutral-700 hover:text-red-700 rounded text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    हटाएं
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-600">फोटो का आकार:</span>
                <input
                  type="range"
                  min="80"
                  max="150"
                  value={data.photoSize}
                  onChange={(e) => updateField('photoSize', parseInt(e.target.value))}
                  className="w-28 accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. CHUNAV CHINH (OPTIONAL OUTLINE BOX & SAVED GALLERY)    */}
        {/* ========================================================= */}
        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-300 space-y-2.5">
          <div className="flex items-center justify-between border-b border-amber-200 pb-1">
            <span className="font-khand font-black text-base text-amber-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">4</span>
              <span>चुनाव चिन्ह (Chunav Chinh):</span>
            </span>

            {/* Outline Box Optional */}
            <label className="flex items-center gap-1.5 text-xs font-bold text-amber-900 cursor-pointer bg-white px-2 py-0.5 rounded border border-amber-300">
              <input
                type="checkbox"
                checked={data.showTopSymbolBox}
                onChange={(e) => updateField('showTopSymbolBox', e.target.checked)}
                className="rounded text-amber-600 w-4 h-4"
              />
              <span>आउटलाइन बॉक्स</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-white border-2 border-amber-400 flex items-center justify-center p-1 shrink-0">
              {data.currentSymbolUrl ? (
                <img
                  src={data.currentSymbolUrl}
                  alt={data.symbolNameText}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-neutral-400" />
              )}
            </div>

            <div className="flex-1 space-y-1.5">
              <button
                type="button"
                onClick={onOpenSymbolModal}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-khand font-bold text-base flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>+ चुनाव चिन्ह अपलोड करें या चुनें</span>
              </button>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800">
                  चिन्ह: <strong className="text-amber-900">{data.symbolNameText}</strong>
                </span>
                <span className="text-[10px] text-neutral-500 font-devanagari">
                  गैलरी में सेव रहता है
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. MATPATRA TABLE (SIMPLE ROWS, OPTIONAL STAMP)           */}
        {/* ========================================================= */}
        <div className="bg-blue-50/70 p-3 rounded-xl border-2 border-blue-200 space-y-3">
          <div className="flex items-center justify-between border-b border-blue-200 pb-1">
            <span className="font-khand font-black text-base text-blue-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">5</span>
              <span>मतपत्र टेबल (Ballot Paper Table):</span>
            </span>
            <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
              {data.candidateRow} नंबर बॉक्स बड़ा
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Total Rows */}
            <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                टेबल में कुल पंक्तियाँ (5 या 10 भरें):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  max="16"
                  value={data.totalRows}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 2;
                    updateField('totalRows', val);
                    if (data.candidateRow > val) updateField('candidateRow', val);
                  }}
                  className="w-16 px-2 py-1.5 border-2 border-neutral-400 rounded-md font-khand font-black text-xl text-center focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-1">
                  {[5, 7, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        updateField('totalRows', num);
                        if (data.candidateRow > num) updateField('candidateRow', num);
                      }}
                      className={`px-2 py-1 rounded text-xs font-bold font-khand ${
                        data.totalRows === num
                          ? 'bg-blue-700 text-white'
                          : 'bg-neutral-100 border border-neutral-300 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {num} रो
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Candidate Table Number */}
            <div className="bg-white p-2.5 rounded-lg border-2 border-blue-400">
              <label className="block text-xs font-bold text-blue-900 mb-1">
                प्रत्याशी का टेबल नंबर (बड़ा बॉक्स):
              </label>
              <select
                value={data.candidateRow}
                onChange={(e) => updateField('candidateRow', parseInt(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 border-2 border-blue-600 rounded-md font-khand font-black text-lg bg-white text-blue-950 focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: data.totalRows }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    क्रमांक {num} (यह बॉक्स बड़ा होगा)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Row Buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] font-bold text-neutral-700 mr-1">नंबर चुनें:</span>
            {Array.from({ length: data.totalRows }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => updateField('candidateRow', num)}
                className={`w-8 h-8 rounded-md font-khand font-black text-base flex items-center justify-center transition-all ${
                  data.candidateRow === num
                    ? 'bg-blue-700 text-white ring-2 ring-blue-400 scale-105'
                    : 'bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Candidate Box Height Slider */}
          <div>
            <div className="flex justify-between font-bold text-neutral-800 text-xs mb-0.5">
              <span>उम्मीदवार बॉक्स की ऊंचाई (Box Height):</span>
              <span className="text-blue-700 font-mono font-bold">{data.candidateRowHeight}px</span>
            </div>
            <input
              type="range"
              min="75"
              max="160"
              value={data.candidateRowHeight}
              onChange={(e) => updateField('candidateRowHeight', parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Optional Voting Stamp Checkbox */}
          <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="font-khand font-bold text-sm block text-neutral-900">
                मतदान मुहर (स्वस्तिक छाप):
              </span>
              <span className="text-[11px] text-neutral-500 font-devanagari">
                उम्मीदवार के कॉलम में मुहर का निशान
              </span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs bg-neutral-100 px-2.5 py-1 rounded">
              <input
                type="checkbox"
                checked={data.showStampMark}
                onChange={(e) => updateField('showStampMark', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>{data.showStampMark ? 'मुहर चालू' : 'मुहर बंद'}</span>
            </label>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. FONTS & TYPOGRAPHY SYSTEM (Google Khand & others)      */}
        {/* ========================================================= */}
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-2.5">
          <div className="flex items-center gap-1.5 border-b pb-1 font-khand font-black text-base text-neutral-900">
            <Type className="w-4 h-4 text-neutral-600" />
            <span>फ़ॉन्ट स्टाइल व टाइपोग्राफी (Font Style):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateField('fontFamily', f.id)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  data.fontFamily === f.id
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/30 font-bold'
                    : 'border-neutral-200 bg-white hover:bg-neutral-100'
                }`}
              >
                <span className={`block text-xs text-neutral-900 ${f.preview}`}>
                  {f.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 7. OPTIONAL FOOTER, NIVEDAK & MUDRAK (Jalad Printers)     */}
        {/* ========================================================= */}
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-2.5">
          <span className="font-khand font-black text-base text-neutral-900 block border-b pb-1">
            फुटर, निवेदक व मुद्रक सेटिंग्स (Optional):
          </span>

          {/* Nivedak Optional Toggle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800">
                निवेदक लाइन (Optional):
              </label>
              <label className="text-[11px] font-semibold text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showNivedak}
                  onChange={(e) => updateField('showNivedak', e.target.checked)}
                  className="mr-1"
                />
                <span>निवेदक दिखाएं</span>
              </label>
            </div>
            {data.showNivedak && (
              <input
                type="text"
                value={data.nivedakText}
                onChange={(e) => updateField('nivedakText', e.target.value)}
                placeholder="निवेदक: समस्त ग्रामवासी एवं मित्र मंडल"
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs bg-white font-khand font-bold text-sm"
              />
            )}
          </div>

          {/* User Custom Footer Note (Optional) */}
          <div className="space-y-1 pt-1 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800">
                अतिरिक्त फुटर नोट (Optional):
              </label>
              <label className="text-[11px] font-semibold text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showCustomFooterNote}
                  onChange={(e) => updateField('showCustomFooterNote', e.target.checked)}
                  className="mr-1"
                />
                <span>नोट दिखाएं</span>
              </label>
            </div>
            {data.showCustomFooterNote && (
              <input
                type="text"
                value={data.customFooterNote}
                onChange={(e) => updateField('customFooterNote', e.target.value)}
                placeholder="उदा. नोट: मतदान दिनांक 15 मार्च 2026 को अवश्य करें"
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs bg-white font-devanagari"
              />
            )}
          </div>

          {/* Mudrak Credit: Jalad Printers Chikhali,8696312384 */}
          <div className="space-y-1 pt-1 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800">
                मुद्रक का नाम:
              </label>
              <label className="text-[11px] font-semibold text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showMudrak}
                  onChange={(e) => updateField('showMudrak', e.target.checked)}
                  className="mr-1"
                />
                <span>मुद्रक दिखाएं</span>
              </label>
            </div>
            <input
              type="text"
              value={data.printerText}
              onChange={(e) => updateField('printerText', e.target.value)}
              placeholder="Jalad Printers Chikhali,8696312384"
              className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs bg-white font-mono font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
