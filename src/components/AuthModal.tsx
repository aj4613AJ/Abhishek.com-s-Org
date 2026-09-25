import React, { useState } from 'react';
import { Shield, Mail, Phone, Lock, User, ArrowRight, X } from 'lucide-react';
import { UserProfile } from '../types';
import { LanguageMode } from '../i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  language: LanguageMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language,
}) => {
  if (!isOpen) return null;

  const isMr = language === 'mr';
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or mobile
  const [location, setLocation] = useState('Pune, Maharashtra');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmail = identifier.includes('@');
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim() || 'Abhishek Jadhav',
      email: isEmail ? identifier.trim() : 'citizen@echoguard.org',
      phone: !isEmail ? identifier.trim() : '+91 98234 56789',
      location: location.trim() || 'Maharashtra, India',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      language: 'bilingual',
      scansCount: 0,
      reportsCount: 0,
      createdAt: new Date().toISOString(),
    };
    onLoginSuccess(newUser);
    onClose();
  };

  const handleGuestContinue = () => {
    const guestUser: UserProfile = {
      id: 'usr_guest_demo',
      name: 'Abhishek Jadhav',
      email: 'abhijadhav9617@gmail.com',
      phone: '+91 98234 56789',
      location: 'Pune, Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      language: 'bilingual',
      scansCount: 4,
      reportsCount: 3,
      createdAt: '2026-03-15T10:00:00.000Z',
    };
    onLoginSuccess(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Echo<span className="text-emerald-600">Guard</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isMr ? 'पर्यावरण रक्षक नोंदणी' : 'Citizen Environmental Access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h4 className="text-lg font-black text-slate-900">
            {isRegistering
              ? isMr
                ? 'नवीन खाते तयार करा'
                : 'Create Citizen Account'
              : isMr
              ? 'लॉगिन करा'
              : 'Sign in to EchoGuard'}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {isMr
              ? 'प्रदूषण अहवाल नोंदवण्यासाठी मोबाईल किंवा ईमेल वापरा'
              : 'Use your mobile or email to track environmental reports'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Abhishek Jadhav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Mobile Number or Email</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. 9823456789 or user@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {isRegistering && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">City / District</label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isRegistering ? 'Register & Continue' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="grow border-t border-slate-200"></div>
          <span className="shrink mx-3 text-[11px] text-slate-400 font-medium">or</span>
          <div className="grow border-t border-slate-200"></div>
        </div>

        {/* Quick Demo Citizen Login */}
        <button
          onClick={handleGuestContinue}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
        >
          {isMr ? 'डेमो खात्यासह पुढे जा (Abhishek Jadhav)' : 'Continue as Demo Citizen (Abhishek)'}
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            {isRegistering
              ? 'Already registered? Sign In'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
