import React from 'react';
import { Shield, Sparkles, Globe, User } from 'lucide-react';
import { UserProfile } from '../types';
import { LanguageMode } from '../i18n';

interface HeaderProps {
  user: UserProfile;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  language,
  onLanguageChange,
  onProfileClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            {/* Environmental Shield + Leaf Icon */}
            <Shield className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                Echo<span className="text-emerald-600">Guard</span>
              </h1>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 line-clamp-1 mt-0.5">
              {language === 'mr'
                ? 'प्रदूषण ओळखा. समजून घ्या. अहवाल नोंदवा.'
                : 'See Pollution. Understand It. Report It.'}
            </p>
          </div>
        </div>

        {/* Right Controls: Language Selector & User Profile */}
        <div className="flex items-center gap-2">
          {/* Bilingual Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('bilingual')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'bilingual'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
              title="Bilingual: English + मराठी"
            >
              EN+मराठी
            </button>
            <button
              onClick={() => onLanguageChange('mr')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'mr'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
              title="मराठी (Marathi)"
            >
              मराठी
            </button>
          </div>

          {/* User Avatar Button */}
          <button
            onClick={onProfileClick}
            className="flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-emerald-500/30 overflow-hidden hover:ring-emerald-500 transition-all cursor-pointer focus:outline-hidden"
            title="User Profile"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
