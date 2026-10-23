import React, { useState, useRef } from 'react';
import { PamphletData } from '../types.ts';
import {
  FolderOpen,
  X,
  Trash2,
  Edit3,
  Save,
  Download,
  Upload,
  Sparkles,
  Calendar,
  Search,
  Check,
} from 'lucide-react';

export interface SavedProject {
  id: string;
  title: string;
  candidateName: string;
  gramPanchayatName: string;
  wardText: string;
  symbolName: string;
  data: PamphletData;
  thumbnailUrl?: string;
  updatedAt: number;
}

interface SavedProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProjects: SavedProject[];
  onLoadProject: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  onImportProjects: (imported: SavedProject[]) => void;
  onSaveCurrentProject: (customTitle?: string) => void;
  currentCandidateName: string;
}

export const SavedProjectsModal: React.FC<SavedProjectsModalProps> = ({
  isOpen,
  onClose,
  savedProjects,
  onLoadProject,
  onDeleteProject,
  onImportProjects,
  onSaveCurrentProject,
  currentCandidateName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveCurrentWithTitle = () => {
    onSaveCurrentProject(customTitleInput.trim() || undefined);
    setSavedSuccessMsg('✅ डिज़ाइन सफलतापूर्वक सेव हो गई!');
    setCustomTitleInput('');
    setShowNameInput(false);
    setTimeout(() => setSavedSuccessMsg(null), 2500);
  };

  // Export JSON backup file
  const handleExportBackup = () => {
    if (savedProjects.length === 0) {
      alert('एक्सपोर्ट करने के लिए कोई सेव प्रोजेक्ट मौजूद नहीं है।');
      return;
    }
    const jsonStr = JSON.stringify(savedProjects, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wardpanch-projects-backup-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  // Import JSON backup file
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportProjects(parsed);
          setSavedSuccessMsg(`✅ ${parsed.length} सेव की गई डिज़ाइनें इंपोर्ट हो गईं!`);
          setTimeout(() => setSavedSuccessMsg(null), 2500);
        } else {
          alert('अमान्य बैकअप फ़ाइल फ़ॉर्मेट।');
        }
      } catch (err) {
        console.error('Import error:', err);
        alert('फ़ाइल पढ़ने में असमर्थ।');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filtered = savedProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.candidateName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.gramPanchayatName.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-neutral-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-khand font-black text-2xl leading-none tracking-wide text-amber-300">
                सेव की गई डिज़ाइनें (Saved Posters Gallery)
              </h3>
              <p className="text-xs text-neutral-300 font-devanagari mt-0.5">
                पोस्टर को एडिटेबल मोड में सेव करें व भविष्य में कभी भी पुनः एडिट करें
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

        {/* Success Alert Toast */}
        {savedSuccessMsg && (
          <div className="bg-emerald-700 text-white px-4 py-2 font-khand font-bold text-base flex items-center gap-2 justify-center">
            <Check className="w-5 h-5 text-amber-300" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* 1. Quick Save Current Design Box */}
          <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0 shadow-xs">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-khand font-black text-lg text-amber-950 leading-tight">
                  वर्तमान में चल रहे पोस्टर को सेव करें:
                </h4>
                <p className="text-xs text-amber-900 font-devanagari">
                  उम्मीदवार: <strong>{currentCandidateName || 'उम्मीदवार का नाम'}</strong>
                </p>
              </div>
            </div>

            {showNameInput ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={customTitleInput}
                  onChange={(e) => setCustomTitleInput(e.target.value)}
                  placeholder="पोस्टर का टाइटल लिखें..."
                  className="px-3 py-1.5 border border-amber-400 rounded-lg text-sm font-bold font-khand bg-white"
                />
                <button
                  type="button"
                  onClick={handleSaveCurrentWithTitle}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-lg font-khand font-bold text-sm shadow-xs cursor-pointer shrink-0"
                >
                  सेव करें
                </button>
                <button
                  type="button"
                  onClick={() => setShowNameInput(false)}
                  className="px-2 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg text-xs"
                >
                  रद्द
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveCurrentWithTitle()}
                  className="w-full sm:w-auto px-4 py-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-khand font-black text-base rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-neutral-950" />
                  <span>💾 पोस्टर अभी सेव करें (Quick Save)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNameInput(true)}
                  className="px-2.5 py-2 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl font-khand font-bold text-xs cursor-pointer"
                  title="कस्टम नाम के साथ सेव करें"
                >
                  नाम बदलें ✎
                </button>
              </div>
            )}
          </div>

          {/* 2. Search & Backup Actions Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-khand font-black text-xl text-neutral-900">
                सेव किए गए प्रोजेक्ट्स ({savedProjects.length}):
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
                  placeholder="नाम या पंचायत खोजें..."
                  className="pl-8 pr-3 py-1 text-xs font-khand font-bold border border-neutral-300 rounded-lg w-40 focus:ring-1 focus:ring-blue-500"
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

              {/* Import/Export Backup Buttons */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-khand font-bold text-xs flex items-center gap-1 border border-neutral-300 cursor-pointer"
                title="कंप्यूटर/फ़ोन से बैकअप प्रोजेक्ट्स इंपोर्ट करें"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>इंपोर्ट बैकअप</span>
              </button>
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-khand font-bold text-xs flex items-center gap-1 border border-neutral-300 cursor-pointer"
                title="सभी सेव प्रोजेक्ट्स बैकअप फ़ाइल के रूप में डाउनलोड करें"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>एक्सपोर्ट बैकअप</span>
              </button>
            </div>
          </div>

          {/* 3. Saved Projects List / Cards Grid */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
              <p className="font-khand font-black text-lg text-neutral-600">
                कोई सेव प्रोजेक्ट नहीं मिला
              </p>
              <p className="text-xs text-neutral-400 font-devanagari mt-0.5">
                ऊपर 'पोस्टर अभी सेव करें' दबाकर अपनी पहली डिज़ाइन सुरक्षित रखें।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto p-1">
              {filtered.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border-2 border-neutral-200 hover:border-amber-400 rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  <div className="space-y-1.5">
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-1 border-b border-neutral-100 pb-2">
                      <div className="flex-1 min-w-0">
                        <span className="block font-khand font-black text-lg text-neutral-900 truncate leading-tight">
                          {project.title || project.candidateName}
                        </span>
                        <span className="block text-xs font-bold font-khand text-amber-700 truncate">
                          {project.gramPanchayatName || 'ग्राम पंचायत'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteProject(project.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="प्रोजेक्ट डिलीट करें"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content preview details */}
                    <div className="text-xs text-neutral-600 font-devanagari space-y-1">
                      <p className="truncate">
                        📍 {project.wardText || 'वार्ड संख्या ...'}
                      </p>
                      {project.symbolName && (
                        <p className="truncate text-blue-700 font-semibold">
                          🗳️ चिन्ह: {project.symbolName}
                        </p>
                      )}
                      <p className="text-[10px] text-neutral-400 flex items-center gap-1 pt-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(project.updatedAt).toLocaleDateString('hi-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Primary Load / Edit Button */}
                  <div className="mt-3 pt-2 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadProject(project);
                        onClose();
                      }}
                      className="w-full py-2 px-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-khand font-bold text-base rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-amber-300" />
                      <span>✏️ लोड करें व एडिट करें (Edit)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span className="font-devanagari">
            💡 आपकी सेव की गई डिज़ाइनें हमेशा इसी ब्राउज़र में सुरक्षित रहेंगी
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
