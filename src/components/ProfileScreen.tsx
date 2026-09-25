import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit2,
  LogOut,
  Shield,
  FileText,
  Scan,
  Database,
  ExternalLink,
  Check,
  Copy,
  Info,
  Globe,
} from 'lucide-react';
import { UserProfile } from '../types';
import { LanguageMode } from '../i18n';
import {
  saveUserProfile,
  saveCustomSupabaseConfig,
  getStoredSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
} from '../services/storage';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onLogout,
  language,
  onLanguageChange,
}) => {
  const isMr = language === 'mr';

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [location, setLocation] = useState(user.location);
  const [avatar, setAvatar] = useState(user.avatar);

  // Supabase Settings Drawer/Modal State
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const storedConfig = getStoredSupabaseConfig();
  const [sbUrl, setSbUrl] = useState(storedConfig?.url || '');
  const [sbKey, setSbKey] = useState(storedConfig?.anonKey || '');
  const [sbSuccessMsg, setSbSuccessMsg] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      avatar,
    };
    saveUserProfile(updated);
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseConfig(sbUrl.trim(), sbKey.trim());
    setSbSuccessMsg(sbUrl ? 'Supabase configuration saved!' : 'Switched to local offline storage.');
    setTimeout(() => setSbSuccessMsg(''), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {isMr ? 'वापरकर्ता प्रोफाइल' : 'User Profile'}
              </h2>
              <p className="text-xs text-slate-500">
                {isMr ? 'आपली वैयक्तिक माहिती व नोंदणी तपशील' : 'Manage your environmental citizen account'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? (isMr ? 'रद्द करा' : 'Cancel') : (isMr ? 'बदला' : 'Edit')}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        {/* Avatar & Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-emerald-500/20 shadow-md">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  const newUrl = prompt('Enter new image URL for avatar:', avatar);
                  if (newUrl) setAvatar(newUrl);
                }}
                className="absolute inset-0 bg-black/50 text-white rounded-3xl flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer"
              >
                <Camera className="w-5 h-5 mb-1" />
                Change
              </button>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-extrabold text-slate-900">{user.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Verified Citizen
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{user.location}</span>
            </p>

            <p className="text-[11px] text-slate-400">
              EchoGuard Member since{' '}
              {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-emerald-900 leading-none block">
                {user.scansCount || 0}
              </span>
              <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
                {isMr ? 'एकूण स्कॅन' : 'Total Scans'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-teal-900 leading-none block">
                {user.reportsCount || 0}
              </span>
              <span className="text-xs text-teal-700 font-semibold mt-0.5 block">
                {isMr ? 'सादर अहवाल' : 'Reports Filed'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form OR View Details */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Primary Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Save Profile
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Mobile Number</span>
              </div>
              <span className="font-bold text-slate-900">{user.phone || '+91 98234 56789'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Email Address</span>
              </div>
              <span className="font-bold text-slate-900">{user.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2.5 text-slate-600">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>District / State</span>
              </div>
              <span className="font-bold text-slate-900">{user.location}</span>
            </div>
          </div>
        )}
      </div>

      {/* Language Preference Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm font-bold text-slate-900">
            {isMr ? 'भाषा प्राधान्य (Language)' : 'Display Language'}
          </h4>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onLanguageChange('en')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            English
          </button>
          <button
            onClick={() => onLanguageChange('bilingual')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              language === 'bilingual'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Bilingual (EN+मराठी)
          </button>
          <button
            onClick={() => onLanguageChange('mr')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              language === 'mr'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Supabase Cloud Database Connection */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {isMr ? 'सुपाबेस क्लाउड डेटाबेस' : 'Supabase Cloud Database'}
              </h4>
              <p className="text-[11px] text-slate-500">
                Sync user profiles, scan records & report history
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSupabaseModal(!showSupabaseModal)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            {showSupabaseModal ? 'Hide' : 'Configure'}
          </button>
        </div>

        {showSupabaseModal && (
          <div className="pt-3 border-t border-slate-100 space-y-4 text-xs">
            <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Supabase Project URL</label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={sbUrl}
                  onChange={(e) => setSbUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={sbKey}
                  onChange={(e) => setSbKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                />
              </div>

              {sbSuccessMsg && (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{sbSuccessMsg}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Supabase Keys
                </button>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                </button>
              </div>
            </form>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Dual Sync Architecture:</span>
              <p>
                EchoGuard runs instantly using persistent browser storage out-of-the-box. When you add your Supabase credentials, reports and profiles are automatically replicated to your cloud database with Row Level Security.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* About EchoGuard & Developer Credits */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900 leading-none">
              Echo<span className="text-emerald-600">Guard</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              "See Pollution. Understand It. Report It."
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Lead Engineer:</span>
            <span className="font-bold text-slate-900">Abhishek Jadhav</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Version:</span>
            <span className="font-mono text-slate-700">v2.4.0 (AI Vision Enabled)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Target Platforms:</span>
            <span className="font-medium text-emerald-700">Android PWA + Web App</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>{isMr ? 'लॉगआउट करा' : 'Sign Out of EchoGuard'}</span>
      </button>
    </div>
  );
};
