import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setError(null);
    setIsInitializing(true);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(
        'Unable to access camera. Please ensure camera permissions are granted in your browser settings or use file upload.'
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

    stopCamera();
    onCapture(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between text-white z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm tracking-wide">Live Environmental Scanner</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Viewfinder Center */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="max-w-xs text-center p-6 bg-slate-900/90 text-white rounded-2xl border border-red-500/40">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-sm font-medium mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
            >
              Retry Camera
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {/* Target Reticle */}
            <div className="absolute inset-8 pointer-events-none border border-emerald-400/40 rounded-2xl flex flex-col justify-between p-4">
              <div className="flex justify-between">
                <span className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                <span className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
              </div>
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-xs text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                  Align pollution or waste within view
                </span>
              </div>
              <div className="flex justify-between">
                <span className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                <span className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-around z-10">
        <button
          onClick={switchCamera}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95"
          title="Switch Camera (Front/Rear)"
        >
          <RefreshCw className="w-6 h-6" />
        </button>

        {/* Shutter Button */}
        <button
          onClick={handleCapture}
          disabled={Boolean(error) || isInitializing}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 group disabled:opacity-50 transition-all active:scale-90"
        >
          <div className="w-full h-full rounded-full bg-emerald-500 group-hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/40" />
        </button>

        <div className="w-12" />
      </div>
    </div>
  );
};
