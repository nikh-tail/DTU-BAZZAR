import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Apple,
  QrCode,
  Sparkles,
  Camera,
  Layers,
} from 'lucide-react';
import { Button } from '../components/common/Button.js';

interface DownloadAppPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DownloadAppPage: React.FC<DownloadAppPageProps> = ({ onNavigate }) => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/download/dtu-bazaar.apk';
    link.download = 'dtu-bazaar.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const appFeatures = [
    {
      icon: <Zap className="text-emerald-600" size={20} />,
      title: 'Instant Campus Chat & Push Alerts',
      desc: 'Get notified in real-time when a hostel peer bids or messages on your listed items.',
    },
    {
      icon: <Camera className="text-sky-600" size={20} />,
      title: 'Quick 1-Tap Camera Photo Upload',
      desc: 'Snap a picture of your lab drafter, books, or cycle and post directly to DTU Bazaar in 10s.',
    },
    {
      icon: <ShieldCheck className="text-amber-600" size={20} />,
      title: '100% Verified DTU Students',
      desc: 'Zero scammers and zero third-party brokers. Built exclusively for Delhi Technological University.',
    },
    {
      icon: <Layers className="text-purple-600" size={20} />,
      title: 'Offline-Fast & Lightweight',
      desc: 'Ultra-lean 8 MB native app that loads instantly even on spotty DTU campus Wi-Fi.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-8 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Top Header Badge */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-emerald-700 text-xs font-bold shadow-sm">
            <Sparkles size={14} />
            <span>DTU Bazaar Official Mobile Application</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-slate-950">
            Buy & Sell On Campus <br className="hidden sm:inline" />
            <span className="text-emerald-700">Right From Your Phone</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Get the full native mobile experience with instant chat notifications, 1-tap camera listings, and quick hostel meetups.
          </p>
        </div>

        {/* 2-Column Primary Download Grid (Android APK + iOS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Android Native App & Direct APK */}
          <div className="relative rounded-3xl bg-white border-2 border-lime-300 p-6 sm:p-8 flex flex-col justify-between shadow-md overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-lime-100 text-slate-950 inline-block border border-lime-200 shadow-sm">
                  <Smartphone size={28} />
                </div>
                <span className="px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-lime-900 text-[11px] font-black uppercase tracking-wider">
                  Direct Download
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950 mb-1">Android App (APK)</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Version 1.0.0 · Size: 8.0 MB · Compatible with Android 8.0+
                </p>
              </div>

              {/* Download APK Action Button */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="lime"
                  size="lg"
                  onClick={handleDownloadApk}
                  leftIcon={<Download size={20} className="stroke-[2.5]" />}
                  className="w-full shadow-glow font-black text-base py-4 text-slate-950"
                >
                  Download Android APK
                </Button>

                {downloadStarted && (
                  <div className="p-3 rounded-2xl bg-lime-50 border border-lime-200 text-lime-900 text-xs flex items-center gap-2 animate-fadeIn font-semibold">
                    <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600" />
                    <span>Download started! Open <code>dtu-bazaar.apk</code> from your notifications to install.</span>
                  </div>
                )}
              </div>

              {/* 3-Step Install Walkthrough */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Quick 3-Step Installation:
                </span>
                <div className="space-y-2 text-xs text-slate-700 font-medium">
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-900 text-[10px] font-black flex items-center justify-center border border-slate-200">
                      1
                    </span>
                    <span>Tap <strong>Download Android APK</strong> above.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-900 text-[10px] font-black flex items-center justify-center border border-slate-200">
                      2
                    </span>
                    <span>Open downloaded file and allow <em>"Install unknown apps"</em> if prompted.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-900 text-[10px] font-black flex items-center justify-center border border-slate-200">
                      3
                    </span>
                    <span>Tap <strong>Install</strong> & start buying/selling with DTU peers!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Play Store Badge Section */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Google Play Store Package: <code>com.dtubazaar.app</code></span>
              </div>
            </div>
          </div>

          {/* 2. Apple iOS (iPhone & iPad) App */}
          <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-md overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 inline-block border border-slate-200 shadow-sm">
                  <Apple size={28} />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
                  iOS & iPadOS
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950 mb-1">Apple iOS App</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Optimized for iPhone & iPad · Standalone Full-Screen App
                </p>
              </div>

              {/* iOS 1-Tap Home Screen Setup */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-900 block">
                    Install to iPhone Home Screen in 5 seconds:
                  </span>
                  <div className="space-y-2 text-xs text-slate-700 font-medium">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 text-slate-900 text-[10px] font-black flex items-center justify-center">
                        1
                      </span>
                      <span>Open <strong>dtu-bazzar.vercel.app</strong> in Safari on your iPhone.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 text-slate-900 text-[10px] font-black flex items-center justify-center">
                        2
                      </span>
                      <span>Tap the <strong>Share</strong> button (box with upward arrow) at the bottom.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 text-slate-900 text-[10px] font-black flex items-center justify-center">
                        3
                      </span>
                      <span>Select <strong>"Add to Home Screen"</strong> & tap Add.</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <Apple size={16} className="text-slate-800 flex-shrink-0" />
                  <span>Xcode Workspace & TestFlight build: <code>client/ios/App/App.xcworkspace</code></span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>App Store ID: <code>com.dtubazaar.app</code></span>
              <span className="text-emerald-700 font-bold">iOS 15.0+</span>
            </div>
          </div>
        </div>

        {/* Scan QR Code Section for Desktop Browsers */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <QrCode size={16} />
              <span>Browsing from Laptop or Desktop?</span>
            </div>
            <h3 className="text-xl font-black text-slate-950">Scan to Download on Your Phone</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md font-medium">
              Point your phone camera at this QR code to open the direct APK installer on your phone.
            </p>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex-shrink-0">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dtu-bazzar.vercel.app/download"
              alt="Scan to Download DTU Bazaar APK"
              className="w-32 h-32"
              loading="lazy"
            />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">Why Use the DTU Bazaar App?</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Built specifically for DTU hostelers & day scholars</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {appFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="p-2.5 rounded-xl bg-slate-50 w-fit border border-slate-200">{feat.icon}</div>
                <h4 className="text-sm font-bold text-slate-900">{feat.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Marketplace Link */}
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            size="md"
            onClick={() => onNavigate('home')}
            className="text-slate-600 hover:text-slate-900 font-bold"
          >
            ← Back to Campus Marketplace
          </Button>
        </div>
      </div>
    </div>
  );
};
