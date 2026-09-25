import React from 'react';
import { Home, Scan, FileText, User } from 'lucide-react';
import { LanguageMode } from '../i18n';

export type NavTab = 'home' | 'scan' | 'reports' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  reportsCount: number;
  language: LanguageMode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  reportsCount,
  language,
}) => {
  const tabs = [
    {
      id: 'home' as NavTab,
      labelEn: 'Home',
      labelMr: 'मुख्यपृष्ठ',
      icon: Home,
    },
    {
      id: 'scan' as NavTab,
      labelEn: 'Scan',
      labelMr: 'स्कॅन करा',
      icon: Scan,
      isPrimaryAction: true,
    },
    {
      id: 'reports' as NavTab,
      labelEn: 'Reports',
      labelMr: 'अहवाल',
      icon: FileText,
      badge: reportsCount,
    },
    {
      id: 'profile' as NavTab,
      labelEn: 'Profile',
      labelMr: 'प्रोफाइल',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-2xl mx-auto px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isPrimaryAction) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative -top-3 group flex flex-col items-center justify-center focus:outline-hidden transition-transform active:scale-95"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-emerald-600/40 ring-4 ring-emerald-100 scale-105'
                      : 'bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600'
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-emerald-800 mt-1">
                  {language === 'mr' ? tab.labelMr : tab.labelEn}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center rounded-xl transition-all relative focus:outline-hidden ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-emerald-600 stroke-[2.4]' : ''
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span className="text-[11px] mt-1 tracking-tight">
                {language === 'mr'
                  ? tab.labelMr
                  : language === 'bilingual'
                  ? tab.labelEn
                  : tab.labelEn}
              </span>

              {language === 'bilingual' && (
                <span className="text-[9px] text-slate-400 font-normal -mt-0.5">
                  {tab.labelMr}
                </span>
              )}

              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
