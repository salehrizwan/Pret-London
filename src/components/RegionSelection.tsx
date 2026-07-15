import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Region, RegionCode } from "../types";
import { Globe, ArrowRight, AlertTriangle } from "lucide-react";

interface RegionSelectionProps {
  onRegionSelect: (regionCode: RegionCode) => void;
}

export const REGIONS: Record<RegionCode, Region> = {
  PK: {
    code: "PK",
    name: "Pakistan Store",
    flag: "🇵🇰",
    currency: "PKR",
    currencySymbol: "Rs.",
    shippingNote: "Free Pakistan Shipping • 50% Advance Booking Deposit Required",
    paymentOptions: ["Direct Bank Transfer"]
  },
  AE: {
    code: "AE",
    name: "UAE Store",
    flag: "🇦🇪",
    currency: "AED",
    currencySymbol: "AED",
    shippingNote: "Express UAE Courier • 100% Full Advance Payment Required",
    paymentOptions: ["Direct HBL Bank Transfer"]
  },
  US: {
    code: "US",
    name: "USA Store",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    shippingNote: "Express USA Delivery • 100% Full Advance Payment Required",
    paymentOptions: ["Direct HBL Bank Transfer"]
  },
  GB: {
    code: "GB",
    name: "United Kingdom Store",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    shippingNote: "Express UK Delivery • 100% Full Advance Payment Required",
    paymentOptions: ["Direct HBL Bank Transfer"]
  }
};

export default function RegionSelection({ onRegionSelect }: RegionSelectionProps) {
  const [detectedCode, setDetectedCode] = useState<RegionCode>("PK");
  const [selectedCode, setSelectedCode] = useState<RegionCode | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Detect region using browser timezone info
    let detected: RegionCode = "PK";
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
      if (tz.includes("karachi") || tz.includes("asia/kabul") || tz.includes("lahore")) {
        detected = "PK";
      } else if (tz.includes("dubai") || tz.includes("asia/dubai") || tz.includes("muscat")) {
        detected = "AE";
      } else if (tz.includes("london") || tz.includes("europe/london") || tz.includes("europe/dublin")) {
        detected = "GB";
      } else if (tz.includes("america") || tz.includes("us/") || tz.includes("pacific/") || tz.includes("eastern")) {
        detected = "US";
      } else {
        // Fallback default or detect based on locale
        const locale = navigator.language.toLowerCase();
        if (locale.includes("pk")) detected = "PK";
        else if (locale.includes("ae")) detected = "AE";
        else if (locale.includes("gb") || locale.includes("uk")) detected = "GB";
        else if (locale.includes("us")) detected = "US";
        else detected = "PK"; // Default to Pakistan - do NOT assume London
      }
    } catch (e) {
      detected = "PK";
    }

    setDetectedCode(detected);
  }, []);

  const handleCardClick = (code: RegionCode) => {
    onRegionSelect(code);
  };

  const handleConfirmWarning = () => {
    if (selectedCode) {
      onRegionSelect(selectedCode);
    }
    setShowWarning(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C5A880]/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C5A880]/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto w-full border-b border-[#C5A880]/20 pb-4">
        <span className="font-serif text-lg tracking-[0.3em] text-[#1A1A1A]">P R E T</span>
        <div className="flex items-center gap-2 text-xs tracking-[0.1em] text-gray-500 uppercase">
          <Globe className="w-3 h-3 text-[#C5A880]" />
          <span>Curated Shopping Experiences</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12 flex flex-col items-center">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.4em] text-[#C5A880] block mb-3">Welcome to PRET Studio London</span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-wide text-gray-900 mb-4 font-light">
            Please Select Your Region
          </h2>
          <p className="text-gray-500 text-xs md:text-sm tracking-wider max-w-md mx-auto leading-relaxed">
            Select your delivery destination to view tailored pricing, pre-order timelines, and secure localized checkout options.
          </p>
        </div>

        {/* Region Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {(["PK", "GB", "US", "AE"] as RegionCode[]).map((key) => {
            const region = REGIONS[key];
            const isDetected = key === detectedCode;
            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(key)}
                className="group cursor-pointer border border-[#C5A880]/20 hover:border-[#C5A880] p-6 bg-white rounded-sm shadow-xs transition-all duration-300 relative flex flex-col justify-between h-40 overflow-hidden"
              >
                {/* Detected Region Accent Line */}
                {isDetected && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C5A880]"></div>
                )}

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" role="img" aria-label={region.name}>
                      {region.flag}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl text-gray-900 group-hover:text-[#C5A880] transition-colors duration-300">
                        {region.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                        CURRENCY: {region.currency}
                      </p>
                    </div>
                  </div>

                  {isDetected && (
                    <span className="text-[9px] bg-[#C5A880]/15 text-[#9D845F] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      📍 Detected Region
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 tracking-wider">
                    {region.shippingNote}
                  </span>
                  <span className="p-1 border border-gray-100 rounded-full group-hover:bg-[#C5A880]/10 group-hover:border-[#C5A880]/30 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880]" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center max-w-6xl mx-auto w-full pt-6 border-t border-[#C5A880]/10 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 tracking-widest gap-2">
        <span>© {new Date().getFullYear()} PRET STUDIO LONDON LTD.</span>
        <span>CRAFTED IN LONDON & PAKISTAN. PRE-ORDER WORLDWIDE.</span>
      </footer>

      {/* Geolocation/Browse Override Friendly Info Modal */}
      <AnimatePresence>
        {showWarning && selectedCode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#C5A880]/30 max-w-md w-full p-6 md:p-8 rounded-sm shadow-xl text-center"
            >
              <div className="w-12 h-12 bg-[#F9F6F0] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C5A880]/20">
                <Globe className="w-6 h-6 text-[#9D845F]" />
              </div>

              <h3 className="font-serif text-2xl text-gray-900 mb-3">
                Entering the {REGIONS[selectedCode]?.name} Store
              </h3>
              
              <div className="text-gray-600 text-sm leading-relaxed mb-6 space-y-3">
                <p>
                  You are switching your store region to <span className="font-bold text-gray-900">{REGIONS[selectedCode]?.flag} {REGIONS[selectedCode]?.name}</span>.
                </p>
                <div className="bg-[#F9F6F0] border border-[#C5A880]/20 p-3 text-xs rounded-sm text-left text-gray-700 space-y-2">
                  <p className="font-semibold text-gray-900">✨ Store settings updated:</p>
                  <p>• Prices will be displayed in <span className="font-semibold text-gray-900">{REGIONS[selectedCode]?.currency} ({REGIONS[selectedCode]?.currencySymbol})</span>.</p>
                  {selectedCode === "PK" ? (
                    <p>• Ordering from Pakistan requires a <span className="font-semibold text-green-700">50% booking deposit</span>.</p>
                  ) : (
                    <p>• International clients require a <span className="font-semibold text-amber-700">100% full advance payment</span>.</p>
                  )}
                  <p>• {REGIONS[selectedCode]?.shippingNote}.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleConfirmWarning}
                  className="w-full py-2.5 text-xs tracking-wider uppercase bg-[#1C1C1C] hover:bg-[#C5A880] text-white font-semibold transition-colors duration-300 rounded-xs"
                >
                  Proceed to Atelier
                </button>
                <button
                  onClick={() => setShowWarning(false)}
                  className="w-full py-2 text-xs tracking-wider uppercase border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors duration-300 text-[10px]"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
