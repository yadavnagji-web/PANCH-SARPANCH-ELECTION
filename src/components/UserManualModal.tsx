import React from 'react';
import { BookOpen, X, CheckCircle, Printer, Move, Sparkles, Upload, Scissors, Vote } from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '1',
      title: 'ग्राम पंचायत का नाम व वार्ड संख्या दर्ज करें',
      icon: <Vote className="w-5 h-5 text-blue-600" />,
      desc: 'सबसे ऊपर "ग्राम पंचायत का नाम" लिखें। स्लाइडर से नाम को जितना चाहें बड़ा या छोटा करें। डिफ़ॉल्ट रूप से कोई बाहरी बॉक्स नहीं है, जिससे यह साफ़ और बोल्ड दिखता है। इसके बाद अपनी वार्ड संख्या दर्ज करें।',
    },
    {
      step: '2',
      title: 'प्रत्याशी का नाम, मोबाइल नंबर व फोटो लगाएं',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      desc: 'प्रत्याशी का नाम बड़े अक्षरों में लिखें (जैसे: संगीता / लालशंकर डाबी)। नाम के नीचे मोबाइल नंबर डालें। पहले कोने में प्रत्याशी की फोटो अपलोड करें। फोटो पर बॉर्डर या फ्रेम लगाना पूरी तरह वैकल्पिक (Optional) है।',
    },
    {
      step: '3',
      title: 'मतपत्र टेबल में पंक्तियाँ (Rows) और प्रत्याशी का नंबर चुनें',
      icon: <Vote className="w-5 h-5 text-purple-600" />,
      desc: 'टेबल में कुल पंक्तियाँ दर्ज करें (जैसे 5 या 10)। इसके बाद प्रत्याशी का टेबल नंबर चुनें (जैसे 3 या 4)। आपके चुनते ही वह बॉक्स स्वतः बड़ा हो जाएगा और उसमें प्रत्याशी का नाम व चुनाव चिन्ह आ जाएगा। शेष पंक्तियों में केवल सरल लाइनें और क्रम संख्या रहेगी।',
    },
    {
      step: '4',
      title: 'चुनाव चिन्ह अपलोड करें या गैलरी से चुनें',
      icon: <Upload className="w-5 h-5 text-amber-600" />,
      desc: 'मतपत्र टेबल में "+ चिन्ह बदलें" बटन पर क्लिक करें। अपने कंप्यूटर या मोबाइल से चुनाव चिन्ह की फोटो (PNG/JPG) अपलोड करें। एक बार अपलोड किया गया चिन्ह गैलरी में हमेशा के लिए सेव रहेगा।',
    },
    {
      step: '5',
      title: 'सभी टेक्स्ट व ऑब्जेक्ट्स को छोटा/बड़ा और दाएं-बाएं-ऊपर-नीचे खिसकाएं',
      icon: <Move className="w-5 h-5 text-indigo-600" />,
      desc: 'डैशबोर्ड में दिए गए "दिशा कंट्रोलर" से आप किसी भी टेक्स्ट (प्रत्याशी नाम, ग्राम पंचायत, वार्ड, मोबाइल, अपील आदि) को चुनकर ऊपर, नीचे, दाएं या बाएं 1-1 पिक्सेल खिसका सकते हैं तथा "- छोटा" या "+ बड़ा" बटन से साइज बदल सकते हैं।',
    },
    {
      step: '6',
      title: 'मतदान मुहर (स्वस्तिक छाप) को ऑन या ऑफ करें',
      icon: <Sparkles className="w-5 h-5 text-rose-600" />,
      desc: 'मतदान मुहर कॉलम में स्वस्तिक छाप दिखाना पूरी तरह ऑप्शनल है। आप चेकबॉक्स से इसे ऑन या ऑफ रख सकते हैं।',
    },
    {
      step: '7',
      title: 'A4 पेपर पर 5x7 इंच साइज में 2 पर्चे प्रिंट करना (5mm मार्जिन व ✂ कटिंग लाइन)',
      icon: <Scissors className="w-5 h-5 text-teal-600" />,
      desc: 'प्रिंट डायलॉग में "A4 पर 2 पर्चे" चुनें। यह पेज को स्वतः आड़ा (Landscape) कर देता है और 5x7 इंच के 2 पर्चे अगल-बगल 5mm मार्जिन के साथ सेट करता है। बीच में केवल हल्की डैश लाइन और कैंची (✂) का निशान आता है जिससे काटने में बहुत आसानी होती है।',
    },
    {
      step: '8',
      title: 'मुद्रक व प्रेस विवरण',
      icon: <Printer className="w-5 h-5 text-blue-700" />,
      desc: 'पैम्फलेट के सबसे नीचे दाईं ओर "Jalad Printers Chikhali,8696312384" लिखा है। यदि आप निवेदक लाइन जोड़ना चाहें तो उसे भी ऑन कर सकते हैं।',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-neutral-800">
        {/* Header */}
        <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-khand font-black text-xl leading-none">
                उपयोगकर्ता निर्देश पुस्तिका (User Manual)
              </h3>
              <p className="text-[11px] text-neutral-300 font-devanagari">
                जलद प्रिंटर्स चिखली - वार्ड पंच चुनाव पैम्फलेट व मतपत्र निर्माता मार्गदर्शिका
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
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 leading-relaxed font-devanagari">
            <strong>नमस्ते!</strong> यह टूल विशेष रूप से वार्ड पंच एवं पंचायत चुनाव प्रचार के लिए उच्च-गुणवत्ता वाले पर्चे और मतपत्र (Ballot Paper) तुरंत तैयार और प्रिंट करने के लिए बनाया गया है। नीचे दिए गए चरणों का पालन करके आप 1 मिनट में पर्चा तैयार कर सकते हैं:
          </div>

          <div className="space-y-2.5">
            {steps.map((item) => (
              <div
                key={item.step}
                className="p-3 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200 rounded-xl transition-colors flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-khand font-black text-lg shrink-0 mt-0.5 border border-blue-200">
                  {item.step}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h4 className="font-khand font-black text-base text-neutral-900 leading-tight">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-devanagari">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Printing Guidelines Box */}
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-1 font-devanagari">
            <span className="font-khand font-bold text-base text-amber-900 block">
              महत्वपूर्ण प्रिंटिंग टिप्स (Important Printing Tips):
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
              <li><strong>सीधा PDF डाउनलोड (अनुशंसित):</strong> सबसे सही व बिना कटे प्रिंट के लिए <strong>"A4 PDF डाउनलोड"</strong> बटन दबाएं। यह Paint में नहीं खुलता और 100% सटीक 5x7 साइज में प्रिंट होता है।</li>
              <li>A4 पर 2 पर्चे प्रिंट करते समय प्रिंटर सेटिंग्स में <strong>Layout: Landscape (आड़ा)</strong> रखें।</li>
              <li>A4 पर 1 पर्चा प्रिंट करते समय प्रिंटर सेटिंग्स में <strong>Layout: Portrait (खड़ा)</strong> रखें।</li>
              <li>Margins को <strong>Minimum (न्यूनतम)</strong> या <strong>Default</strong> रखें ताकि कटिंग गाइडलाइन्स स्पष्ट दिखाई दें।</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span className="font-khand font-bold text-sm text-neutral-700">जलद प्रिंटर्स चिखली | मो. 8696312384</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 text-white rounded-lg font-khand font-bold text-sm hover:bg-neutral-900"
          >
            समझ गया (बंद करें)
          </button>
        </div>
      </div>
    </div>
  );
};
