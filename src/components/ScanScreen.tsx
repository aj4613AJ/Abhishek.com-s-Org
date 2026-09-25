import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  Video,
  MapPin,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Edit2,
  X,
  Check,
  Eye,
  Info,
} from 'lucide-react';
import { ReportLocation, PollutionAnalysis } from '../types';
import { LanguageMode, i18nText, sampleImagesList } from '../i18n';
import { detectCurrentLocation } from '../services/location';
import { LiveCameraModal } from './LiveCameraModal';

interface ScanScreenProps {
  language: LanguageMode;
  onAnalysisSuccess: (analysis: PollutionAnalysis, image: string, location: ReportLocation, notes: string) => void;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({
  language,
  onAnalysisSuccess,
}) => {
  const isMr = language === 'mr';
  const isBilingual = language === 'bilingual';

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [location, setLocation] = useState<ReportLocation>({
    address: 'Bund Garden, Pune, Maharashtra',
    latitude: 18.5362,
    longitude: 73.8789,
    city: 'Pune',
    state: 'Maharashtra',
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [manualAddressInput, setManualAddressInput] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-detect GPS location on mount
  useEffect(() => {
    handleRefreshLocation();
  }, []);

  const handleRefreshLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await detectCurrentLocation();
      setLocation(loc);
      setManualAddressInput(loc.address);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSaveManualLocation = () => {
    if (manualAddressInput.trim()) {
      setLocation((prev) => ({
        ...prev,
        address: manualAddressInput.trim(),
      }));
    }
    setIsEditingLocation(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        setAnalysisError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: (typeof sampleImagesList)[0]) => {
    setSelectedImage(sample.imageUrl);
    setMimeType('image/jpeg');
    setLocation((prev) => ({
      ...prev,
      address: sample.location,
    }));
    setManualAddressInput(sample.location);
    setUserNotes(`Observed in field at ${sample.location}. Visual indicators of ${sample.category}.`);
    setAnalysisError(null);
  };

  const handleLiveCameraCapture = (capturedBase64: string) => {
    setSelectedImage(capturedBase64);
    setMimeType('image/jpeg');
    setAnalysisError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-pollution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType,
          location,
          userNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error (${response.status})`);
      }

      const analysisResult: PollutionAnalysis = await response.json();
      onAnalysisSuccess(analysisResult, selectedImage, location, userNotes);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.message || 'Failed to complete AI analysis. Please verify image and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Live Camera Viewfinder Modal */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={handleLiveCameraCapture}
      />

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isMr ? 'पर्यावरण प्रदूषण स्कॅनर' : 'AI Pollution Scanner'}
            </h2>
            <p className="text-xs text-slate-500">
              {isMr
                ? 'कचरा, धूर किंवा पाण्याच्या प्रदूषणाचा फोटो घ्या'
                : 'Upload or capture environmental waste, smoke, or water pollution'}
            </p>
          </div>
        </div>
      </div>

      {/* Image Capture & Preview Area */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        {selectedImage ? (
          /* Preview state */
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-200 group">
              <img
                src={selectedImage}
                alt="Environmental scan preview"
                className="w-full h-full object-cover"
              />

              {/* Scanning Overlay Animation while analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-3" />
                  <p className="font-extrabold text-sm text-emerald-300 animate-pulse tracking-wide">
                    {isMr ? 'AI नमुना तपासणी सुरू आहे...' : 'Analyzing Visual Spectrum...'}
                  </p>
                  <p className="text-xs text-slate-200 mt-1 text-center">
                    {isMr
                      ? 'प्लास्टिक, कचरा, धूर व जलप्रदूषण तपासत आहे'
                      : 'Scanning for plastic, particulate matter & toxic runoff'}
                  </p>
                </div>
              )}

              {/* Retake Button */}
              {!isAnalyzing && (
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isMr ? 'बदला' : 'Change Image'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" />
                {isMr ? 'प्रतिमा तयार आहे' : 'Image ready for AI inspection'}
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-emerald-700 font-bold hover:underline"
              >
                {isMr ? 'दुसरा फोटो निवडा' : 'Retake'}
              </button>
            </div>
          </div>
        ) : (
          /* Empty capture buttons state */
          <div className="space-y-4">
            <div className="border-2 border-dashed border-emerald-200 rounded-3xl p-6 sm:p-8 text-center bg-emerald-50/30 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 shadow-md flex items-center justify-center mb-3">
                <Camera className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {isMr ? 'प्रदूषणाचा फोटो कॅप्चर करा' : 'Capture or Upload Pollution Photo'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                {isMr
                  ? 'प्लास्टिक कचरा, सांडपाणी, हवेतील धूर किंवा अस्वच्छता दाखवणारा फोटो'
                  : 'Clear photos of plastic accumulation, contaminated drains, smog, or solid waste'}
              </p>

              {/* Primary action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-md mt-5">
                {/* Take Photo */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isMr ? 'कॅमेरा उघडा' : 'Take Photo'}</span>
                </button>

                {/* Live Camera Viewfinder */}
                <button
                  onClick={() => setIsLiveCameraOpen(true)}
                  className="px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>{isMr ? 'लाइव्ह व्ह्यू' : 'Live Camera'}</span>
                </button>

                {/* Upload Gallery */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>{isMr ? 'गॅलरीमधून निवडा' : 'Gallery'}</span>
                </button>
              </div>
            </div>

            {/* Ready-to-Test Sample Images */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {isMr ? 'किंवा चाचणी फोटो निवडा (1-क्लिक)' : 'Or Test with Sample Photos (1-Click)'}
                </span>
                <span className="text-[10px] text-slate-400">Instant AI Demo</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sampleImagesList.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="group text-left p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer bg-white"
                  >
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100 mb-1.5">
                      <img
                        src={sample.imageUrl}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700">
                      {isMr ? sample.title_mr : sample.title}
                    </p>
                    <p className="text-[9px] text-emerald-600 font-semibold">{sample.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location Section */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {isMr ? 'घटनेचे ठिकाण (Location)' : 'Incident Location'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshLocation}
                disabled={isLocating}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                title="Refresh GPS Location"
              >
                <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? (isMr ? 'शोधत आहे...' : 'Locating...') : (isMr ? 'जीपीएस' : 'GPS')}</span>
              </button>
              <button
                onClick={() => setIsEditingLocation(!isEditingLocation)}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isMr ? 'बदला' : 'Edit'}</span>
              </button>
            </div>
          </div>

          {isEditingLocation ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={manualAddressInput}
                onChange={(e) => setManualAddressInput(e.target.value)}
                placeholder="Enter landmark, street, city..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                onClick={handleSaveManualLocation}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium truncate">{location.address}</span>
              </div>
              {location.latitude && (
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                  {location.latitude.toFixed(2)}°, {location.longitude?.toFixed(2)}°
                </span>
              )}
            </div>
          )}
        </div>

        {/* Optional User Field Observations */}
        <div className="border-t border-slate-100 pt-4 space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {isMr ? 'अतिरिक्त निरीक्षणे (ऐच्छिक)' : 'Field Observations / Notes (Optional)'}
          </label>
          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            rows={2}
            placeholder={
              isMr
                ? 'उदा. दुर्गंधी येत आहे, जवळ शाळा आहे, कचरा जाळला जात आहे...'
                : 'e.g. Strong chemical odor, ongoing plastic burning, adjacent to public water source...'
            }
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none font-medium"
          />
        </div>

        {/* Error Notice */}
        {analysisError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">{isMr ? 'विश्लेषण त्रुटी' : 'Analysis Notice'}</p>
              <p className="mt-0.5">{analysisError}</p>
            </div>
          </div>
        )}

        {/* ANALYZE WITH AI BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || isAnalyzing}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-700/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{isMr ? 'AI विश्लेषण चालू आहे...' : 'Analyzing with AI...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>{isMr ? 'AI सह विश्लेषण करा' : 'Analyze with AI'}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-600 text-center mt-2 flex items-center justify-center gap-1">
            <Info className="w-3 h-3 text-slate-600" />
            <span>
              {isMr
                ? 'एआय विश्लेषण केवळ दृश्य निरीक्षणावर आधारित प्राथमिक संकेत देते.'
                : 'AI analysis provides an observational environmental indication.'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
